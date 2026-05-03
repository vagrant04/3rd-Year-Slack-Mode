# Day 06: 设计模式（四）—— 其余重要模式 + 防御性编程

> 学习时间：30分钟 | 重要程度：★★★★☆
> 参考资料：复习资料/笔记/设计模式-整体.pdf, 旧课件/pmx/09

---

## 一、模板方法模式 Template Method（行为型）

### 1. 意图
定义一个操作中的算法骨架，将一些步骤延迟到子类中。使得子类可以不改变算法结构即可重定义某些步骤。

### 2. 结构
```java
abstract class AbstractClass {
    // 模板方法（final，不可覆盖）
    public final void templateMethod() {
        step1();      // 具体方法（已实现）
        step2();      // 抽象方法（子类实现）
        hook();       // 钩子方法（可选覆盖）
        step3();
    }
    void step1() { /* 固定实现 */ }
    abstract void step2(); // 子类必须实现
    void hook() { }        // 默认空，子类可选覆盖
    void step3() { /* 固定实现 */ }
}
```

### 3. 三种方法类型
- **具体方法**：算法中固定不变的步骤
- **抽象方法**：子类必须实现的步骤
- **钩子方法(Hook)**：有默认实现，子类可选择覆盖

### 4. Template Method vs Strategy
| 比较项 | Template Method | Strategy |
|--------|-----------------|----------|
| 变化粒度 | 算法中的某几步 | 整个算法 |
| 实现方式 | 继承 | 组合 |
| 控制反转 | 父类调子类（好莱坞原则） | 客户端选策略 |

---

## 二、单例模式 Singleton（创建型）

### 1. 意图
确保一个类只有一个实例，并提供一个全局访问点。

### 2. 实现方式（Java）
```java
// 方式1：饿汉式（线程安全，类加载时即创建）
class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    private Singleton() {}
    public static Singleton getInstance() { return INSTANCE; }
}

// 方式2：懒汉式（双重检查锁定）
class Singleton {
    private static volatile Singleton instance;
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

### 3. 要点
- 私有构造函数
- 静态实例变量
- 公共静态访问方法
- 注意线程安全问题

---

## 三、享元模式 Flyweight（结构型）

### 1. 意图
运用共享技术有效地支持大量细粒度的对象。

### 2. 核心概念
- **内部状态(Intrinsic)**：可以共享的、不随环境变化的状态（存在享元内部）
- **外部状态(Extrinsic)**：不可共享的、随环境变化的状态（由客户端传入）

### 3. 结构
```
Client ──▶ FlyweightFactory ──▶ 享元池(Map)
                                    │
                              ┌─────┴─────┐
                              │           │
                       ConcreteFlyweight  ConcreteFlyweight
                       (共享内部状态)     (共享内部状态)
```

### 4. Flyweight vs Prototype（2021真题）
| 比较项 | Flyweight | Prototype |
|--------|-----------|-----------|
| 目标 | 共享对象减少内存 | 通过克隆创建对象 |
| 对象数量 | 减少对象数量 | 创建新对象 |
| 状态 | 分离内/外部状态 | 复制整个对象 |
| 示例 | 字符渲染、棋子 | 复杂对象的快速创建 |

---

## 四、迭代器模式 Iterator（行为型）

### 1. 意图
提供一种方法顺序访问聚合对象中的各个元素，而又不暴露该对象的内部表示。

### 2. 核心接口
```java
interface Iterator<T> {
    boolean hasNext();
    T next();
}
interface Aggregate<T> {
    Iterator<T> createIterator();
}
```

### 3. 价值
- 将遍历逻辑与集合分离
- 支持多种遍历方式
- 统一不同集合的遍历接口

---

## 五、防御性编程 Defensive Programming（重要！2021真题）

### 1. 断言 Assertions

**定义**：在开发和测试阶段用于检查"不可能发生"的条件。

**使用规则**：
- 断言用于检查**不应该发生**的条件（程序员错误）
- **不要**用断言处理预期会发生的错误（如用户输入）
- 发布版本中通常关闭断言
- 断言失败意味着代码有bug

```java
assert denominator != 0 : "Denominator cannot be zero";
assert index >= 0 && index < array.length;
```

**断言 vs 错误处理**：
| | 断言 | 错误处理 |
|--|------|----------|
| 用途 | 检查程序员错误 | 处理运行时异常 |
| 生产环境 | 通常关闭 | 必须保留 |
| 触发含义 | 代码有bug | 外部条件异常 |

### 2. 错误处理 Error Handling

**策略选择**：
- 返回中性值（如空字符串、0）
- 返回上一个正确值
- 替换为最接近的合法值
- 记录日志并继续
- 返回错误码
- 抛出异常
- 关闭程序（安全关键系统）

### 3. 路障/防火墙 Barricades（2021真题）

**定义**：在系统边界处设置"防火墙"，将系统分为"安全区"和"不安全区"。

**核心思想**：
```
外部（不可信）──▶ [Barricade层：验证所有输入] ──▶ 内部（可信）
```

- **防火墙外**：假设所有数据不可信，使用错误处理
- **防火墙内**：假设数据已验证，可使用断言
- 防火墙负责将外部不可信数据转化为内部可信数据

**实际应用**：
- Web应用的Controller层验证所有请求参数
- Service层假设收到的数据是合法的
- Controller就是Barricade

```
用户输入 ──▶ Validation Layer(Barricade) ──▶ Business Logic(内部)
  不可信          验证、清洗、转换              可信区域
```

### 4. 考试常见问答

**Q：解释断言和路障的区别和联系**（2021真题）

**A**：
- 断言检查"不应该发生"的条件，用于验证程序内部逻辑的正确性
- 路障在系统边界验证外部输入，将不可信数据转为可信数据
- 联系：路障外使用错误处理（因为外部输入可能出错），路障内使用断言（因为数据已验证，如果条件不满足说明是内部bug）

---

## 六、创建型模式对比总结

| 模式 | 创建什么 | 如何创建 | 适用场景 |
|------|----------|----------|----------|
| Simple Factory | 单一产品 | 工厂类switch | 简单场景 |
| Factory Method | 单一产品 | 子类决定 | 产品等级扩展 |
| Abstract Factory | 产品族 | 工厂组合 | 产品族切换 |
| Builder | 复杂对象 | 分步构造 | 对象有多种表示 |
| Prototype | 相似对象 | 克隆 | 对象初始化开销大 |
| Singleton | 唯一实例 | 私有构造+静态 | 全局唯一资源 |

---

## 七、今日自测

1. Template Method中"好莱坞原则"是什么意思？
   > "Don't call us, we'll call you" —— 父类调用子类方法，子类不主动调用父类。控制反转。

2. 什么是Barricade？它与断言的关系是什么？
   > Barricade是系统边界的验证层。Barricade外用错误处理（外部不可信），Barricade内用断言（内部应可信）。

3. Flyweight模式的内部状态和外部状态分别是什么？
   > 内部状态：对象可共享的不变部分（如字体的字形数据）。外部状态：随环境变化的不可共享部分（如字符的位置、大小）。

---

## 八、明日预告

Day 07将进入架构部分：质量属性概念、质量属性场景（六要素）、七大质量属性及其策略。
