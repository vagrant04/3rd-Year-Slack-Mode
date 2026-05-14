以下是**旅行规划自治Agent平台**的详细需求文档，包含系统架构、前后端模块划分、核心接口规范（内部组件间、Agent与评估平台间、Agent前后端间），供6人团队并行开发使用。

---

## 旅行规划自治Agent平台 – 详细需求文档 v2.0

### 1. 引言

本文档描述“旅行规划自治Agent”的完整产品需求，涵盖Agent核心推理、工具集成、用户交互、状态可视化及对外接口。系统支持**CLI交互模式**和**Web可视化模式**两种形态，并提供标准化API供评估平台调用。后端基于LangGraph框架构建智能体状态图，前端通过WebSocket实时展示Agent思考与执行轨迹。

### 2. 系统概述

**2.1 产品定位**

一个面向旅行规划场景的LLM自治Agent，通过自然语言与用户交互，能够自主规划旅行行程、调用外部工具获取信息、并在遇到异常（天气突变、时间冲突、预算超支）时自动修正计划。同时提供实时状态可视化能力，帮助开发者和用户理解Agent的推理过程。

**2.2 核心特性**

- 混合推理框架：融合ReAct与Plan-and-Execute，展现多步规划与单步决策能力
- 4个主题相关的模拟/真实工具调用：景点搜索、天气查询、交通计算、预算估算
- 3类动态自我修正：天气突变、时间冲突、预算超支
- 状态可视化：CLI日志或Web看板实时展示Thought→Action→Observation→修正决策
- 标准化HTTP+WebSocket API，支持评估平台远程触发评测并获取完整执行Trace

**2.3 与技术选型**

| 组件               | 技术选型                    |
| ------------------ | --------------------------- |
| LLM                | DeepSeek Chat API           |
| Agent框架          | LangGraph                   |
| 后端               | Python (FastAPI)            |
| 前端（状态可视化） | React + D3.js/Recharts      |
| 实时通信           | WebSocket (FastAPI原生支持) |
| 环境变量管理       | python-dotenv               |

---

### 3. 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户交互层                         │
│  ┌──────────────┐              ┌─────────────────────┐  │
│  │  CLI 客户端  │              │  Web可视化前端      │  │
│  │  (Python)    │              │  (React)            │  │
│  └──────┬───────┘              └─────────┬───────────┘  │
│         │  stdin/stdout                  │ WebSocket /  │
│         │                                │ HTTP REST    │
└─────────┼────────────────────────────────┼──────────────┘
          │                                │
┌─────────┴────────────────────────────────┴──────────────┐
│                     Agent 服务层 (FastAPI)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │                REST API 路由                     │  │
│  │  POST /chat/start       启动交互会话           │  │
│  │  POST /chat/message     发送消息/需求          │  │
│  │  GET  /session/{id}     获取会话状态           │  │
│  │  GET  /session/{id}/trace  获取完整Trace日志    │  │
│  │  POST /eval/run         供评估平台调用          │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────┴───────────────────────────┐  │
│  │           WebSocket 管理器                       │  │
│  │  ws://host/ws/{session_id}  实时推送Agent状态    │  │
│  └──────────────────────┬───────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────┴───────────────────────────┐  │
│  │              Agent 核心引擎 (LangGraph)          │  │
│  │   ┌────────────────┐  ┌────────────────────┐   │  │
│  │   │  状态图定义    │  │  混合推理编排      │   │  │
│  │   │  (StateGraph)  │  │  (ReAct + P&E)     │   │  │
│  │   └────────┬───────┘  └────────┬───────────┘   │  │
│  │            │                    │               │  │
│  │   ┌────────┴────────────────────┴───────────┐  │  │
│  │   │         工具执行器 (ToolExecutor)       │  │  │
│  │   └────────┬───────────────────────────────┘  │  │
│  └────────────┼──────────────────────────────────┘  │
└───────────────┼─────────────────────────────────────┘
                │
