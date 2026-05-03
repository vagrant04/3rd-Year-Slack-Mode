# Day 02: 面向对象设计原则（下）+ 原则综合

> 学习时间：30分钟 | 重要程度：★★★★★（每年必考）
> 参考资料：复习资料/笔记/设计模式-设计模式原则.pdf, 旧课件/pmx/02

---

## 一、依赖倒置原则 DIP

**定义**：
- 高层模块不应该依赖低层模块，二者都应该依赖于抽象
- 抽象不应该依赖细节，细节应该依赖抽象

**核心思想**：面向接口编程，不面向实现编程。

**经典示例**：
```
// 违反DIP：高层直接依赖低层
class OrderService {
    MySQLDatabase db = new MySQLDatabase(); // 直接依赖具体实现
    void save(Order order) { db.insert(order); }
}

// 遵循DIP：依赖抽象
class OrderService {
    Database db;  // 依赖抽象接口
    OrderService(Database db) { this.db = db; } // 依赖注入
    void save(Order order) { db.insert(order); }
}
```

**DIP的实现方式**：
1. 构造函数注入（Constructor Injection）
2. Setter方法注入
3. 接口注入

**考试要点（2021真题）**：什么是DIP？如何通过DIP实现模块解耦？
- 答：DIP要求高层模块和低层模块都依赖于抽象接口。通过引入抽象层，高层模块不再直接创建或引用低层模块的具体类，而是通过接口交互，从而实现解耦。

---

## 二、接口隔离原则 ISP

**定义**：客户端不应被迫依赖于它不使用的方法。应当把"胖接口"分离为多个专门的接口。

**核心思想**：接口要小而专，不要大而全。

**违反示例**：
```
interface Worker {
    void work();
    void eat();      // Robot不需要eat
    void sleep();    // Robot不需要sleep
}
class Robot implements Worker {
    void work() { ... }
    void eat() { /* 无意义实现 */ }   // 被迫实现
    void sleep() { /* 无意义实现 */ } // 被迫实现
}
```

**正确做法**：
```
interface Workable { void work(); }
interface Eatable { void eat(); }
interface Sleepable { void sleep(); }

class Robot implements Workable { void work() { ... } }
class Human implements Workable, Eatable, Sleepable { ... }
```

**ISP与SRP的区别**：
- SRP关注类的职责划分（类的设计）
- ISP关注接口的职责划分（接口的设计）
- SRP是从实现者角度，ISP是从使用者（客户端）角度

---

## 三、组合复用原则 CRP (Composite Reuse Principle)

**定义**：优先使用对象组合/聚合（has-a），而非类继承（is-a）来实现代码复用。

**为什么组合优于继承**：
| 比较项 | 继承 | 组合 |
|--------|------|------|
| 耦合度 | 高（白箱复用，暴露父类实现） | 低（黑箱复用，只依赖接口） |
| 灵活性 | 编译时确定，静态 | 运行时可变，动态 |
| 破坏封装 | 是（子类知道父类实现） | 否 |
| 类爆炸 | 容易产生大量子类 | 通过组合避免 |

**使用继承的条件（同时满足）**：
1. 子类是父类的"一种"（is-a关系真正成立）
2. 子类不需要override父类的非抽象方法（LSP）
3. 父类是专门为继承设计的

**经典体现**：Bridge模式、Strategy模式、Decorator模式都优先使用组合而非继承。

---

## 四、迪米特法则 LoD (Law of Demeter)

**定义**：一个对象应该对其他对象保持最少的了解。只与"直接朋友"通信。

**直接朋友包括**：
1. 当前对象本身（this）
2. 以参数传入的对象
3. 当前对象创建的对象
4. 当前对象的成员变量引用的对象

**不是直接朋友**：通过其他对象间接获取的对象（方法链调用的中间对象）

**违反示例**：
```java
// 违反LoD：a.getB().getC().doSomething()
// "火车残骸"式调用链
customer.getAddress().getCity().getZipCode()
```

**正确做法**：
```java
// 遵循LoD：只与直接朋友通信
customer.getZipCode()  // Customer内部封装调用链
```

**LoD的另一种表述**：Don't talk to strangers.

---

## 五、七大原则的关系图（重要！考试常考综合理解）

```
        OCP（目标：对扩展开放，对修改关闭）
         ↑                    ↑
         |                    |
    LSP（基础）          DIP（手段）
  子类能替代父类        依赖于抽象
         |                    |
         ↓                    ↓
    ISP + SRP              CRP + LoD
  接口小/职责单一      组合优于继承/最少知识
```

**核心关系**：
- **OCP是目标**，是设计原则的最终追求
- **LSP是OCP的基石**：没有LSP，多态替换不安全，OCP的扩展就会出错
- **DIP是OCP的实现手段**：通过依赖抽象，使得新增实现不影响已有代码
- **ISP和SRP**为良好的抽象设计提供具体指导
- **CRP和LoD**减少耦合，使系统更容易扩展

---

## 六、往年真题精选

### 题1（2025期末）：
**题目**：以Notifier为例解释哪些OOP principles被违反。

给定一个Notifier类同时包含发送Email、SMS、微信通知的方法，且每新增通知渠道都要修改该类。

**标准答案**：
- 违反**SRP**：一个类承担了多种通知渠道的职责
- 违反**OCP**：新增通知渠道需要修改现有类代码
- 违反**DIP**：高层业务逻辑直接依赖具体通知实现

**修正方案**：
- 定义`Notifier`抽象接口
- 每种渠道一个具体实现类（EmailNotifier, SMSNotifier等）
- 使用策略模式或观察者模式组合通知方式

### 题2（2022期末）：
**题目**：解释Factory Method/Abstract Factory如何实现OCP。

**标准答案**：
- Factory Method：定义创建对象的接口（工厂方法），具体产品由子类决定。新增产品时只需新增产品类+具体工厂类，不修改已有代码。
- Abstract Factory：提供创建一组相关对象的接口。切换产品族只需切换具体工厂，客户端代码不变。

---

## 七、今日自测

1. DIP中，"高层模块"和"低层模块"分别指什么？
   > 高层：包含业务策略、规则的模块。低层：实现细节的模块（如数据库访问、网络通信）。

2. ISP和SRP有什么区别？
   > SRP从实现者角度要求类单一职责；ISP从使用者（客户端）角度要求接口精细化。

3. 为什么说"OCP是设计原则的终极目标"？
   > 因为OCP使系统可以在不修改已有代码的前提下扩展新功能，是软件可维护性和可扩展性的根本保证。其他原则（LSP、DIP、ISP、SRP）都是为实现OCP服务的。

---

## 八、明日预告

Day 03将学习创建型设计模式：Strategy（策略）、Factory Method（工厂方法）、Abstract Factory（抽象工厂）、Builder（建造者）。
