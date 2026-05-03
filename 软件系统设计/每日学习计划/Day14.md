# Day 14: 全面复习 + 真题模拟 + 考试策略

> 学习时间：30分钟 | 最终冲刺日
> 参考资料：所有往年真题，重点关注高频必考题

---

## 一、高频考点速记清单（必背！）

### 设计模式部分（pmx老师）

| 必背内容 | 关键词 |
|---------|--------|
| 7大设计原则 | SRP/OCP/LSP/DIP/ISP/CRP/LoD + 关系图 |
| OCP实现方式 | 抽象化、多态、Factory/Strategy |
| LSP支持OCP | 子类安全替换→扩展安全 |
| Factory Method vs Abstract Factory | 单产品vs产品族，都体现OCP |
| Observer推/拉模型 | Push传数据/Pull传引用 |
| Command四角色 | Command/ConcreteCmd/Invoker/Receiver |
| Composite+Observer | 通知系统设计题标准答案 |
| Strategy vs State | 客户端选择 vs 状态自动流转 |
| Facade vs Proxy | 简化多对象接口 vs 控制单对象访问 |
| 防御性编程三件套 | 断言/错误处理/路障(Barricade) |

### 架构部分（zt老师）

| 必背内容 | 关键词 |
|---------|--------|
| 质量属性场景6要素 | Source/Stimulus/Environment/Artifact/Response/Measure |
| 可用性策略 | 检测(Heartbeat/Ping)/恢复(热备/温备/冷备)/防止 |
| MTBF/MTTR公式 | Availability = MTBF/(MTBF+MTTR) |
| 可修改性策略 | 拆分/增内聚/降耦合/延迟绑定 |
| 三大视图类别 | Module/C&C/Allocation + 各自示例 |
| Layer vs Tier | 逻辑分层(Module) vs 物理分层(Allocation) |
| ASR四个来源 | 需求文档/QAW/业务目标/Utility Tree |
| ADD 8步法 | 确认需求→选元素→确定ASR→选设计→实例化→定接口→验证→重复 |
| ATAM 9项输出 | 架构展示/业务目标/场景/效用树/风险/非风险/风险主题/映射/敏感和权衡/报告 |
| Risk/Sensitivity/Tradeoff | 负面影响/微小变化大影响/多属性同时影响 |
| SOA组件 | Provider/Consumer/ESB/Registry/Orchestration |
| 微服务9大特点 | 服务组件化/业务组织/产品心态/哑管道/去中心化治理/独立数据库/自动化/容错设计/演化 |
| SOA vs 微服务 | 粗粒度ESB vs 细粒度REST/独立数据库 |

---

## 二、考试题型分析（基于2015-2025十年真题）

### Part 1：简答题（约60分，10-12题）

**必出题（每年都考）**：
1. 质量属性场景（写完整6要素）
2. 设计模式/原则（OCP/LSP的关系、模式间对比）
3. 视图映射（将模式映射到Module/C&C/Allocation）
4. ATAM或ADD的输出/步骤

**高频题（轮换出现）**：
5. 可用性MTBF/MTTR
6. Factory系列如何体现OCP
7. Observer推拉模型
8. Command四角色及作用
9. 防御性编程（断言vs路障）
10. 微服务特点/SOA原则

### Part 2：设计题（约40分，2-3题）

**高频设计题类型**：
1. **通知系统设计**（Composite+Observer）—— 2021/2022/2025
2. **代码实现**（Pipe-Filter/MacroCommand/Observer）—— 2021
3. **架构设计**（用C&C视图画SOA/微服务系统）—— 2022/2025

---

## 三、设计题答题模板

### 模板1：通知系统（年年考！）

**题目模式**：设计一个多层级通知系统（学校→学院→班级→学生）

**标准答案框架**：
```
1. 使用的设计模式：Observer + Composite

2. 类设计：
   - Observer接口：update(String message)
   - Subject接口：attach/detach/notify
   - Student/Teacher：Leaf Observer
   - Department/Class：Composite（既是Observer又是Subject）
   - NoticeBoard：顶层Subject

3. UML类图描述（文字版）：
   NoticeBoard(Subject) ──notify──▶ Department(Observer+Subject)
                                         ──notify──▶ Student(Observer)

4. 关键代码：
   - Department.update() 收到通知后调用自身的notify()转发给成员
   - 递归传递实现多层级通知
```

