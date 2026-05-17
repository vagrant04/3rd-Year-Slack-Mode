# Day 10: ADD（属性驱动设计）+ ASR（架构重要需求）

> 学习时间：30分钟 | 重要程度：★★★★★（2025考了ADD 3.0，年年考ASR）
> 参考资料：复习资料/笔记/系统架构（简）.pdf p40-42, 旧课件/zt-ADD

---

## 一、ASR（Architecturally Significant Requirements）

### 1. 定义
ASR是对架构有深远影响的需求。不是所有需求都影响架构——大部分功能需求不影响整体结构。

**ASR的特征**：
- 对架构有高影响
- 对利益相关者有高重要性
- 是质量属性需求（非功能需求通常比功能需求更影响架构）

### 2. ASR的四个来源（必背！）

| 来源 | 方法 | 说明 |
|------|------|------|
| **需求文档** | MoSCoW分析 | Must/Should/Could/Won't分级，但难以收集质量需求 |
| **利益相关者** | QAW（质量属性工作坊） | 8步法引导利益相关者表达质量关注 |
| **业务目标** | 业务目标分析 | 从商业目标推导技术需求 |
| **效用树** | Utility Tree | 量化管理ASR，逐层细化到可度量指标 |

### 3. QAW（Quality Attribute Workshop）8步法
1. QAW演示和介绍
2. 业务任务介绍
3. 架构计划介绍
4. 架构驱动程序的识别
5. **场景集思广益**：每个利益相关者表达一个场景
6. **方案合并**：合并类似方案
7. **方案优先级**：通过投票确定优先级
8. **方案细化**：将高优先场景细化为具体质量属性场景

### 4. Utility Tree（效用树）—— 重要！

**结构**：
```
Utility (根节点)
├── Performance
│   ├── Data Latency
│   │   └── (M,L) Minimize storage latency on customer DB to 200ms
│   └── Transaction throughput
│       └── (M,M) Maximize average throughput to auth server
├── Modifiability
│   ├── New product categories
│   │   └── (L,H) Add CORBA middleware in < 20 person weeks
│   └── Change COTS
│       └── (H,L) Provide web enabled functionality in < 4 person weeks
├── Availability
│   ├── Hardware failure
│   │   └── (L,H) Restart after disk failure in < 5 minutes
│   └── COTS software failures
│       └── (H,M) Network failure is detected and recovered in < 1.5 minutes
└── Security
    ├── Data confidentiality
    │   └── (L,H) Credit card transaction secure 99.999% of time
    └── Data integrity
        └── (L,H) Customer database authorization works 99.999% of time
```

**每个叶子节点的标注格式**：`(重要程度, 架构影响)`
- **H/M/L, H/M/L** = (对利益相关者的重要性, 对架构的影响程度)
- 重点关注 **(H,H)** 的需求 —— 这些是最关键的ASR

---

## 二、ADD（Attribute-Driven Design）

### 1. ADD是什么
ADD是一种架构设计方法，以质量属性需求(ASR)为驱动，通过迭代分解来设计架构。

### 2. ADD的输入和输出

**输入**：需求（功能需求 + 质量属性需求 + 约束）

**输出**：
- 软件元素（完成决策和职责）
- 角色（一组相关职责）
- 职责（功能、数据或信息）
- 属性（元素的附加信息）
- 关系（元素间的交互定义）

### 3. ADD 8步法（2025真题考了ADD 3.0）

#### 步骤1：确定有足够的需求信息
- 确认需求优先级已确定
- 确认质量属性有足够的刺激-反应图(Stimulus-Response)
- 确定设计期间需要重点关注的系统元素

#### 步骤2：选择要分解的系统要素
- 首次设计：将全部需求分配给整个系统
- 后续迭代：选择已分解的某个元素作为关注点

#### 步骤3：确定所选元素的ASR
- 对所有需求按重要程度(H/M/L)和架构影响(H/M/L)排名
- 得到(H,H)等二元组，优先处理(H,H)