┌───────────────┴─────────────────────────────────────┐
│                  工具层 (BaseTool)                   │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐  │
│  │ 景点搜索 │ │ 天气查询 │ │交通计算│ │预算计算 │  │
│  └──────────┘ └──────────┘ └────────┘ └─────────┘  │
└─────────────────────────────────────────────────────┘
```

**架构说明**：
- **Agent服务层**是整个系统的中枢，对外提供REST API和WebSocket接口，对内通过LangGraph执行Agent逻辑。
- **前端**通过WebSocket获取状态流实时渲染；CLI客户端通过stdin/stdout与同一套Agent核心直接交互（无网络开销，适合开发调试）。
- **评估平台**通过调用 `POST /eval/run` 接口触发评测，并调用 `GET /session/{id}/trace` 获取结构化日志用于指标计算。

---

### 4. 功能模块详细需求

#### 4.1 Agent核心引擎（第一组：麦迅宁、孔祥岳）

**4.1.1 状态图设计**

基于LangGraph定义Agent的有限状态机，包含以下关键节点：

- `planner`: 接收用户需求，生成宏观行程计划（Plan）。调用LLM输出“Day1:... Day2:...”结构化草案。
- `executor`: 按顺序执行每日计划，对每一个待确认的事项进入ReAct循环。
- `react_loop`: ReAct循环体，包含：
  - `agent_think`: LLM决策是否需要调用工具？调用哪个工具？
  - `tool_execute`: 执行工具调用（景点搜索/天气等），并将结果写回状态。
  - `observer`: 解析工具返回，发现是否异常（无结果、冲突等）。
- `correction`: 专用修正节点，根据异常类型（天气/时间/预算）执行重规划逻辑。
- `finalize`: 组装最终行程，输出给用户。

节点间的条件边：
- `executor` → `react_loop` (继续执行当天剩余步骤)
- `react_loop` → `observer` → `react_loop` (继续思考) 或 → `correction` (需要修正) 或 → `executor` (当天完成)
- `correction` → `executor` (重试当天计划)

**4.1.2 混合推理能力**

- **Plan-and-Execute**：planner节点首先生成完整的每日概要计划（如“Day1: 上午西湖，下午灵隐寺”），然后交给executor逐步执行。
- **ReAct**：executor执行每日计划时，对每个景点需调用交通工具确认通勤可行性，调用天气工具确认是否适宜，此为单步的“思考-行动-观察”循环。
- **自我修正触发**：
  - 天气：在确认全天行程后，executor **再次调用**天气工具，若与计划时的天气出现突变（如暴雨），自动跳转correction节点。
  - 时间：交通工具返回的通勤时间 + 景点游玩时间 > 可用时间，触发时间冲突修正。
  - 预算：完成全天规划后调用预算工具，若总费用超支，触发预算修正。

**4.1.3 状态数据模型**

Agent状态定义（LangGraph `State`）：
```python
class AgentState(TypedDict):
    messages: List[BaseMessage]        # 对话历史
    plan: Optional[Dict]               # 宏观计划 {"days": [{"day":1,"activities":[...]}]}
    current_day: int                   # 当前执行的天数
    tool_results: Dict[str, Any]       # 存储工具调用结果
    correction_attempts: int           # 已修正次数（防止无限循环）
    final_itinerary: Optional[Dict]    # 最终确认的行程
    status: str                        # "planning"/"executing"/"correcting"/"finished"
```

**4.1.4 内部接口：工具绑定**

Agent引擎通过LangChain的`bind_tools`机制将4个工具函数注册到LLM上。核心引擎不直接调用工具，而是依赖`ToolExecutor`模块（见§5.1）执行实际的API调用。这种解耦设计允许工具层独立开发调试。

**4.1.5 ToolExecutor 工作流程**

ToolExecutor 负责：
1. 接收 LLM 生成的工具调用请求（函数名和参数）。
2. 调用对应的工具实例的 `execute` 方法。
3. 将工具返回的结果标准化（确保包含 `status`, `data/error`）。
4. 生成一条 `tool_call` 事件（包含参数和耗时）和一条 `observation` 事件（包含结果摘要），写入 trace。
5. 将结果存入 `AgentState.tool_results` 中，键为工具名，值为标准化结果，供后续节点使用。

#### 4.2 交互接口模块（第一组 & 第三组协作）

**4.2.1 CLI交互模式**

- 实现一个Python命令行程序 `travel_agent_cli.py`
- 交互流程：
  1. 启动后打印欢迎信息，等待用户输入旅行需求。
  2. 将用户输入发送给Agent核心的`run()`函数（阻塞调用）。
  3. 在`run()`执行过程中，通过回调函数将状态变化实时输出到终端：
     - `[思考]` 显示Agent当前的推理文字
     - `[工具调用]` 显示工具名、参数、耗时
     - `[观察]` 显示工具返回摘要
     - `[修正]` 显示修正原因及动作
- 支持命令：`/quit` 退出，`/status` 显示当前状态

**4.2.2 Web接口（HTTP REST）**

提供以下REST API端点，使得Agent可以作为服务被Web前端和评估平台调用。

**接口详情表**：

| 方法 | 路径                               | 描述                                         | 请求体                                   | 响应体                                                |
| ---- | ---------------------------------- | -------------------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| POST | `/api/sessions`                    | 创建新会话                                   | `{"user_id": str, "config": {}} `        | `{"session_id": "uuid", "status": "created"}`         |
| POST | `/api/sessions/{session_id}/chat`  | 发送用户消息，触发Agent规划                  | `{"message": "北京3日游，预算3000"}`     | `{"session_id": "...", "status": "processing"}`       |
| GET  | `/api/sessions/{session_id}`       | 获取会话当前状态                             | -                                        | `AgentState` JSON                                     |
| GET  | `/api/sessions/{session_id}/trace` | 获取完整执行Trace日志                        | -                                        | `{"trace": [step1, step2, ...]}`                      |
| POST | `/api/eval/run`                    | 评估平台专用：传入测试用例，直接返回规划结果 | `{"input": "...", "session_config": {}}` | `{"output": {...}, "trace": [...], "metrics": {...}}` |

**请求/响应示例**：

`POST /api/sessions/{id}/chat` 请求：
```json
{
  "message": "我想从南京出发去杭州玩3天，人均预算1500元，喜欢自然风景"
}
```

处理中状态响应（同步返回，实际任务异步执行）：
```json
{
  "session_id": "abc123",
  "status": "processing",
  "ws_endpoint": "ws://host/ws/abc123"
}
```

**`POST /api/eval/run` 请求体**：
```json
{
  "input": "用户需求文本",
  "session_config": {}
}
```

**`POST /api/eval/run` 响应体**：
```json
{
  "output": {
    "itinerary": { ... },
    "final_response": "生成的最终回复文本"
  },
  "trace": [
    {
      "timestamp": "2026-05-06T10:00:00Z",
      "event_type": "thought",
      "session_id": "eval-session-uuid",
      "data": { "content": "思考内容" }
    },
    {
      "timestamp": "2026-05-06T10:00:01Z",
      "event_type": "tool_call",
      "session_id": "eval-session-uuid",
      "data": { "tool_name": "search_attractions", "params": {...}, "duration_ms": 230 }
    },
    ...
  ],
  "metrics": {
    "elapsed_time_seconds": 34.5,
    "total_tokens": 1234
  }
}
```
```

