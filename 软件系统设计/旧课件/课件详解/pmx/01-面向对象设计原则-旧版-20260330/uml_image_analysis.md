# UML图像分析记录

**课件**: 01面向对象设计原则.pdf
**分析时间**: 2026-03-30
**分析方法**: 文本密度分析 + pdftoppm图像提取

---

## 📊 图像页面汇总

根据字符密度分析，共识别出**21个**需要图像分析的页面（字符数<150）

### 包含重要UML类图的页面

| 页码 | 主题 | UML图类型 | 重要程度 | 备注 |
|-----|------|----------|---------|------|
| 16 | SRP实例说明 | Login类UML | ⭐⭐⭐ | 展示违反SRP的Login类结构 |
| 17 | SRP实例解析 | 重构后UML | ⭐⭐⭐⭐ | MainClass→LoginForm→UserDAO→DBUtil依赖链 |
| 19 | OCP实例说明 | LoginForm按钮系统（原始） | ⭐⭐⭐⭐⭐ | LoginForm.button: CircleButton |
| 22 | OCP实例解析 | 按钮系统（重构后） | ⭐⭐⭐⭐⭐ | AbstractButton抽象+config.xml配置 |
| 27 | LSP实例说明 | 加密系统（原始） | ⭐⭐⭐⭐⭐ | DataOperator.cipherA: CipherA（红框标注） |
| 35 | DIP实例解析 | 数据转换系统（重构后） | ⭐⭐⭐⭐ | AbstractSource/AbstractTransformer（红框标注） |
| 39 | ISP实例说明 | 胖接口问题 | ⭐⭐⭐ | Client1/2/3依赖AbstractService |
| 40 | ISP实例解析 | 接口拆分后 | ⭐⭐⭐ | 拆分为AbstractServiceA/B/C |
| 45 | CRP实例说明 | 继承方式（原始） | ⭐⭐⭐⭐ | StudentDAO/TeacherDAO继承DBUtil（红框） |
| 47 | CRP实例解析 | 组合方式（重构后） | ⭐⭐⭐⭐ | DAO使用组合方式持有DBUtil |
| 54 | LoD实例说明 | Form-DAO复杂依赖（原始） | ⭐⭐⭐ | 5个Form与4个DAO交叉依赖 |
| 56 | LoD实例解析 | 中介者模式（重构后） | ⭐⭐⭐ | Form→Controller→DAO三层结构 |

### 非UML图但重要的页面

| 页码 | 内容类型 | 描述 |
|-----|---------|------|
| 1 | 封面 | 课件标题"软件设计原则" |
| 3 | 目录 | 7个原则列表 |
| 4 | 章节页 | "面向对象软件设计" |
| 8 | 概念图 | OOA/OOD/OOP对比图（系统架构层次） |
| 21 | 案例页 | 矩形-正方形继承问题说明（文字为主） |
| 32 | 分析页 | 三种耦合关系说明（文字为主） |
| 51 | 概念图 | LoD朋友圈示意图 |
| 55 | 思考题 | Stack extends Vector问题 |
| 59 | 总结图 | 7个原则的层次关系 |

---

## 🎯 关键UML图详细分析

### 第16页 - SRP Login类（违反SRP）

**UML结构**:
```
┌─────────────────────────────────┐
│           Login                 │
├─────────────────────────────────┤
│ + init(): void                  │
│ + display(): void               │
│ + validate(): void              │
│ + getConnection(): Connection   │
│ + findUser(String, String): boolean │
│ + main(String args[]): void     │
└─────────────────────────────────┘
```

**关键信息**:
- 一个类包含6个方法
- 职责混乱：界面显示、验证、数据库连接、数据访问、主程序入口

---

### 第17页 - SRP重构后（符合SRP）

**UML结构**:
```
MainClass
  ├─ main(String args[]): void
  └──→ (依赖)

LoginForm
  ├─ dao: UserDAO
  ├─ init(): void
  ├─ display(): void
  ├─ validate(): void
  └──→ (依赖)

UserDAO
  ├─ db: DBUtil
  ├─ findUser(String, String): boolean
  └──→ (依赖)

DBUtil
  └─ getConnection(): Connection
```

**关键信息**:
- 职责分离：MainClass（主程序）→ LoginForm（界面）→ UserDAO（数据访问）→ DBUtil（数据库工具）
- 四个类，各司其职

---

### 第19页 - OCP按钮系统（原始设计，违反OCP）⭐

**UML结构**:
```
场景1：
LoginForm
  ├─ button: CircleButton        ← 具体类型
  └─ display(): void
       │
       └──→ CircleButton
            └─ view(): void

场景2：
LoginForm
  ├─ button: RectangleButton     ← 具体类型
  └─ display(): void
       │
       └──→ RectangleButton
            └─ view(): void
```

