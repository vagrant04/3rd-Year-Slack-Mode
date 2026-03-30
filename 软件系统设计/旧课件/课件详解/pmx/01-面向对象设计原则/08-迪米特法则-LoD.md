# 08-迪米特法则 LoD（第51-57页）

> Law of Demeter / Least Knowledge Principle
>
> 只与直接朋友通信，最少知识原则

---

## 核心定义

### 📋 迪米特法则定义（第51页）

**迪米特法则**（Law of Demeter, LoD）
又称为**最少知识原则**（Least Knowledge Principle, LKP）

它有多种定义方法，其中几种典型定义如下：

**定义1**：
- 不要和"陌生人"说话

**英文定义**：
> Don't talk to strangers.

**定义2**：
- 只与你的**直接朋友**通信

**英文定义**：
> Talk only to your immediate friends.

**定义3**：
- 每一个软件单位对其他的单位都只有**最少的知识**
- 而且局限于那些与本单位**密切相关**的软件单位

**英文定义**：
> Each unit should have only limited knowledge about other units: only units "closely" related to the current unit.

### 💡 理解要点

**简单地说**：
- 迪米特法则就是指一个软件实体应当**尽可能少的与其他实体发生相互作用**
- 这样，当一个模块修改时，就会**尽量少的影响其他的模块**
- 扩展会相对容易
- 这是对软件实体之间**通信的限制**
- 它要求限制软件实体之间通信的**宽度和深度**

**来源**：
- 迪米特法则来自于**1987年秋**
- 美国**东北大学**（Northeastern University）
- 一个名为"**Demeter**"的研究项目

---

## 朋友圈概念

### 📋 什么是"朋友"？（第52页）

在迪米特法则中，对于一个对象，其**朋友**包括以下几类：

1. **当前对象本身（this）**
2. **以参数形式传入到当前对象方法中的对象**
3. **当前对象的成员对象**
4. **如果当前对象的成员对象是一个集合，那么集合中的元素也都是朋友**
5. **当前对象所创建的对象**

任何一个对象，如果满足上面的条件之一，就是当前对象的"**朋友**"，否则就是"**陌生人**"。

### 💡 朋友圈示意图（第51页图像）

```
┌─────────────────────────────────┐
│  Object A Access Boundary       │ ← 椭圆形边界
│  (A的朋友圈)                     │
│                                 │
│    Object A (自己)              │
│        ↓                        │
│    Object B (朋友)              │
│                                 │
└─────────────────────────────────┘

    Object C (陌生人，在边界外)
```

**规则**：
- A可以访问B（朋友）✅
- A不能直接访问C（陌生人）❌
- 如果A需要访问C，应该通过B转发

### 💡 朋友关系示例

```java
class A {
    private B b;  // 成员对象 → 朋友

    void method1(C c) {  // 参数对象 → 朋友
        D d = new D();  // 创建的对象 → 朋友

        this.doSomething();  // 自己 → 朋友
        b.doSomething();     // 成员 → 朋友 ✅
        c.doSomething();     // 参数 → 朋友 ✅
        d.doSomething();     // 创建的 → 朋友 ✅

        E e = c.getE();      // ❌ 陌生人
        e.doSomething();     // ❌ 违反LoD（和陌生人说话）
    }
}
```

---

## 狭义与广义

### 📋 狭义的迪米特法则（第52-53页）

**狭义LoD**：
- 如果两个类**不必彼此直接通信**
- 那么这两个类就**不应当发生直接的相互作用**
- 如果其中的一个类需要调用另一个类的某一个方法的话
- 可以通过**第三者转发**这个调用

**效果**：
- ✅ 降低类之间的耦合
- ❌ 会在系统中增加大量的小方法并散落在系统的各个角落
- ✅ 可以使一个系统的局部设计简化
- ❌ 会造成系统的不同模块之间的通信效率降低
- ❌ 使得系统的不同模块之间不容易协调

### 📋 广义的迪米特法则（第53页）

**广义LoD**：
- 指对对象之间的**信息流量、流向**以及**信息的影响**的控制
- 主要是对**信息隐藏**的控制

**信息隐藏的优点**：
- 可以使各个子系统之间**脱耦**
- 从而允许它们**独立地被开发、优化、使用和修改**
- 同时可以**促进软件的复用**
- 由于每一个模块都不依赖于其他模块而存在
- 因此每一个模块都可以**独立地在其他的地方使用**

**重要性**：
- 一个系统的规模越大，信息的隐藏就越重要
- 而信息隐藏的重要性也就越明显

---

## 实例解析

### 🖼️ 复杂依赖问题（第54页）

**原始设计（违反LoD）**：

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

**问题分析**：
- 5个Form与4个DAO之间存在**交叉依赖**
- 关系复杂，呈**网状结构**
- 耦合度**极高**

**代码示例（违反LoD）**：
```java
// ❌ Form直接依赖多个DAO
class Form1 {
    private DAO1 dao1;
    private DAO2 dao2;

    void save() {
        dao1.save();  // 直接访问DAO1
        dao2.save();  // 直接访问DAO2
    }
}

class Form5 {
    private DAO1 dao1;
    private DAO2 dao2;
    private DAO4 dao4;

    void process() {
        dao1.query();  // 直接访问DAO1
        dao2.update(); // 直接访问DAO2
        dao4.delete(); // 直接访问DAO4
    }
}

// 问题：Form知道了太多DAO的细节
```