**异步设计**：`/chat` 请求立即返回，Agent在后台异步执行。WebSocket或轮询`GET /sessions/{id}`可用于获取实时状态。

**4.2.3 WebSocket接口**

- 端点：`ws://<host>/ws/{session_id}`
- 协议：服务端主动推送JSON消息流，每条消息包含：
  - `type`: `"thought" | "tool_call" | "observation" | "correction" | "final" | "error"`
  - `timestamp`: ISO 8601
  - `data`: 具体内容（结构化）

示例消息序列：
```json
{"type":"thought","data":{"content":"用户预算1500元，3天。先搜索杭州自然景区。"}}
{"type":"tool_call","data":{"tool_name":"search_attractions","params":{"keyword":"自然风景","city":"杭州"},"timestamp":"2026-05-06T10:00:01Z"}}
{"type":"observation","data":{"tool":"search_attractions","result_summary":"找到15个景点","duration_ms":230}}
{"type":"correction","data":{"reason":"时间冲突","action":"移除灵隐寺，替换为九溪烟树"}}
{"type":"final","data":{"itinerary":{...}}}
```

**前端职责**：Web可视化前端连接到该WebSocket，解析消息并渲染状态流转图、工具调用时序图、当前进度条等。

#### 4.3 状态可视化前端（第三组：张天翔、李屹帆 辅助第一组）

**4.3.1 功能性要求**

- **实时状态面板**：展示Agent当前状态（planning/executing/correcting/finished），类似交通灯指示。
- **思考链（Chain-of-Thought）**：滚动显示“Thought”文本，类似聊天框的思考气泡。
- **工具调用监控**：以表格形式记录每一次工具调用，列：时间、工具名、参数、耗时、结果摘要。
- **执行轨迹图**：基于Trace日志，绘制Agent在各个节点间的跳转路径（节点图或泳道图）。
- **最终行程展示**：当状态为finished时，渲染格式化的行程计划卡片。

**4.3.2 技术约束**

- 前端需为单页应用，使用React框架。
- 图表使用Recharts或D3.js。
- 与后端通信仅通过WebSocket + REST（获取初始会话列表等）。
- 状态管理使用React Context或Zustand。

#### 4.4 评估平台集成接口（供第三组评估平台使用）

Agent平台需暴露 `/api/eval/run` 接口支持自动评测，具体已在§4.2.2中列出。评估平台通过该接口批量运行测试用例，直接获取结果和Trace。要求：

- **无状态设计**：`POST /api/eval/run` 每次调用都独立创建一个内部的临时会话，不依赖外部会话管理，规划完成后立即返回结果并销毁内部状态，实现无状态。
- 返回体必须包含完整的`trace`数组，方便评估平台按多维度计算指标。

---

### 5. 接口规范（详细设计）

#### 5.1 工具执行接口（Agent核心 ↔ 工具层）

所有工具必须实现统一抽象基类 `BaseTool`，定义如下接口：