#### 步骤4：选择符合ASR的设计
- **4.1 找出设计问题**：如何解决设计中的ASR？如何划分子关注点？
- **4.2 列出子关注点替代模式/策略**：识别区分参数
- **4.3 从清单中选择模式/策略**：评估权衡
- **4.4 确定模式/策略与ASR之间的关系**：用表格描述
- **4.5 记录初步的架构视图**：不要求完整，描述选定模式
- **4.6 评估并解决不一致问题**：检查是否有遗漏的架构驱动

#### 步骤5：实例化架构元素并分配职责
- 实例化每个所选元素
- 在子元素之间分配父元素的职责
- 分析并记录设计决策

#### 步骤6：为实例化元素定义接口
- 描述Provide（提供）和Requires（需要）
- 通过功能要求、观察信息传递消耗等方法

#### 步骤7：验证和完善需求
- 验证父元素的所有需求是否被分配给子元素
- 将职责转换为功能需求

#### 步骤8：重复进行，直到满足所有ASR
- 迭代选择下一个元素继续分解
- 每次迭代细化一层

### 4. ADD迭代示例（SOA系统）
```
迭代1: 应用SOA模式
  → 识别出：Order tracking service, Consumer website,
    Airline/Lodging/Activity provider service, Bank service,
    SOA infrastructure components

迭代2: 细化SOA基础设施
  → ESB, Service Registry, Service Broker

迭代3: 继续细化某个SOA元素...
```

---

## 三、ADD 3.0 的新特点（2025真题）

ADD 3.0相比早期版本的改进：
1. **更系统的设计概念选择**：使用设计概念目录（参考架构、模式、策略）
2. **明确的迭代结构**：每次迭代有清晰的输入/输出
3. **设计概念分类**：
   - Reference Architectures（参考架构）
   - Architectural Patterns（架构模式）
   - Tactics（策略）
   - Externally Developed Components（外部组件/框架）
4. **初始设计路线图**：基于系统类型选择初始参考架构

---

## 四、Generic Design Strategies（通用设计策略）

| 策略 | 说明 | 与ADD的关系 |
|------|------|------------|
| **Abstraction（抽象）** | 提取本质，忽略细节 | 定义接口和抽象层 |
| **Decomposition（分解）** | 将大问题分为小问题 | ADD核心就是迭代分解 |
| **Divide and Conquer** | 分而治之 | 将ASR分配给子元素 |
| **Generate and Test** | 生成方案然后测试验证 | 选择模式后评估 |
| **Iteration（迭代）** | 反复改进 | ADD的迭代本质 |
| **Reuse（复用）** | 利用已有解决方案 | 使用已知模式和策略 |

---

## 五、往年真题精选

### 2021真题：
**Q：什么是generic design strategies？如何将它们与ADD结合使用？**

**A**：通用设计策略是独立于具体技术的通用问题解决方法。在ADD中：
- **分解**对应步骤2（选择要分解的元素）
- **抽象**对应步骤6（定义接口）
- **Generate-and-Test**对应步骤4（选择设计方案并评估）
- **迭代**对应步骤8（重复直到满足所有ASR）
- **复用**对应步骤4.2（选择已知的模式和策略）

### 2025真题：
**Q：解释ADD 3.0的过程**

**A要点**：
- 输入：功能需求 + 质量属性需求 + 约束 + 关注点
- 通过迭代过程逐步分解系统
- 每次迭代选择设计概念（参考架构/模式/策略）满足当前ASR
- 实例化元素、分配职责、定义接口
- 重复直到所有ASR都被满足

---

## 六、今日自测

1. ASR的四个来源是什么？
   > 需求文档(MoSCoW)、利益相关者(QAW)、业务目标、效用树(Utility Tree)

2. Utility Tree中(H,H)表示什么？为什么要优先处理？
   > 对利益相关者重要性高 + 对架构影响高。这些是真正影响架构决策的关键需求。

3. ADD步骤4的核心工作是什么？
   > 选择满足ASR的设计方案：识别设计问题、列出候选模式/策略、选择并评估、记录初步视图。

4. Generic Design Strategies中的"Generate and Test"是什么意思？
   > 先生成一个候选设计方案，然后用ASR作为测试准则来评估该方案是否满足要求。不满足则修改或重新生成。

---

## 七、明日预告

Day 11将学习：ATAM（架构权衡分析方法）完整流程、输出物。
