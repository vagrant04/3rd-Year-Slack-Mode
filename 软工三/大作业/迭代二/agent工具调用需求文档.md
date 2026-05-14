以下是重新生成的四个外部工具需求文档。每个工具均给出**多个可选API及推荐理由**，由开发人员自行评估选择，不强制限定具体服务商。文档聚焦于工具在Agent中的行为契约、输入输出规范与异常处理。

---

## 工具一：景点搜索与推荐工具 (Attraction Search Tool)

### 1. 功能概述
为Agent提供目的地景点的搜索与发现能力。根据用户输入的目的地、偏好标签、旅行天数等，返回匹配的景点列表（含名称、位置、评分、门票、营业状态等），支撑Agent的行程初排与后续修正（如景点关闭替换）。

### 2. 推荐API（供选型）
以下是国内外主流的POI/地图服务商，均提供景点搜索相关接口：

- **高德地图 Web服务 API（地点搜索2.0）**
  - 端点：`https://restapi.amap.com/v3/place/text` 等
  - 优点：国内数据全，个人开发者免费额度充足（每日数千次）
  - 认证：API Key
  - 文档：搜“高德开放平台 POI搜索”

- **百度地图 Place API（地点检索）**
  - 端点：`http://api.map.baidu.com/place/v2/search`
  - 优点：与高德数据互补，部分场景结果更丰富
  - 认证：AK（API Key）
  - 文档：百度地图开放平台

- **Google Places API（Nearby Search / Text Search）**
  - 端点：`https://maps.googleapis.com/maps/api/place/textsearch/json` 或新 Routes 系列
  - 优点：全球景点数据覆盖，适合境外游规划
  - 认证：API Key，每月$200免费额度
  - 文档：Google Maps Platform

- **四维图新 / 腾讯位置服务**（备选）
  - 端点：腾讯位置服务地点搜索 API
  - 优点：生态丰富，微信小程序场景友好
  - 认证：Key

**建议**：以高德、百度之一作为主 API，以 Google 作为境外补充。开发者亦可组合使用，降低单 API 依赖风险。

### 3. 工具封装设计要求
- **函数签名**（示例）：
  ```python
  def search_attractions(keyword: str, city: str = None, 
                         types: str = None, radius: int = None, 
                         limit: int = 10) -> dict
  ```
- **输入参数**：
  | 参数    | 类型   | 必填 | 说明                                         |
  | ------- | ------ | ---- | -------------------------------------------- |
  | keyword | string | 是   | 搜索关键词（如“西湖”、“博物馆”）             |
  | city    | string | 否   | 城市名称或代码，可限制范围                   |
  | types   | string | 否   | POI分类（如“风景名胜”），视所选API而定       |
  | radius  | int    | 否   | 周边搜索半径（米），若不填则按关键字全城搜索 |
  | limit   | int    | 否   | 期望返回数量，默认10                         |
  
- **输出数据结构**（标准化）：
  ```json
  {
    "status": "success",
    "total": 15,
    "attractions": [
      {
        "name": "西湖",
        "location": {"lat": 30.25, "lng": 120.16},
        "address": "杭州市西湖区龙井路1号",
        "rating": 4.8,
        "ticket_price": 0,
        "opening_hours": "全天",
        "type": "自然风光"
      }
    ]
  }
  ```

- **Mock能力**：工具必须支持 Mock 模式，通过配置开关返回模拟景点列表，避免开发早期消耗大量真实配额。

**统一返回规范**

所有工具的输出必须严格遵循 BaseTool 定义的规范：

```json
// 成功
{
  "status": "success",
  "data": {
    // 具体数据结构
  }
}

// 失败
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读的错误描述"
  }
}
```

对于各工具的异常处理表，均应改为如下格式：

| 异常场景 | 返回示例 |
| -------- | ----------------------------------------------------------- |
| API Key 无效 | `{"status": "error", "error": {"code": "INVALID_KEY", "message": "API Key无效"}}` |
| 城市无法识别 | `{"status": "error", "error": {"code": "AMBIGUOUS_CITY", "message": "...", "suggestions": [...]}}` |
| 无搜索结果 | `{"status": "error", "error": {"code": "NO_RESULTS", "message": "未找到相关景点"}}` |
| 限流 | `{"status": "error", "error": {"code": "RATE_LIMITED", "message": "请求过于频繁"}}` |

### 4. 与Agent的交互逻辑
- **启动阶段**：Agent根据用户需求调用搜索，一次性获取候选景点池。
- **修正阶段**：若预算/时间冲突导致某些景点被移除，Agent可再次调用搜索，用不同的关键词或类型补充替代景点。
- **异常触发修正**：当返回结果中某个已选景点标记为“暂停营业”或不可用时，Agent需自动搜索同类型、同区域的替代景点并重组行程。

