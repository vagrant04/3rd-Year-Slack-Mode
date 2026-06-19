## 2. 架构设计部分 50%

### 2.1 什么是软件架构

核心定义：

> 软件架构是系统的结构，包括软件元素、元素之间的关系，以及这些元素和关系的属性。

关键词：

- Structure：结构，不只是代码目录，而是系统高层组织方式。
- Elements：元素，可以是模块、组件、连接器、服务、数据存储、部署节点等。
- Relationships：关系，包括调用、依赖、部署、通信、数据流、允许使用关系等。
- Design：架构是设计的一部分，是影响系统整体结构和质量属性的关键设计决策。

考试答法：

1. 先给定义。
2. 再说明架构关注高层结构和质量属性，不等于所有详细设计。
3. 最后举例：微服务架构中，元素包括用户服务、订单服务、支付服务；关系包括 REST 调用、消息队列、服务发现、数据库隔离。

相关资料：

- [旧课件：2025_UG_SysArch1_introduction.pdf](../../旧课件/2025_UG_SysArch1_introduction.pdf)
- [学长笔记：软件系统设计-系统架构.pdf](../../复习资料/笔记/软件系统设计-系统架构.pdf)
- [往年题整理：01-简答题-软件架构部分.md](../../复习资料/往年题整理/01-简答题-软件架构部分.md)

### 2.2 架构、设计、结构的区别

需要会区分：

- Structure：系统的一种静态结构表现，强调元素和关系。
- Architecture：包含多个结构视图，也包含关键设计决策和质量属性考虑。
- Design：所有设计决策的集合，架构是设计中最重要、最难改、对质量属性影响最大的部分。

一句话：

> 所有架构都是设计，但不是所有设计都是架构；结构是架构的表现之一，架构还包含设计理由、约束和质量属性取舍。

常见考法：

- “软件架构 = 设计（如组件-连接器） + 设计决定”，谈理解。
- Architecture, Structure, Design 的区别。

相关资料：

- [Day13：软件产品线+架构基础概念.md](../../每日学习计划/Day13-软件产品线+架构基础概念.md)
- [往年题整理：01-简答题-软件架构部分.md](../../复习资料/往年题整理/01-简答题-软件架构部分.md)

### 2.3 软件架构从哪里来

高频答案：

1. NFRs / Quality Requirements：性能、可用性、可修改性、安全性等。
2. ASRs：对架构产生重大影响的需求。
3. Stakeholders：客户、用户、架构师、开发者、测试者、运维、管理者等。
4. Organisations：组织结构、团队划分、康威定律。
5. Technical Environments：技术栈、平台、中间件、遗留系统、部署环境。
6. Business Goals：商业目标、成本、上市时间、合规性。
7. Architect Experience：架构师经验、过往模式、组织知识。

考试答题要点：

- 不要只写“来自需求”，要说明架构来自需求、约束、涉众、组织和技术环境的共同作用。
- 如果题目问“哪些需求影响架构”，答 ASR，并说明 ASR 可由功能需求、质量需求和约束构成。

相关资料：

- [旧课件：2025_UG_SysArch1_introduction.pdf](../../旧课件/2025_UG_SysArch1_introduction.pdf)
- [往年题整理：01-简答题-软件架构部分.md](../../复习资料/往年题整理/01-简答题-软件架构部分.md)

### 2.4 软件架构师做什么

图片关键词：Liaison, Software engineering, Technical knowledge, Risk management。

可答为：

1. Liaison：在客户、开发、测试、运维、管理层之间沟通架构方案。
2. Software engineering：将需求转化为可实现、可演进的结构。
3. Technical knowledge：理解技术栈、平台约束、架构模式和设计原则。
4. Risk management：识别架构风险、敏感点、权衡点，提前评估质量属性风险。

可以补充：

- 架构师负责识别 ASR、选择架构策略和模式、记录设计决策、评估架构质量、维护架构一致性。

### 2.5 4+1 视图

必须会默写和画图。

四个视图：