### 🖼️ 中介者模式（第56页）

**重构后设计（符合LoD）**：

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

**改进**：
- 引入**Controller**作为中介者
- Form只与Controller通信
- DAO被Controller隔离
- 网状结构 → 树状结构

**代码示例（符合LoD）**：
```java
// ✅ 引入中介者Controller
class Controller1 {
    private DAO1 dao1;
    private DAO2 dao2;

    void saveForm1Data(Form1Data data) {
        dao1.save(data.getPart1());
        dao2.save(data.getPart2());
    }
}

class Controller2 {
    private DAO2 dao2;
    private DAO3 dao3;
    private DAO4 dao4;

    void processForm5Data(Form5Data data) {
        dao2.update(data);
        dao3.query(data);
        dao4.delete(data);
    }
}

// ✅ Form只与Controller通信
class Form1 {
    private Controller1 controller;

    void save() {
        Form1Data data = collectData();
        controller.saveForm1Data(data);  // 只和Controller说话
        // ✅ Form不知道DAO1和DAO2的存在
    }
}

class Form5 {
    private Controller2 controller;

    void process() {
        Form5Data data = collectData();
        controller.processForm5Data(data);  // 只和Controller说话
        // ✅ Form不知道DAO2/3/4的存在
    }
}
```

### ✅ 重构效果对比

| 维度 | 重构前 | 重构后 |
|-----|-------|-------|
| **依赖结构** | 网状（复杂） | 树状（清晰） |
| **Form依赖** | 直接依赖多个DAO | 只依赖Controller |
| **知识范围** | Form知道所有DAO | Form只知道Controller |
| **耦合度** | 极高 | 低 |
| **可维护性** | 低（牵一发动全身） | 高（修改局部化） |
| **符合LoD** | ❌ | ✅ |

---

## LoD的应用

### 📋 主要用途（第57页）

迪米特法则的主要用途在于**控制信息的过载**：

**在类的划分上**：
- 应当尽量创建**松耦合**的类
- 类之间的耦合度越低，就越有利于**复用**
- 一个处在松耦合中的类一旦被修改，**不会对关联的类造成太大波及**

**在类的结构设计上**：
- 每一个类都应当尽量降低其**成员变量和成员函数的访问权限**
- 能private就private，能protected就protected

**在类的设计上**：
- 只要有可能，一个类型应当设计成**不变类**（Immutable）

**在对其他类的引用上**：
- 一个对象对其他对象的引用应当**降到最低**

---

## 思考题

### 📋 Stack继承Vector问题（第55页）

**问题**：
在JDK中，`java.util.Stack`是`java.util.Vector`类的子类，该设计合理吗？若不合理，请分析解释该设计存在的问题。

**分析**：

1. **违反LSP**
   ```java
   Stack<String> stack = new Stack<>();
   stack.add(0, "item");  // 可以在任意位置插入
   // ❌ 破坏了栈的LIFO特性
   ```

2. **暴露过多方法**
   - Stack是栈（LIFO），应该只有push/pop/peek
   - 但继承Vector后，拥有了所有Vector的方法
   - 如：add(), remove(), get(), set()
   - 违反了LoD（暴露了不该暴露的方法）

3. **违反ISP**
   - 客户端被迫依赖Stack不需要的方法
   - Vector的方法对Stack来说是"胖接口"

**正确设计**：
```java
// ✅ 应该用组合而非继承
class Stack<E> {
    private List<E> elements = new ArrayList<>();  // 组合

    void push(E item) {
        elements.add(item);
    }

    E pop() {
        return elements.remove(elements.size() - 1);
    }

    E peek() {
        return elements.get(elements.size() - 1);
    }

    // ✅ 不暴露List的其他方法
}
```

---

## 本章总结

### 核心要点

1. **LoD定义**
   - 只与直接朋友通信
   - 不和陌生人说话
   - 最少知识原则

2. **朋友的定义**
   - 自己、参数、成员、成员集合元素、创建的对象

3. **狭义vs广义**
   - 狭义：通过第三者转发调用
   - 广义：信息隐藏

4. **实现技术**
   - 引入中介者（Controller）
   - 降低访问权限
   - 使用不变类

### 记忆口诀

> **"只和朋友说话，不和陌生人说话"**

> **"知道的越少，耦合越低"**

> **"网状变树状，中介是关键"**

### 判断方法

```
问自己："这个对象是不是我的朋友？"
- 是自己/参数/成员/创建的 → 是朋友 ✅
- 从其他对象获取的 → 是陌生人 ❌

问自己："通过几层才能访问到？"
- 1层（直接朋友） → 符合LoD ✅
- 2层以上（a.getB().getC()） → 违反LoD ❌
```

### ⚠️ 考点

1. 背诵LoD的三种定义
2. 朋友的5种分类
3. Form-DAO中介者模式重构
4. Stack继承Vector的问题分析
5. LoD与其他原则的关系

---

**返回**: [README.md](./README.md) | **上一章**: [07-合成复用原则-CRP.md](./07-合成复用原则-CRP.md) | **下一章**: [09-总结与思考.md](./09-总结与思考.md)