### 5. 异常处理规范
详见"3. 工具封装设计要求"中的**统一返回规范**章节。


## 工具二：天气查询工具 (Weather Query Tool)

### 1. 功能概述
根据地理位置坐标和日期范围，获取天气状况（晴/雨/雪、温度、风力等），用于行程规划中的活动安排，并作为动态环境变化的核心触发源——若确定行程后天气剧烈变化，Agent需自动重调配户外/室内活动。

### 2. 推荐API（供选型）
- **OpenWeatherMap One Call API 3.0**
  - 端点：`https://api.openweathermap.org/data/3.0/onecall`
  - 优点：支持当前天气、48小时逐时预报、8天逐日预报，免费额度 1000次/天
  - 认证：API Key

- **和风天气 API（国内推荐）**
  - 端点：`https://devapi.qweather.com/v7/weather/7d` 等
  - 优点：国内访问稳定，地理编码与天气一体化，免费额度充足（个人开发者 1000次/天）
  - 认证：API Key

- **AccuWeather APIs**
  - 端点：`https://dataservice.accuweather.com/forecasts/v1/daily/5day/{locationKey}`
  - 优点：精度高，提供旅游活动适宜度指数
  - 认证：API Key，免费试用每天50次

- **中国气象局公共气象服务中心 API**（需申请）
  - 端点：官方数据，适合需要权威数据的场景

**建议**：国内游推荐使用和风天气，国际游使用OpenWeatherMap。

### 3. 工具封装设计要求
- **函数签名**：
  ```python
  def query_weather(lat: float, lon: float, date: str = None, 
                     days: int = 3) -> dict
  ```
- **输入参数**：
  | 参数 | 类型   | 必填 | 说明                             |
  | ---- | ------ | ---- | -------------------------------- |
  | lat  | float  | 是   | 纬度                             |
  | lon  | float  | 是   | 经度                             |
  | date | string | 否   | 目标日期（YYYY-MM-DD），默认当天 |
  | days | int    | 否   | 预报天数（1-7，依API而定）       |
  
- **输出数据结构**：
  ```json
  {
    "status": "success",
    "location": {"lat": 30.25, "lon": 120.16},
    "current": {
      "temp": 28,
      "feels_like": 30,
      "description": "晴转多云",
      "icon": "01d"
    },
    "daily": [
      {
        "date": "2026-05-06",
        "temp_min": 22, "temp_max": 28,
        "weather_main": "Rain",
        "description": "小雨",
        "pop": 0.6
      }
    ]
  }
  ```

- **Mock模式要求**：可基于日期和城市生成可复现的模拟天气，并可注入突变场景（如暴雨）以测试Agent自我修正。

**统一返回规范**

所有工具的输出必须严格遵循 BaseTool 定义的规范：

```json
// 成功
{
  "status": "success",
  "data": {
    // 具体数据结构
  }
}

// 失败
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读的错误描述"
  }
}
```

对于各工具的异常处理表，均应改为如下格式：

| 异常场景 | 返回示例 |
| -------- | ----------------------------------------------------------- |
| API Key 无效 | `{"status": "error", "error": {"code": "INVALID_KEY", "message": "API Key无效"}}` |
| 坐标无效 | `{"status": "error", "error": {"code": "INVALID_COORD", "message": "坐标无效"}}` |
| 日期超限 | `{"status": "error", "error": {"code": "DATE_OUT_OF_RANGE", "message": "查询天数超出限制", "max_days": 7}}` |
| 额度耗尽 | `{"status": "error", "error": {"code": "QUOTA_EXCEEDED", "message": "API额度已用完"}}` |

### 4. 与Agent的交互逻辑
- **首次规划**：Agent制定行程前，调用天气工具获取旅行时段天气，合理分配室内外活动。
- **确认后二次查询**：在用户确认行程后，Agent应**再次调用天气工具**，检测是否有突发恶劣天气。
- **天气突变修正**：若检测到预报从晴变为暴雨，Agent需：
  1. 标记受影响的日期；
  2. 将当天户外景点置为不适宜；
  3. 调用景点搜索工具查找室内博物馆、商场等；
  4. 重新计算交通/预算，生成替代计划并通报用户。

### 5. 异常处理规范
详见"3. 工具封装设计要求"中的**统一返回规范**章节。


## 工具三：交通与距离计算工具 (Transport & Distance Tool)

### 1. 功能概述
提供两点或多点间的路径规划与距离/耗时估算，支持驾车、步行、公交等多种出行方式。用于Agent构造每日行程的顺序、判断景点间是否时间冲突，并在行程修正时快速重新排布路线。