1. Logical View：逻辑视图，面向最终用户，描述功能和核心抽象，如类、子系统、领域对象。
2. Process View：过程视图，面向系统集成和性能，描述并发、进程、线程、交互、同步。
3. Physical View / Deployment View：物理视图，面向系统工程，描述软件元素到硬件节点的映射。
4. Development View / Implementation View：开发视图，面向程序员和配置管理，描述模块、包、代码组织。
5. +1 Use Case Scenarios：用例场景，用来串联和验证其他视图。

图示：

```text
          Logical View          Development View
                \                /
                 Use Case Scenarios
                /                \
          Process View          Physical View
```

为什么要多个视图：

- 不同涉众关注不同内容。
- 一个视图无法表达所有结构和质量属性。
- 不同视图暴露不同风险，便于分析性能、可修改性、部署、并发等问题。

相关资料：

- [学长笔记：软件系统设计-系统架构（简）.pdf](../../复习资料/笔记/软件系统设计-系统架构（简）.pdf)
- [往年题整理：01-简答题-软件架构部分.md](../../复习资料/往年题整理/01-简答题-软件架构部分.md)

### 2.6 View & Beyond 文档化

常见问题：

- 为什么架构要文档化？
- 软件架构文档包应该包含什么？
- 每个 View 中应该写什么？

View 部分：

- Module Views
- Component-and-Connector Views
- Allocation Views
- Quality Views

Beyond 部分：

1. 文档路线图。
2. 视图组织方式。
3. 系统概述和业务目标。
4. 视图之间的映射。
5. 架构设计理由和设计决策。
6. 词汇表、缩略语、索引等。

每个 View 应包含：

1. 主要展示图和图例。
2. 元素说明。
3. 关系说明。
4. 接口和行为。
5. 上下文图。
6. 可变性指南。
7. 设计理由。

相关资料：

- [学长笔记：软件系统设计-系统架构.pdf](../../复习资料/笔记/软件系统设计-系统架构.pdf)
- [往年题整理：01-简答题-软件架构部分.md](../../复习资料/往年题整理/01-简答题-软件架构部分.md)

### 2.7 质量属性场景六要素

年年高频，必须会画刺激-响应图。

六要素：

1. Source of Stimulus：刺激源，谁触发事件。
2. Stimulus：刺激，发生了什么事件。
3. Environment：环境，系统处于什么状态。
4. Artifact：工件，系统或系统的一部分。
5. Response：响应，系统如何反应。
6. Response Measure：响应度量，如何量化是否达标。

通用图：

```text
Source -> Stimulus -> [Artifact in Environment] -> Response -> Response Measure
```

答题技巧：

- 质量属性题一定要量化，例如“2秒内响应”“99.9%正确”“3小时内完成修改”“无停机时间”。
- 不要把 Response 写成愿望，例如“系统性能变好”；要写具体行为，例如“事务被处理并返回结果”。

相关资料：

- [旧课件：2025_UG_SysArch2-3_quality attributes.pdf](<../../旧课件/2025_UG_SysArch2-3_quality attributes.pdf>)
- [往年题整理：02-简答题-质量属性与场景.md](../../复习资料/往年题整理/02-简答题-质量属性与场景.md)

### 2.8 重点质量属性与战术

#### 2.8.1 Availability 可用性

定义：

- 系统在需要时能够正常提供服务的能力。

公式：

```text
Availability = MTBF / (MTBF + MTTR)
```

常见战术：

- Fault Detection：heartbeat, ping/echo, exception detection。
- Fault Recovery：active redundancy, passive redundancy, spare, checkpoint/rollback。
- Fault Prevention：remove from service, transactions, process monitor。

例子：

- 心跳监控器发现服务器无响应，系统自动切换到备用节点，在无停机时间内继续提供服务。

#### 2.8.2 Performance 性能

关注：

- 响应时间、吞吐量、延迟、资源利用率。

常见战术：

- 控制资源需求：减少计算、限制事件频率、缓存、分页。
- 管理资源：并发、负载均衡、资源池、调度。

例子：

- 用户发起交易，系统在正常负载下 2 秒内完成处理并返回结果。

#### 2.8.3 Modifiability 可修改性

关注：

- 修改成本、影响范围、修改时间、重新测试成本。

常见战术：

- Increase cohesion：提高内聚。
- Reduce coupling：降低耦合。
- Defer binding：延迟绑定。
- Encapsulate：封装变化点。

例子：