```python
from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseTool(ABC):
    """工具抽象基类，用于Agent核心与工具层的解耦"""
    
    @property
    @abstractmethod
    def name(self) -> str:
        """工具名称，用于LLM function calling"""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """工具描述，为LLM提供功能说明"""
        pass
    
    @property
    @abstractmethod
    def parameters(self) -> Dict[str, Any]:
        """工具的JSON Schema参数定义"""
        pass
    
    @abstractmethod
    def execute(self, **kwargs) -> Dict[str, Any]:
        """执行工具，返回标准化结果字典"""
        pass

    def to_openai_function(self) -> Dict:
        """转换为OpenAI/DeepSeek function calling格式"""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters,
            }
        }
```

**返回结果规范**：
```python
{
    "status": "success" | "error",
    "data": {...},               # 成功时的具体数据
    "error": {"code": "...", "message": "..."}  # 失败时
}
```

各工具的具体参数和输出已在前一版工具需求文档中定义，此处不赘述。

#### 5.2 Trace日志数据模型

Agent运行全过程产生的每一步操作都将记录为`TraceEvent`，供状态可视化和评估平台使用。数据结构：

```python
class TraceEvent(BaseModel):
    timestamp: str            # ISO 8601
    event_type: str           # "thought" | "tool_call" | "observation" | "correction" | "final" | "error"
    session_id: str
    data: Dict[str, Any]      # 根据类型不同而变化
```

**event_type 含义**：
- **thought**: LLM 推理内容（data.content）
- **tool_call**: 工具调用开始（data.tool_name, params, duration_ms 等）
- **observation**: 工具调用结果摘要（data.tool_name, result_summary, duration_ms）
- **correction**: 触发自我修正（data.reason, action）
- **final**: 输出最终结果（data.itinerary, final_response）
- **error**: 出现错误（data.message）

日志存储：每个会话在内存中维持一个列表，会话结束后可持久化到JSON文件（用于后续对比分析）。

#### 5.3 Agent服务配置接口

提供一个`/api/config`端点返回当前加载的工具列表、LLM模型名称、可用模拟模式等元数据，方便前端动态展示能力。

---

### 6. 非功能性需求

| 需求类型     | 详细说明                                                     |
| ------------ | ------------------------------------------------------------ |
| **安全性**   | API Key不可出现在前端代码或日志中；所有环境变量在服务器端读取。 |
| **性能**     | Agent规划过程最长响应时间不超过60秒（含多次工具调用），WebSocket消息延迟低于200ms。 |
| **并发**     | 支持同时5个会话执行（评估时可能并行跑多个测试用例）。        |
| **可扩展性** | 工具层新增工具只需实现`BaseTool`并注册到工具列表中即可被Agent识别。 |
| **可观测性** | 所有Agent运行日志同时输出到标准输出（容器环境）和WebSocket，便于调试。 |
| **Mock支持** | 通过环境变量`MOCK_MODE=true`全局切换至模拟工具数据，无需任何API Key即可完整运行演示。 |

---

### 7. 附录：项目文件结构参考

```
agent-platform/
├── backend/
│   ├── main.py                 # FastAPI应用入口，路由注册
│   ├── config.py               # 环境变量加载
│   ├── agent/
│   │   ├── graph.py            # LangGraph状态图定义
│   │   ├── state.py            # AgentState定义
│   │   └── nodes/              # 各节点实现
│   ├── tools/                  # 工具层（位于 agent-platform 内部）
│   │   ├── base.py             # BaseTool 抽象基类定义
│   │   ├── attraction.py       # 景点搜索工具
│   │   ├── weather.py          # 天气查询工具
│   │   ├── transport.py        # 交通计算工具
│   │   └── budget.py           # 预算计算工具
│   ├── api/
│   │   ├── sessions.py         # 会话管理API
│   │   └── eval.py             # 评估接口
│   ├── ws/
│   │   └── manager.py          # WebSocket管理
│   └── schemas/
│       └── trace.py            # TraceEvent模型
├── cli/
│   └── app.py                  # CLI客户端
├── frontend/                   # (可选) 如果采用Web可视化
│   └── ...
└── .env.example
```

**文件结构说明**：
- 工具层位于 `agent-platform/backend/tools/` 目录下，与 Agent 核心同属一个后端项目。
- `tools/base.py` 定义 `BaseTool` 抽象基类，所有具体工具类必须继承并实现该基类。
- 这种设计确保了工具层与 Agent 核心的紧密集成，同时保持模块化以便独立开发和测试。

---

此文档明确了Agent平台内部各组件的交互接口、与前端/评估平台的API契约，以及开发约束。第一组可据此搭建Agent后端服务，第二组实现工具层并遵循`BaseTool`规范，第三组并行开发评估平台前端及平台后端调用这些API。