### 2. 推荐API（供选型）
- **高德地图路径规划 API**
  - 驾车/步行/骑行/公交路线：`https://restapi.amap.com/v3/direction/...`
  - 优点：国内数据精细，返回距离、预估耗时、途经路名等，免费额度5000次/天
  - 认证：Key

- **百度地图 RouteMatrix API / 路线规划**
  - 端点：`https://api.map.baidu.com/direction/v2/...`
  - 优点：同样提供多种出行方式，路线ETA稳定
  - 认证：AK

- **Google Routes API（Compute Routes）**
  - 端点：`https://routes.googleapis.com/directions/v2:computeRoutes`
  - 优点：支持全球多模式交通，每月$200免费额度
  - 认证：API Key 或 OAuth

- **Mapbox Directions API**
  - 端点：`https://api.mapbox.com/directions/v5/mapbox/driving/...`
  - 优点：国际化良好，高度可定制，免费额度（每月100k次请求）
  - 认证：Access Token

- **OpenRouteService**（开源免费）
  - 端点：`https://api.openrouteservice.org/v2/directions/driving-car`
  - 优点：基于 OSM，免费额度 2000次/天，无需信用卡
  - 认证：API Key

**建议**：国内主选高德或百度，境外或跨国行程使用 Google Routes 或 Mapbox。

### 3. 工具封装设计要求
- **函数签名**：
  ```python
  def calculate_distance(origin: tuple, destination: tuple,
                         mode: str = "driving", 
                         waypoints: list = []) -> dict
  
  def distance_matrix(points: list[tuple], mode: str) -> list[list[dict]]
  ```
- **输入参数**：
  | 参数        | 类型       | 必填 | 说明                                          |
  | ----------- | ---------- | ---- | --------------------------------------------- |
  | origin      | (lat, lng) | 是   | 起点经纬度                                    |
  | destination | (lat, lng) | 是   | 终点经纬度                                    |
  | mode        | string     | 否   | 出行方式（driving/walking/transit/bicycling） |
  | waypoints   | list       | 否   | 途经点数组                                    |
  | provider    | string     | 否   | 选择哪个API提供商，若不填由工具自动选择       |
  
- **输出数据结构**：
  ```json
  {
    "status": "success",
    "route": {
      "distance_meters": 15320,
      "duration_seconds": 1800,
      "duration_text": "30分钟",
      "mode": "driving",
      "steps_summary": "经西湖大道..."
    }
  }
  ```

- **距离矩阵**功能：支持一次性计算多个地点两两之间的距离/时间，帮助Agent快速优化游览顺序。

**统一返回规范**

所有工具的输出必须严格遵循 BaseTool 定义的规范：

```json
// 成功
{
  "status": "success",
  "data": {
    // 具体数据结构
  }
}

// 失败
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读的错误描述"
  }
}
```

对于各工具的异常处理表，均应改为如下格式：

| 异常场景 | 返回示例 |
| -------- | ----------------------------------------------------------- |
| 坐标无效 | `{"status": "error", "error": {"code": "INVALID_COORDS", "message": "坐标无效"}}` |
| 无可用路线 | `{"status": "error", "error": {"code": "NO_ROUTE", "message": "无可用路线", "suggestion": "尝试其他出行方式"}}` |
| API 限流 | `{"status": "error", "error": {"code": "RATE_LIMITED", "message": "请求过于频繁"}}` |

### 4. 与Agent的交互逻辑
- **顺序编排**：Agent调用距离矩阵，基于最短耗时排序景点，生成每日行程。
- **时间冲突检测**：累加游玩时间+通勤时间，若超出当日可用时间，则触发修正：删除次要景点或调整顺序。
- **修正环**：检测到冲突后，Agent可能改变出行方式（如驾车改地铁）或替换更近的景点，需再次调用交通工具验证新方案。

### 5. 异常处理规范
详见"3. 工具封装设计要求"中的**统一返回规范**章节。


## 工具四：预算计算与汇率工具 (Budget & Currency Tool)

### 1. 功能概述
根据目的地、天数、人数、景点列表、酒店档次等参数，估算旅行总预算及分项明细（住宿、餐饮、门票、交通等），并支持境外游时的汇率换算。用于Agent校验行程是否超出预算，并驱动预算超支时的自动修正。

### 2. 推荐API（供选型）
- **汇率数据：**
  - **ExchangeRate-API** – 免费端点 `https://api.exchangerate-api.com/v4/latest/CNY`，无 Key 月1500次，覆盖170+货币
  - **Frankfurter** – 免费，开源，无需Key，数据由欧洲央行提供
  - **CurrencyAPI.com** – 免费计划 300次/月，支持历史汇率
  