- 开发者希望修改 UI，系统在设计时支持分层/MVC，使修改可在 3 小时内完成并通过单元测试。

#### 2.8.4 Interoperability 互操作性

关注：

- 不同系统之间能否交换并正确使用信息。

常见战术：

- 标准协议。
- 中介者/适配器。
- 服务发现。
- 统一数据格式。

例子：

- 车辆信息系统发送位置，路况系统结合地图数据广播结果，99.9% 的信息正确。

#### 2.8.5 Security 安全性

关注：

- 认证、授权、保密性、完整性、审计、抵抗攻击。

常见战术：

- Authenticate users。
- Authorize users。
- Encrypt data。
- Detect attacks。
- Audit trail。

#### 2.8.6 Testability 可测试性

关注：

- 控制输入、观察输出、隔离组件、自动化测试。

常见战术：

- Record/playback。
- Separate interface from implementation。
- Dependency injection。
- Built-in monitors。

#### 2.8.7 Usability 易用性

关注：

- 用户能否高效、正确、满意地完成任务。

常见战术：

- Undo/redo。
- User model。
- Feedback。
- Error prevention。

相关资料：

- [学长笔记：软件系统设计-系统架构.pdf](../../复习资料/笔记/软件系统设计-系统架构.pdf)
- [往年题整理：02-简答题-质量属性与场景.md](../../复习资料/往年题整理/02-简答题-质量属性与场景.md)

### 2.9 Strategy、Tactic、Pattern、Style 的区别

需要会区分：

- Strategy：较宽泛的设计策略，例如抽象、分解、复用。
- Tactic：影响单一质量属性的局部设计决策，例如 heartbeat 提高可用性、cache 提高性能。
- Pattern：在特定上下文中反复出现的问题的成熟解决方案，包含 Context、Problem、Solution。
- Style：对元素、关系和约束的结构化描述，例如 Module Style、C&C Style、Allocation Style。

答题句：

> Tactic 比 Pattern 更小，通常解决单一质量属性问题；Pattern 可以组合多个 Tactic；Style 更强调元素和关系的结构约束。

相关资料：

- [旧课件：2025_UG_SysArch4_patterns.pdf](../../旧课件/2025_UG_SysArch4_patterns.pdf)
- [往年题整理：03-简答题-架构模式与策略.md](../../复习资料/往年题整理/03-简答题-架构模式与策略.md)

### 2.10 Module / C&C / Allocation 三类视图

#### Module Styles

回答问题：

- 系统如何组织成一组实现单元？

典型视图：

- Decomposition view
- Uses view
- Generalization view
- Layered view
- Data model view

典型模式：

- Layered pattern。

#### Component-and-Connector Styles

回答问题：

- 系统如何组织成一组具有运行时行为和交互的元素？

典型视图：

- Pipe-and-filter
- Client-server
- Peer-to-peer
- SOA
- Publish-subscribe
- Broker

#### Allocation Styles

回答问题：

- 软件元素如何映射到非软件结构，如硬件、团队、文件系统、部署环境？

典型视图：

- Deployment view
- Install view
- Work assignment view

高频连线：

| 问题 | 对应风格 |
|---|---|
| How is it structured as a set of implementation units? | Module Styles |
| How is it structured as runtime elements and interactions? | C&C Styles |
| How does it relate to non-software structures in environment? | Allocation Styles |

相关资料：

- [往年题整理：01-简答题-软件架构部分.md](../../复习资料/往年题整理/01-简答题-软件架构部分.md)
- [旧课件：2025_UG_SysArch4_patterns.pdf](../../旧课件/2025_UG_SysArch4_patterns.pdf)

### 2.11 ASR 架构攸关需求

定义：

> ASR 是对体系结构产生深远影响的需求，是软件需求中最影响架构决策的那部分。

ASR 可能来自：

- 功能需求。
- 质量需求。
- 约束。

识别方法：

1. Requirement Docs：从需求文档中提取，使用 MoSCoW、用户故事等。
2. QAW / Interviews：通过质量属性工作坊和涉众访谈收集。
3. Business Goals：从业务目标推导。
4. Utility Tree：用效用树分解质量属性，并按 Importance / Difficulty 排序。

答题模板：

