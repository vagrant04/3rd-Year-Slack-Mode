# Day 09: 架构视图 + 架构风格 + 文档化

> 学习时间：30分钟 | 重要程度：★★★★★（每年必考Views映射题）
> 参考资料：复习资料/笔记/系统架构（简）.pdf p44-51, Exam0往年题

---

## 一、三大架构视图类别

### 1. Module Views（模块视图）—— 静态结构

**关注点**：系统如何被构建为一组实现单元？

| 元素 | 关系 | 示例视图 |
|------|------|----------|
| Module（模块） | Is-part-of, Depends-on, Is-a | 分解视图、使用视图、泛化视图、分层视图、领域模型视图、数据模型视图 |

**用途**：
- 代码构造的蓝图
- 变更影响分析
- 增量开发规划
- 需求可追溯性分析
- 工作分配

### 2. Component-and-Connector Views (C&C视图) —— 运行时结构

**关注点**：系统如何构建为一组运行时行为和交互的元素？

| 元素 | 关系 | 示例视图 |
|------|------|----------|
| Component（组件）, Connector（连接器） | Attachment, Interface Delegation | 管道-过滤器视图、客户端-服务器视图、点对点视图、SOA视图、发布-订阅视图 |

**约束（重要！）**：
- 组件只能连接到连接器（不能直接连另一个组件）
- 连接器只能连接到组件（不能直接连另一个连接器）
- 连接器不能独立存在，必须附着在组件上

**用途**：
- 展示系统如何工作
- 指导开发（运行时结构和行为）
- 推理运行时质量属性（性能、可用性）

### 3. Allocation Views（分配视图）—— 映射关系

**关注点**：系统与非软件环境的关系？

| 元素 | 关系 | 示例视图 |
|------|------|----------|
| Software Element + Environmental Element | Allocated-to | 部署视图、安装视图、工作分配视图 |

**用途**：
- 性能、可用性、安全推理
- 分布式开发的工作分配
- 系统安装和部署规划

---

## 二、视图映射题（年年必考！）

### 考题模式：给出一个架构模式/风格，判断属于哪类视图

| 架构模式/风格 | 所属视图类别 | 原因 |
|-------------|-----------|------|
| **Layered（分层）** | Module | 关注代码组织和依赖关系（静态） |
| **Pipe-and-Filter** | C&C | 关注运行时数据流和处理（动态） |
| **Client-Server** | C&C | 关注运行时组件交互 |
| **SOA** | C&C | 关注运行时服务交互 |
| **Publish-Subscribe** | C&C | 关注运行时事件传递 |
| **Peer-to-Peer** | C&C | 关注运行时节点交互 |
| **Shared-Data** | C&C | 关注运行时数据访问 |
| **Multi-Tier** | Allocation | 关注组件到物理环境的映射 |
| **Map-Reduce** | Allocation | 关注计算到处理器的分配 |
| **Deployment** | Allocation | 软件到硬件的映射 |

### 考试常见错误区分：

**Layer vs Tier**：
| Layer（层） | Tier（层/级） |
|-------------|--------------|
| 逻辑层（Module视图） | 物理层（Allocation视图） |
| 关注代码组织和依赖 | 关注部署环境分配 |
| 模块间allowed-to-use | 组件到计算平台的映射 |
| 强依赖关系约束 | 无强依赖约束 |

---

## 三、4+1 视图模型（Kruchten）

```
                    ┌─────────────────┐
                    │  Use Case View  │ (场景视图)
                    │   (+1)          │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────┴───┐    ┌────────┴────┐    ┌───────┴────────┐
│Logical View │    │Process View │    │Development View│
│(逻辑视图)    │    │(进程视图)    │    │(开发视图)       │
└─────────────┘    └─────────────┘    └────────────────┘
                             │
                    ┌────────┴────────┐
                    │ Physical View   │
                    │(物理/部署视图)    │
                    └─────────────────┘
```

| 视图 | 关注 | 对应视图类别 |
|------|------|------------|
| Logical View | 功能需求（类、对象） | Module |
| Process View | 并发、性能（进程、线程） | C&C |
| Development View | 软件管理（模块、包） | Module |
| Physical View | 部署拓扑（节点、网络） | Allocation |
| Use Case View(+1) | 关键场景串联所有视图 | - |

---

## 四、架构风格 vs 架构模式

| 概念 | 定义 | 粒度 |
|------|------|------|
| **Architecture Style** | 元素类型和关系类型的特殊化，以及如何使用它们的约束 | 较小，侧重于解决方案的描述方式 |
| **Architecture Pattern** | 在实践中反复发现的设计决策集，有已知属性，描述一类架构 | 较大，包含Context→Problem→Solution |

**架构模式三要素**：
1. **Context（上下文）**：问题发生的场景
2. **Problem（问题）**：在该上下文中要解决的问题
3. **Solution（解决方案）**：Elements + Relations + Constraints

---

## 五、架构文档化

### Documentation Package = Views + Beyond

### 视图模板（View Template）五部分：
1. **Primary Presentation**：主要介绍，显示元素和关系，以及图例
2. **Element Catalog**：元素目录，详细描述元素属性、关系、接口和行为
3. **Context Diagram**：上下文图，系统如何与环境交互
4. **Variability Guide**：可变性指南，可能发生的变化
5. **Rationale**：基本原理，为什么这样设计

### Beyond Views（视图之外的部分）六个section：
1. **Documentation Roadmap**：文档路线图
2. **How a View is Documented**：视图文档化方式说明
3. **System Overview**：系统概览
4. **Mapping Between Views**：视图间映射
5. **Rationale**：设计理由
6. **Directory**：索引、词汇表、缩略词

### 如何选择视图（考试要点）：
1. 构建**涉众/视图表**：行为涉众，列为视图，格子填对视图的关注程度
2. **合并视图**：将边缘视图与更具表达力的视图合并
3. **确定优先级和完成阶段**：分解视图优先，80/20原则

---

## 六、往年真题精选

### 2015/2017/2019真题：
**Q：将以下映射到三类架构视图：Layered, Pipe-and-Filter, SOA, Multi-Tier, Deployment**

**A**：
- Layered → Module Styles
- Pipe-and-Filter → C&C Styles
- SOA → C&C Styles
- Multi-Tier → Allocation Styles
- Deployment → Allocation Styles

### 2025真题：
**Q：画C&C视图描述一个SOA系统**

**A要点**：
- Component: Service Provider, Service Consumer, ESB, Service Registry
- Connector: SOAP/REST connector, Asynchronous messaging connector
- 画出组件通过连接器交互的图

---

## 七、今日自测

1. Module Views和C&C Views的核心区别是什么？
   > Module关注静态代码结构（编译时），C&C关注运行时行为和交互。

2. 为什么Layered是Module而Multi-Tier是Allocation？
   > Layer是逻辑分层（代码组织），Tier是物理分层（部署到不同计算环境）。

3. Documentation Package由哪两部分组成？
   > Views + Beyond (Information Beyond Views)

4. 4+1视图中，Process View关注什么？对应哪类视图？
   > 关注并发、同步、性能。对应C&C Views。

---

## 八、明日预告

Day 10将学习：ADD（属性驱动设计）8步法 + ASR（架构重要需求）识别。