- **物价数据（酒店/餐饮/门票）：**
  - 由于酒店/餐饮实时价格通常需要OTA授权，本项目建议采用**本地模型估算**：
    - 预置各城市酒店均价参考表（经济/舒适/豪华），结合高德POI搜索返回的 **biz_ext.cost** 作为景点门票和餐饮人均消费参考。
    - 开发者可抓取一次公开数据或使用静态配置文件。
  - 若未来需要接入真实预订，可预留接口连接如 **Amadeus 酒店价格 API** 或 **途牛开放平台**。

### 3. 工具封装设计要求
- **函数签名**：
  ```python
  def get_exchange_rate(from_currency: str, to_currency: str = "CNY") -> dict
  
  def calculate_budget(city: str, days: int, num_people: int,
                       attractions: list, hotel_level: str = "mid",
                       currency: str = "CNY") -> dict
  ```
- **输入参数**：
  | 参数        | 类型   | 必填 | 说明                        |
  | ----------- | ------ | ---- | --------------------------- |
  | city        | string | 是   | 目的地城市                  |
  | days        | int    | 是   | 旅行天数                    |
  | num_people  | int    | 是   | 人数                        |
  | attractions | list   | 是   | 景点对象列表（含门票价格）  |
  | hotel_level | string | 否   | 酒店档次：budget/mid/luxury |
  | currency    | string | 否   | 结算币种，默认CNY           |

- **输出数据结构**：
  ```json
  {
    "total": 4500.00,
    "currency": "CNY",
    "breakdown": {
      "accommodation": 1200,
      "meals": 900,
      "tickets": 320,
      "transport_local": 200,
      "transport_intercity": 500,
      "other": 380
    },
    "budget_limit": 4000,
    "overspent": 500,
    "overspent_percent": 12.5
  }
  ```

- **汇率转换输出**：
  ```json
  {
    "from": "CNY",
    "to": "USD",
    "rate": 0.14,
    "converted_amount": 630.00
  }
  ```

**统一返回规范**

所有工具的输出必须严格遵循 BaseTool 定义的规范：

```json
// 成功
{
  "status": "success",
  "data": {
    // 具体数据结构
  }
}

// 失败
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "人类可读的错误描述"
  }
}
```

对于各工具的异常处理表，均应改为如下格式：

| 异常场景 | 返回示例 |
| -------- | ----------------------------------------------------------- |
| 币种不支持 | `{"status": "error", "error": {"code": "UNSUPPORTED_CURRENCY", "message": "不支持的币种"}}` |
| 预算参考数据缺失 | `{"status": "error", "error": {"code": "DATA_MISSING", "message": "预算参考数据缺失", "city": "未知"}}` |
| 汇率服务不可用 | `{"status": "error", "error": {"code": "EXCHANGE_SERVICE_DOWN", "message": "汇率服务不可用"}}` |

### 4. 与Agent的交互逻辑
- **初步预算生成**：Agent完成粗行程后，调用预算工具获得总额。
- **超支检测与修正**：
  1. 比较用户预算上限与预算总额；
  2. 若超支，Agent按优先级调低分项（如先降酒店档次，再删减高门票景点，再调整餐饮标准）；
  3. 每次调低某项后重新调用预算计算，直至预算达标。
- **境外游汇率更新**：如果涉及出境，Agent在最终报价前调用汇率工具，将总费用转换为用户偏好货币。

### 5. 异常处理规范
详见"3. 工具封装设计要求"中的**统一返回规范**章节。

---

## 四个工具的共同技术约束

1. **API Key 管理**：所有 Key 必须通过环境变量或 `.env` 文件注入，代码中禁止硬编码。
2. **统一错误格式**：每个工具返回字典必须包含 `status` 字段，失败时包含 `error` 和 `message`。
3. **Mock 开关**：每个工具提供一个全局配置项 `MOCK_MODE`，开启时返回符合规范的模拟数据，以便无网络环境下开发调试。
4. **日志/可视化**：工具调用时向 Agent 返回结构化的执行元数据（耗时、供应商等），以便 CLI 界面打印类似 `🔧 [工具] search_attractions 耗时 230ms` 的状态信息。

   **执行日志元数据要求**

   工具在执行后必须返回一个包含 `execution_metadata` 的字段（置于 `data.execution_metadata` 中），包含：
   - **duration_ms**：真实 API 调用耗时（毫秒），Mock 模式可为固定值。
   - **provider**：实际使用的 API 提供商（如 "amap"），Mock 模式标记为 "mock"。
   
   这些信息将用于 Agent 平台生成 `tool_call` 和 `observation` 事件。

5. **可扩展性**：所有工具类应继承一个 `BaseTool` 抽象类，方便后续替换真实 API 或增加新工具。

以上需求为开发人员提供了充分的API选择空间，同时定义了与Agent集成的严格接口规范。具体选用哪家API，由第二组同学根据实际注册和测试体验决定。