```text
ASR 指架构攸关需求，是会显著影响架构结构、模式、技术选型和质量属性取舍的需求。
它可来自功能需求、质量属性需求和约束。
识别方法包括需求文档分析、QAW/访谈、业务目标分析和 Utility Tree。
Utility Tree 会把质量属性分解成场景，并按重要性和实现难度排序，从而决定优先处理哪些 ASR。
```

相关资料：

- [旧课件：2025_UG_SysArch2-3_quality attributes.pdf](<../../旧课件/2025_UG_SysArch2-3_quality attributes.pdf>)
- [往年题整理：01-简答题-软件架构部分.md](../../复习资料/往年题整理/01-简答题-软件架构部分.md)

### 2.12 ADD 属性驱动设计

ADD = Attribute Driven Design。

8 步：

1. 确定有足够的需求信息。
2. 选择要分解的系统元素。
3. 确定所选元素的 ASR。
4. 选择满足 ASR 的设计：
   - 找出设计问题。
   - 列出备选模式/决策。
   - 选择模式/决策。
   - 确定模式/决策与 ASR 的关系。
   - 记录初步架构视图。
   - 评估并解决不一致。
5. 实例化架构元素并分配职责。
6. 实例化元素并定义接口。
7. 验证和完善需求。
8. 重复 2-7 步直到满足所有 ASR。

场景题用法：

- 先识别 ASR。
- 再根据 ASR 选择架构模式、战术和技术。
- 然后分解系统元素、定义接口、画视图。
- 最后说明取舍和验证。

相关资料：

- [旧课件：Lectue 01 - Attributes Driven Design.pdf](<../../旧课件/Lectue 01 - Attributes Driven Design.pdf>)
- [旧课件：Lectue 02 - Attributes Driven Design - Case Study.pdf](<../../旧课件/Lectue 02 - Attributes Driven Design - Case Study.pdf>)
- [往年题整理：01-简答题-软件架构部分.md](../../复习资料/往年题整理/01-简答题-软件架构部分.md)

### 2.13 ATAM 架构权衡分析方法

ATAM = Architecture Tradeoff Analysis Method。

要会答：

- 过程阶段。
- 每阶段输出。
- 风险、非风险、敏感点、权衡点。
- Utility Tree。

阶段：

1. Phase 0：准备和建立团队，输出评估计划。
2. Phase 1：评估-1，项目决策者和评估团队参与。
3. Phase 2：评估-2，引入更多涉众。
4. Phase 3：后续，输出最终评估报告。

ATAM 重要输出：

1. 架构简明介绍。
2. 业务目标/驱动因素。
3. 优先质量属性场景。
4. Utility Tree。
5. 风险和非风险点。
6. 风险主题。
7. 架构方法到质量属性的映射。
8. 敏感点和权衡点。
9. 最终评估报告。

概念区分：

- Risk：某架构决策可能对质量属性产生负面影响。
- Non-risk：已知安全或可接受的设计点。
- Sensitivity Point：某个设计参数小变化会显著影响一个质量属性。
- Trade-off Point：一个设计决策同时影响多个质量属性，通常有利有弊。

例子：

- 分层架构提高可修改性，但层间调用可能降低性能，这是 Trade-off Point。
- 缓存大小对性能影响明显，是 Sensitivity Point。
- 单点 Broker 可能导致可用性风险，是 Risk。

相关资料：

- [Day11：ATAM架构权衡分析方法.md](../../每日学习计划/Day11-ATAM架构权衡分析方法.md)
- [往年题整理：02-简答题-质量属性与场景.md](../../复习资料/往年题整理/02-简答题-质量属性与场景.md)

### 2.14 架构设计决策

图片列出的 7 类设计决策必须会解释：

1. Allocation of responsibilities：职责分配，决定哪些组件/模块负责哪些功能。
2. Coordination model：协调模型，决定组件如何通信、同步、协作。
3. Data model：数据模型，决定核心数据结构、数据所有权、数据一致性。
4. Management of resources：资源管理，决定线程、连接、内存、CPU、锁、事务等如何管理。
5. Mapping among architecture elements：架构元素映射，决定模块到组件、组件到进程、进程到节点的映射。
6. Binding time decisions：绑定时间，决定某个选择在设计时、编译时、部署时还是运行时确定。
7. Choice of technology：技术选型，决定框架、中间件、数据库、通信协议。