### 模板2：微服务架构设计

**答题框架**：
```
1. 服务划分（围绕业务能力）：列出5-8个服务
2. 通信方式：同步(REST) + 异步(消息队列)
3. 数据管理：每服务独立数据库
4. 关键质量属性分析：
   - 可用性：冗余部署、故障隔离、健康检查
   - 性能：缓存、负载均衡
   - 可修改性：服务独立部署
5. 画C&C视图（Component + Connector）
```

### 模板3：C&C视图绘制

**画图要素**：
- Component用方框表示
- Connector用带标签的线表示
- 标注连接器类型（REST/SOAP/异步消息/RPC）
- 标注端口(Port)
- 加图例(Key)说明符号含义

---

## 四、易混淆概念速查

### 1. Pattern层次对比
| 层次 | 示例 |
|------|------|
| **Architecture Pattern（架构模式）** | Layered, MVC, Microservices, SOA, Broker, Pipe-Filter |
| **Design Pattern（设计模式）** | Strategy, Observer, Factory, Command, Composite |
| **Idiom（惯用法）** | Singleton实现方式、C++ RAII |

### 2. Style vs Pattern vs Tactic
| 概念 | 定义 |
|------|------|
| **Style** | 元素和关系类型的特殊化+使用约束 |
| **Pattern** | Context+Problem+Solution，更完整 |
| **Tactic** | 单一设计决策，影响单个质量属性 |

### 3. Creational vs Structural vs Behavioral
| 类型 | 关注点 | 代表模式 |
|------|--------|----------|
| Creational（创建型） | 对象的创建方式 | Factory, Builder, Prototype, Singleton |
| Structural（结构型） | 对象的组合方式 | Adapter, Bridge, Composite, Decorator, Facade, Proxy, Flyweight |
| Behavioral（行为型） | 对象间的交互方式 | Strategy, Observer, Command, State, Template Method, Iterator, Mediator |

---

## 五、考前30分钟速记清单

### 必须能默写的内容：

1. **7大设计原则一句话定义**
2. **OCP-LSP-DIP关系**
3. **质量属性场景6要素**
4. **可用性 = MTBF/(MTBF+MTTR)**
5. **ATAM 9项输出**
6. **ADD 8步**
7. **ASR 4个来源**
8. **视图映射**：Layered→Module, Pipe-Filter/SOA/CS→C&C, Multi-Tier/MapReduce→Allocation
9. **微服务核心特点**（至少记5个）
10. **Composite+Observer通知系统设计**

---

## 六、考试策略

### 时间分配（假设120分钟）
- Part 1（简答60分）：50分钟，每题约5分钟
- Part 2（设计40分）：60分钟，每题约20分钟
- 检查：10分钟

### 答题技巧

1. **简答题**：
   - 先写结论再解释
   - 用关键术语（英文+中文）
   - 举例子加分
   - 每题控制在5-8行

2. **设计题**：
   - 先说用什么模式
   - 画类图（文字描述或简图都可）
   - 写关键代码
   - 解释设计理由（体现什么原则）

3. **不确定的题**：
   - 用相关知识点展开
   - 联系设计原则
   - 画图比纯文字更容易得分

---

## 七、模拟真题测试（自测用）

### 简答题：
1. 解释OCP，并说明Strategy模式如何体现OCP。
2. 写一个完整的可用性质量属性场景（6要素）。
3. 将以下映射到视图类别：Layered, SOA, Multi-Tier, Publish-Subscribe。
4. 什么是ATAM？列出5个输出。
5. Observer模式中推模型和拉模型的区别。
6. 什么是Barricade？与断言的关系？
7. 微服务的"去中心化数据管理"是什么意思？
8. ADD步骤4的主要工作是什么？
9. Facade和Proxy的区别。
10. ASR的四个来源。

### 设计题：
1. 用Composite+Observer设计一个公司内部通知系统（CEO→部门经理→员工），画类图并写关键代码。
2. 用微服务架构设计一个在线教育平台，说明服务划分、通信方式、关键质量属性策略。

---

## 八、复习完成！

恭喜完成14天复习计划。考试前建议：
- 考前3天：重做所有往年真题
- 考前1天：过一遍速记清单
- 考试当天：保持冷静，先做会做的题

祝考试顺利，取得高分！