**关键问题**:
- LoginForm的成员变量`button`类型是具体类（CircleButton或RectangleButton）
- 切换按钮类型需要修改LoginForm源代码

---

### 第22页 - OCP按钮系统（重构后，符合OCP）⭐

**UML结构**:
```
config.xml
  └─ <className>CircleButton</className>
       │
       ↓ (运行时读取)

LoginForm
  ├─ button: AbstractButton      ← 抽象类型✅
  └─ display(): void
       │
       └──→ AbstractButton (abstract)
            └─ view(): void
                 △
                 │ (继承)
         ┌───────┼───────┐
         │               │
    CircleButton    RectangleButton
    └─ view()       └─ view()
```

**关键改进**:
- LoginForm的button类型改为AbstractButton（抽象类）
- 使用config.xml配置具体按钮类型
- 新增按钮类型无需修改LoginForm

---

### 第27页 - LSP加密系统（原始设计，违反LSP/DIP）⭐

**UML结构**:
```
config.xml
  └─ <className>CipherB</className>
       │
       ↓

DataOperator
  ├─ cipherA: CipherA            ← 具体类型（红框标注❌）
  ├─ setCipherA(CipherA): void   ← 参数是具体类（红框标注❌）
  └─ encrypt(String): String
       │
       └──→ CipherA
            └─ encrypt(String): String

       CipherB（独立存在）
            └─ encrypt(String): String
```

**关键问题**:
- 成员变量和setter参数都是具体类CipherA
- 虽然有CipherB类和config.xml，但DataOperator代码中写死了CipherA
- 红框标注了两个问题点

---

### 第35页 - DIP数据转换系统（重构后，符合DIP）⭐

**UML结构**:
```
config.xml
  └─ <sourceName>DatabaseSource</sourceName>
     <transformerName>XMLTransformer</transformerName>

MainClass
  └─ main(String args[]): void
       │
       ├──→ (依赖抽象)
       │
       ├──→ AbstractSource (红框标注)
       │      △
       │      │ (继承)
       │    ┌─┼─┐
       │    │   │
       │  DatabaseSource  TextSource
       │
       └──→ AbstractTransformer (红框标注)
              △
              │ (继承)
            ┌─┼─┐
            │   │
          XMLTransformer  XLSTransformer
```

**关键设计**:
- MainClass只依赖抽象类（AbstractSource/AbstractTransformer）
- 具体类由config.xml配置
- 红框标注了两个抽象基类

---

### 第39-40页 - ISP胖接口拆分

**第39页（原始，违反ISP）**:
```
Client1 ──┐
Client2 ──┼──→ AbstractService
Client3 ──┘     ├─ operationA(): void
                ├─ operationB(): void
                └─ operationC(): void

问题：
- Client1只需要operationA/B
- Client2只需要operationC
- Client3只需要operationA/C
- 但都依赖整个接口
```

**第40页（重构后，符合ISP）**:
```
Client1 ──→ AbstractServiceA
            └─ operationA(): void
               operationB(): void

Client2 ──→ AbstractServiceB
            └─ operationC(): void

Client3 ──→ AbstractServiceC
            └─ operationA(): void
               operationC(): void

ConcreteService implements
  AbstractServiceA, AbstractServiceB, AbstractServiceC
```

---

### 第45页 - CRP继承方式（原始，违反CRP）⭐

**UML结构**:
```
DBUtil (红框标注)
  └─ getConnection(): Connection
       △
       │ (继承)
     ┌─┴─┐
     │   │
StudentDAO              TeacherDAO
├─ findStudentById()    ├─ findTeacherById()
└─ addStudent()         └─ setTeacherInfo()
```

**关键问题**:
- StudentDAO和TeacherDAO通过**继承**复用DBUtil
- 破坏封装，子类可见父类实现
- 耦合度高，灵活性差

---

### 第47页 - CRP组合方式（重构后，符合CRP）⭐

**UML结构**:
```
NewDBUtil
  └─ getConnection(): Connection
       △
       │ (继承)
     ┌─┴─┐
     │   │
DBUtil    (其他实现)

StudentDAO
  ├─ dbOperator: DBUtil          ← 组合关系✅
  ├─ findStudentById()
  ├─ addStudent()
  └─ save(StudentDTO): int

TeacherDAO
  ├─ dbOperator: DBUtil          ← 组合关系✅
  ├─ findTeacherById()
  ├─ setTeacherInfo()
  └─ save(TeacherDTO): int
```

