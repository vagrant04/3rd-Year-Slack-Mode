# Day 01: 面向对象设计原则（上）

> 学习时间：30分钟 | 重要程度：★★★★★（每年必考）
> 参考资料：复习资料/笔记/设计模式-设计模式原则.pdf, 旧课件/pmx/02

---

## 一、七大设计原则总览

| 原则 | 英文全称 | 核心思想 |
|------|--------|--------|
| SRP | Single Responsibility Principle | 一个类只有一个引起变化的原因 |
| OCP | Open-Closed Principle | 对扩展开放，对修改关闭 |
| LSP | Liskov Substitution Principle | 子类能替换父类且不改变程序正确性 |
| DIP | Dependency Inversion Principle | 依赖抽象，不依赖具体 |
| ISP | Interface Segregation Principle | 客户不应被迫依赖不需要的接口 |
| CRP | Composite Reuse Principle | 优先使用组合/聚合，而非继承 |
| LoD | Law of Demeter | 最少知识原则，只与直接朋友通信 |

---

## 二、单一职责原则 SRP

**定义**：一个类应该只有一个引起它变化的原因（一个类只负责一个功能领域中的相应职责）。

**核心思想**：高内聚、低耦合。如果一个类承担的职责过多，就等于把这些职责耦合在一起。

**违反示例**：
```
class UserManager {
    void login()          // 职责1：认证
    void saveToDb()       // 职责2：持久化
    void generateReport() // 职责3：报告生成
}
```

**正确做法**：将三个职责分离为三个类：`Authenticator`、`UserRepository`、`ReportGenerator`。

**考试要点**：SRP不仅适用于类，也适用于方法。识别"变化的原因"是关键。

---

## 三、开闭原则 OCP（最重要！）

**定义**：软件实体（类、模块、函数等）应该对扩展开放，对修改关闭。

**核心思想**：通过抽象化来实现。当需要新增功能时，不修改现有代码，而是通过添加新代码来扩展。

**实现手段**：
- 抽象类/接口定义稳定的抽象层
- 具体实现类提供扩展
- Strategy模式、Factory模式等都是OCP的具体实现

**经典考题（2022/2025真题）**：Factory Method如何体现OCP？
- 答：定义抽象工厂接口，新增产品时只需新增具体工厂类，无需修改已有代码。

**与其他原则的关系**：
- LSP是OCP的基础（子类替换父类才能保证扩展不破坏原有功能）
- DIP是OCP的手段（依赖抽象才能做到对修改关闭）

---

## 四、里氏替换原则 LSP

**定义**：所有引用基类的地方必须能透明地使用其子类的对象，且程序行为不变。

**核心要求**：
1. 子类可以扩展父类的功能，但不能改变父类原有的功能
2. 子类可以实现父类的抽象方法，但不能覆盖父类的非抽象方法
3. 子类方法的前置条件（输入参数）可以更宽松
4. 子类方法的后置条件（输出结果）可以更严格

**经典违反示例（往年考题）**：正方形继承长方形
```
class Rectangle {
    int width, height;
    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
}
class Square extends Rectangle {
    void setWidth(int w) { width = w; height = w; }  // 违反LSP！
    void setHeight(int h) { width = h; height = h; } // 改变了父类行为
}
```
调用 `setWidth` 后期望只改变宽度，但Square同时改变了高度，违反了LSP。

**考试要点（2022真题）**：LSP如何支持OCP？
- 答：只有子类能完全替代父类（LSP），基于抽象编程才是安全的（OCP才能成立）。

---

## 五、今日小结与自测

### 自测题（模拟往年真题）：

1. **简述LSP与OCP的关系**（2022真题原题）
   > LSP是OCP的基础。OCP要求对扩展开放、对修改关闭，实现方式是通过多态使用基类引用。但这要求子类能完全替代父类（LSP），否则扩展（新的子类）会破坏程序正确性，OCP就无法保证。

2. **举例说明SRP的违反与修正**
   > 一个类同时负责数据访问和业务逻辑，应拆分为Repository类和Service类。

3. **OCP的实现手段有哪些？**
   > 抽象化（接口/抽象类）、多态、设计模式（Strategy、Factory Method、Observer等）。

---

## 六、明日预告

Day 02将学习：DIP（依赖倒置）、ISP（接口隔离）、CRP（组合复用）、LoD（迪米特法则），并做原则间关系的综合梳理。