可修改性与绑定时间：

- 绑定越早，运行时复杂度低、可测试性高，但可修改性低。
- 绑定越晚，灵活性和可修改性高，但测试复杂、运行时开销可能增加。

相关资料：

- [Day13：软件产品线+架构基础概念.md](../../每日学习计划/Day13-软件产品线+架构基础概念.md)

### 2.15 架构模式：复习总原则

老师强调：

> 看懂一类架构，要同时说清“它解决什么问题、怎么解决、牺牲了什么”。

每种架构都按这个模板背：

1. Context：适用上下文。
2. Problem：要解决的问题。
3. Solution：核心组织方式。
4. Quality Attributes：提升哪些质量属性。
5. Trade-offs：牺牲哪些质量属性。
6. Example：结合业务场景说明。

### 2.16 主流架构演进

#### 2.16.1 单体架构 Monolithic Architecture

核心思想：

- 所有模块在一个应用中开发、构建、部署和运行。

解决的问题：

- 小规模系统快速开发和部署。
- 降低早期复杂度。

优点：

- 开发简单。
- 部署简单。
- 调用开销小。
- 测试和调试初期方便。

缺点：

- 规模变大后可修改性差。
- 模块边界容易混乱。
- 无法按业务模块独立扩缩。
- 一个模块故障可能影响全系统。
- 团队并行开发困难。

质量属性取舍：

- 提高早期开发效率和性能。
- 牺牲可修改性、可伸缩性、可部署性、故障隔离。

适用：

- 小团队、小系统、需求变化不剧烈、部署环境简单。

#### 2.16.2 主机/终端 Host-Terminal

核心思想：

- 计算和数据集中在主机，终端只负责输入输出。

解决的问题：

- 集中管理计算资源和数据。

优点：

- 数据集中，安全和管理简单。
- 终端轻量。

缺点：

- 主机瓶颈明显。
- 单点故障风险高。
- 用户体验和扩展性差。

迁移原因：

- PC 和网络发展后，客户端具备计算能力，系统需要更好的交互性和可扩展性。

#### 2.16.3 Client-Server C/S

核心思想：

- 客户端负责交互和部分业务逻辑，服务器负责数据和核心服务。

解决的问题：

- 分担主机压力，改善交互体验。

优点：

- 客户端响应更好。
- 服务器集中管理核心数据。

缺点：

- 客户端升级维护成本高。
- 客户端和服务器耦合较强。
- 安全和兼容问题更复杂。

#### 2.16.4 Layered / Multi-tier

Layered：

- 属于 Module Style。
- 强调逻辑分层和允许使用关系。
- 典型：表现层、业务层、数据访问层。

Multi-tier：

- 属于 Allocation Style。
- 强调物理部署分层。
- 典型：浏览器、Web服务器、应用服务器、数据库服务器。

区别：

- Layer 是逻辑分层，关注代码依赖和职责。
- Tier 是物理分层，关注部署节点和运行环境。

优点：

- 关注点分离。
- 可修改性高。
- 层可替换。
- 有利于团队分工。

缺点：

- 层间调用增加性能开销。
- 过度分层会导致复杂度上升。
- 严格分层可能不灵活。

相关资料：

- [往年题整理：03-简答题-架构模式与策略.md](../../复习资料/往年题整理/03-简答题-架构模式与策略.md)

#### 2.16.5 Pipe-and-Filter

核心思想：

- 系统由一系列 Filter 组成，每个 Filter 独立处理数据，Pipe 负责传递数据。

解决的问题：

- 将复杂数据处理流程拆成可复用、可组合的步骤。

优点：

- 可复用性好。
- 可修改性好。
- 支持并行处理。
- 易于测试单个过滤器。

缺点：

- 不适合强交互系统。
- 数据格式转换成本可能高。
- 全局状态管理困难。

典型场景：

- 编译器、文本处理、数据清洗、日志处理、图像处理流水线。

相关资料：

- [往年题整理：05-综合设计题.md](../../复习资料/往年题整理/05-综合设计题.md)

#### 2.16.6 Broker

核心思想：

- Broker 作为中介，协调 Client 和 Server 的远程调用和通信。

