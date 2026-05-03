# Day 03: 设计模式（一）—— 策略模式 + 工厂模式族

> 学习时间：30分钟 | 重要程度：★★★★★（年年必考，2025考了Factory+OCP）
> 参考资料：复习资料/笔记/设计模式-整体.pdf, 旧课件/pmx/03-04

---

## 一、策略模式 Strategy Pattern（行为型）

### 1. 意图
定义一系列算法，把它们一个个封装起来，并且使它们可相互替换。让算法独立于使用它的客户而独立变化。

### 2. 结构
```
┌──────────────┐         ┌─────────────────┐
│   Context    │────────▶│  <<interface>>   │
│              │         │    Strategy      │
│ -strategy    │         ├─────────────────┤
│ +execute()   │         │ +algorithm()     │
└──────────────┘         └─────────────────┘
                                 △
                    ┌────────────┼────────────┐
                    │            │            │
           ┌───────┴──┐  ┌─────┴────┐  ┌───┴────────┐
           │ConcreteA  │  │ConcreteB │  │ConcreteC   │
           │+algorithm│  │+algorithm│  │+algorithm  │
           └──────────┘  └──────────┘  └────────────┘
```

### 3. 角色
- **Context（上下文）**：持有Strategy引用，调用策略方法
- **Strategy（抽象策略）**：定义算法接口
- **ConcreteStrategy（具体策略）**：实现具体算法

### 4. 代码示例
```java
// 抽象策略
interface SortStrategy {
    void sort(int[] arr);
}
// 具体策略
class BubbleSort implements SortStrategy {
    public void sort(int[] arr) { /* 冒泡排序 */ }
}
class QuickSort implements SortStrategy {
    public void sort(int[] arr) { /* 快速排序 */ }
}
// 上下文
class Sorter {
    private SortStrategy strategy;
    public Sorter(SortStrategy s) { this.strategy = s; }
    public void setStrategy(SortStrategy s) { this.strategy = s; }
    public void doSort(int[] arr) { strategy.sort(arr); }
}
```

### 5. 体现的设计原则
- **OCP**：新增排序算法只需新增类，不修改已有代码
- **DIP**：Context依赖抽象Strategy，不依赖具体实现
- **CRP**：通过组合持有Strategy，而非继承

### 6. Strategy vs State（考试常考区别）
| 比较项 | Strategy | State |
|--------|----------|-------|
| 切换者 | 客户端决定使用哪个策略 | 状态自身决定转换 |
| 知晓关系 | 策略之间不知道彼此存在 | 状态之间知道如何转换 |
| 切换时机 | 通常初始化时确定 | 运行时根据条件自动切换 |
| 典型场景 | 排序算法、支付方式、折扣计算 | 订单状态机、TCP连接状态 |

---

## 二、简单工厂模式 Simple Factory（非GoF，但重要）

### 1. 意图
由一个工厂类根据传入参数决定创建哪种产品类的实例。

### 2. 结构
```
        ┌─────────────────┐
        │  SimpleFactory  │
        │ +create(type)   │──────创建──────▶ Product
        └─────────────────┘                    △
                                     ┌─────────┼─────────┐
                                ProductA    ProductB    ProductC
```

### 3. 缺点（重要考点）
- **违反OCP**：新增产品必须修改工厂类的if/switch逻辑
- 适合产品种类少且不经常变化的场景

---

## 三、工厂方法模式 Factory Method（创建型）

### 1. 意图
定义一个创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到其子类。

### 2. 结构
```
┌──────────────────┐         ┌─────────────────┐
│  <<abstract>>    │         │  <<interface>>   │
│    Creator       │────────▶│    Product       │
│ +factoryMethod() │         └─────────────────┘
│ +operation()     │                  △
└──────────────────┘                  │
         △                    ┌───────┴───────┐
         │                    │               │
┌────────┴────────┐   ┌──────┴──┐    ┌──────┴──┐
│ ConcreteCreator │   │ProductA │    │ProductB │
│ +factoryMethod()│   └─────────┘    └─────────┘
└─────────────────┘
```

### 3. 如何体现OCP（2022/2025真题）
- 新增产品时：新增 ConcreteProduct + ConcreteCreator
- 不修改已有的Creator、已有的ConcreteCreator
- 客户端通过Creator接口操作，无需感知具体产品

### 4. 代码示例
```java
// 抽象产品
interface Document { void open(); }
// 具体产品
class PDFDocument implements Document { public void open() { /*...*/ } }
class WordDocument implements Document { public void open() { /*...*/ } }

// 抽象工厂（Creator）
abstract class Application {
    abstract Document createDocument(); // 工厂方法
    public void openDocument() {
        Document doc = createDocument(); // 延迟到子类
        doc.open();
    }
}
// 具体工厂
class PDFApplication extends Application {
    Document createDocument() { return new PDFDocument(); }
}
class WordApplication extends Application {
    Document createDocument() { return new WordDocument(); }
}
```

---

## 四、抽象工厂模式 Abstract Factory（创建型）

### 1. 意图
提供一个创建**一系列相关或互相依赖对象**的接口，而无需指定它们具体的类。

### 2. 结构
```
┌─────────────────────────┐
│   <<interface>>          │
│   AbstractFactory        │
│ +createProductA()        │
│ +createProductB()        │
└─────────────────────────┘
            △
    ┌───────┴────────┐
    │                │
┌───┴──────┐  ┌─────┴──────┐
│Factory1  │  │ Factory2   │
│createA() │  │ createA()  │  ← 每个工厂生产一个产品族
│createB() │  │ createB()  │
└──────────┘  └────────────┘
```

### 3. Factory Method vs Abstract Factory（考试高频对比）

| 比较项 | Factory Method | Abstract Factory |
|--------|---------------|-----------------|
| 产品数量 | 一个产品等级结构 | 多个产品等级结构（产品族） |
| 工厂数量 | 每个具体产品一个工厂 | 每个产品族一个工厂 |
| 扩展方式 | 新增产品+工厂类 | 切换工厂实现即切换整个产品族 |
| 典型场景 | 单一对象创建 | UI主题、跨平台组件、数据库方言 |

### 4. Abstract Factory的OCP分析
- **产品族扩展（加新工厂）**：满足OCP，新增ConcreteFactory即可
- **产品等级扩展（加新产品方法）**：违反OCP，需修改AbstractFactory接口

---

## 五、往年真题精选

### 2025期末真题：
**题目**：解释Factory Method和Abstract Factory模式的区别，说明它们如何体现OCP。

**答案要点**：
1. FM创建单一产品，AF创建产品族
2. FM通过继承延迟实例化，AF通过组合选择产品族
3. FM扩展新产品：新增产品类+工厂子类，不改已有代码 → OCP
4. AF扩展新产品族：新增工厂实现，不改客户端 → OCP
5. AF扩展产品等级（新增产品种类）：需修改接口 → 违反OCP

---

## 六、今日自测

1. Strategy模式中，谁决定使用哪个具体策略？
   > 客户端（或Context的创建者）决定。

2. 简单工厂为什么违反OCP？工厂方法如何解决？
   > 简单工厂用if/switch判断类型，新增产品必须改工厂。工厂方法将创建逻辑延迟到子类，新增产品只需新增子类。

3. 什么场景用Abstract Factory而非Factory Method？
   > 需要创建一组相关产品（如同一主题的Button+Dialog+Menu），且需要保证产品间兼容性时使用AF。

---

## 七、明日预告

Day 04将学习：Observer（观察者）、Command（命令）、Composite（组合）、State（状态）模式。