**关键改进**:
- 改继承为组合：DAO类持有DBUtil对象
- 黑箱复用，降低耦合
- 可在运行时切换数据库连接方式

---

### 第54页 - LoD复杂依赖（原始，违反LoD）

**UML结构**:
```
Form1 ──┬──→ DAO1
        └──→ DAO2

Form2 ──┬──→ DAO1
        └──→ DAO3

Form3 ──→ DAO3

Form4 ──┬──→ DAO2
        └──→ DAO3

Form5 ──┬──→ DAO1
        ├──→ DAO2
        └──→ DAO4
```

**关键问题**:
- 5个Form与4个DAO交叉依赖，关系复杂
- 网状结构，耦合度极高

---

### 第56页 - LoD中介者模式（重构后，符合LoD）

**UML结构**:
```
Form1 ──┐
Form2 ──┤
Form3 ──┼──→ Controller1 ──┬──→ DAO1
Form4 ──┤                  └──→ DAO2
Form5 ──┘
              Controller2 ──┬──→ DAO2
                            ├──→ DAO3
                            └──→ DAO4
```

**关键改进**:
- 引入Controller作为中介者
- Form只与Controller通信
- DAO被Controller隔离
- 网状→树状结构

---

### 第8页 - OOA/OOD/OOP概念图

**图形内容**:
```
系统架构层次图：
┌─────────────────────────────┐
│  [3层系统架构示意]           │
│  顶层：3个模块               │
│  中层：多个子模块             │
│  底层：类和对象（蓝色高亮）   │
└─────────────────────────────┘

左：OOA (分析)
中：OOD (设计，蓝色背景)
右：OOP (编程)

箭头表示：约束关系应用到
```

---

### 第51页 - LoD朋友圈示意图

**图形内容**:
```
Object A Access Boundary（椭圆形边界）
  ├─ Object A（在边界内）
  ├─ Object B（在边界内）
  └─ Object C（在边界外）

说明：A只能访问边界内的B，不能直接访问C
```

---

### 第59页 - 7原则层次关系

**图形内容**:
```
小结

• 目标：开闭原则

• 指导：最小知识原则

• 基础：单一职责原则、可变性封装原则

• 实现：依赖倒转原则、合成复用原则、
        里氏代换原则、接口隔离原则
```

---

## 📋 需要图像分析但无UML的页面

| 页码 | 内容 | 图像类型 |
|-----|------|---------|
| 1 | 封面 | 装饰性背景图 |
| 3 | 目录 | 大字标题 |
| 4 | 章节页 | 大字标题 |
| 21 | 案例说明 | 文字为主，小量示意 |
| 32 | 概念页 | 文字为主 |

---

## 🔍 UML图特征总结

### 原始设计（违反原则）的特征
1. ✅ **红框标注**: 用红框标出问题代码
2. ✅ **具体类型**: 成员变量/参数使用具体类
3. ✅ **复杂依赖**: 网状、交叉依赖
4. ✅ **页面标题**: 通常是"XX实例说明"

### 重构设计（符合原则）的特征
1. ✅ **抽象类型**: 使用接口/抽象类
2. ✅ **配置文件**: config.xml外部化配置
3. ✅ **清晰层次**: 树状、分层结构
4. ✅ **页面标题**: 通常是"XX实例解析"

### 图形标注规范
- **红框**: 标注问题所在
- **蓝色背景**: UML类图标准色
- **虚线箭头**: 依赖关系
- **实线箭头**: 关联关系
- **空心三角**: 继承/实现关系

---

## 💡 经验教训

### 文本密度法的有效性

**验证结果**:
- 字符数<30的页面：100%包含重要图形（8个页面全中）
- 字符数30-150的页面：~60%包含UML图（13个页面中8个有UML）
- 字符数>150的页面：几乎都是纯文字

**结论**: 文本密度法是**有效的**初步筛选方法！

### 意外发现

1. **比预期更多的UML图**: 原以为只有2-3个，实际有12个重要UML图
2. **成对出现**: 原始设计+重构设计通常成对出现（如16-17页，19-22页，45-47页）
3. **红框是关键**: 课件用红框标注的地方，正是理解原则的关键

### 对后续课件的启示

**设计模式课件预测**:
- 每个模式至少3个UML图（结构图+参与者图+实例图）
- 02策略模式：预计5-6个UML图
- 03工厂模式：预计6-8个UML图（简单工厂+工厂方法+抽象工厂）
- 复习课件：预计15-20个UML图（所有模式总结）

**处理策略**:
1. ✅ 必须用文本密度法识别所有图像页
2. ✅ 批量提取后再逐个分析
3. ✅ 重点关注红框标注的内容

---

**状态**: 图像分析完成，准备开始撰写详解文档