解决的问题：

- 分布式对象之间的发现、调用、位置透明和协议隐藏。

优点：

- Client 和 Server 解耦。
- 增强互操作性。
- 可扩展，便于添加新服务。

缺点：

- Broker 可能成为单点瓶颈。
- 增加通信复杂度。
- Broker 可能成为攻击目标。
- 测试和排错更难。

相关资料：

- [往年题整理：03-简答题-架构模式与策略.md](../../复习资料/往年题整理/03-简答题-架构模式与策略.md)

#### 2.16.7 SOA

核心思想：

- 将系统能力封装为服务，服务通过标准契约被发现、组合和调用。

基本原则：

1. 服务契约。
2. 服务封装。
3. 服务重用。
4. 服务组合。
5. 服务自治。
6. 服务无状态。

典型组件：

- Service Provider。
- Service Consumer。
- Service Registry。
- ESB / Message Bus。

质量属性影响：

- 提高互操作性：使用标准协议和服务契约。
- 提高可重用性：服务可被多个业务组合复用。
- 提高可修改性：服务封装变化。
- 可能降低性能：ESB 和远程调用带来开销。
- 增加安全风险：服务接口暴露、调用链变长。

相关资料：

- [旧课件：Lecture 03 - Microservices Patterns.pdf](<../../旧课件/Lecture 03 - Microservices Patterns.pdf>)
- [往年题整理：03-简答题-架构模式与策略.md](../../复习资料/往年题整理/03-简答题-架构模式与策略.md)

#### 2.16.8 Microservices

核心思想：

- 将系统拆成围绕业务能力的小服务，每个服务独立开发、部署、运行和扩展。

适用原因：

- 业务复杂，模块边界清晰。
- 不同模块流量差异大，需要独立扩缩。
- 多团队并行开发。
- 需要快速发布和独立演进。
- 需要故障隔离。

主要特征：

1. 服务颗粒化：按业务能力拆分。
2. 责任单一化：服务高内聚。
3. 运行隔离化：每个服务在独立进程中运行。
4. 管理自动化：自动部署、监控、弹性扩缩。
5. 去中心化治理：不同服务可选择合适技术栈。
6. 独立数据管理：服务拥有自己的数据。
7. 容错设计：熔断、限流、降级、重试。

关键模式：

- API Gateway。
- Service Registry / Discovery。
- Circuit Breaker。
- Database per Service。
- Saga。
- Event-driven / Message Queue。

质量属性取舍：

- 提高可修改性、可部署性、可伸缩性、故障隔离。
- 牺牲简单性，增加分布式复杂度、一致性问题、运维成本、调用链追踪难度。

外卖平台示例：

- 用户服务：登录、认证、用户资料。
- 商家服务：店铺、菜单。
- 订单服务：下单、订单状态。
- 支付服务：支付渠道、退款。
- 配送服务：骑手调度。
- 通知服务：短信、Push、站内信。
- 网关统一入口，服务注册发现，消息队列处理异步事件，熔断器防止级联故障。

相关资料：

- [旧课件：Lecture 03 - Microservices Patterns.pdf](<../../旧课件/Lecture 03 - Microservices Patterns.pdf>)
- [Day12：SOA+微服务+Broker+Pipe-Filter.md](../../每日学习计划/Day12-SOA+微服务+Broker+Pipe-Filter.md)
- [往年题整理：05-综合设计题.md](../../复习资料/往年题整理/05-综合设计题.md)

### 2.17 软件产品线 SPL

定义：

- 一组软件密集型系统，共享一组通用、可管理的特性，满足某个市场或任务领域需求，并以规定方式从核心资产开发。

和单一产品架构的区别：

- 单一产品架构关注一个系统。
- 产品线架构关注一组产品的共性和变化性。

变化性机制：

- Inclusion/Exclusion。
- Parameterization。
- Inheritance。
- Template Method。
- Plugin。
- Configuration。

常考点：

- 产品线通过核心资产复用提高重用性。
- 架构必须明确允许变化的范围，并提供内建机制实现变化。

相关资料：

- [Day13：软件产品线+架构基础概念.md](../../每日学习计划/Day13-软件产品线+架构基础概念.md)

---

---

[返回总导航](../考试重点.md)



