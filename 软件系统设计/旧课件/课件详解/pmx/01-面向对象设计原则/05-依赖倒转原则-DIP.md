# 05-依赖倒转原则 DIP（第28-37页）

> Dependency Inversion Principle
>
> 依赖抽象，不依赖具体；针对接口编程

---

## 核心定义

### 📋 依赖倒转原则定义（第30页）

**定义**：
- 高层模块不应该依赖低层模块，它们都应该依赖抽象
- 抽象不应该依赖于细节，细节应该依赖于抽象

**英文定义**：
> High level modules should not depend upon low level modules, both should depend upon abstractions. Abstractions should not depend upon details, details should depend upon abstractions.

**另一种表述**：
- 要**针对接口编程**，不要**针对实现编程**

**英文定义**：
> Program to an interface, not an implementation.

### 💡 理解要点

**什么是"倒转"？**

传统的依赖关系：
```
高层模块 → 低层模块
  (直接依赖具体实现)
```

倒转后的依赖关系：
```
高层模块 → 抽象 ← 低层模块
  (都依赖抽象)
```

**示例对比**：

❌ **违反DIP**（传统依赖）：
```java
class OrderService {  // 高层
    private MySQLDatabase db = new MySQLDatabase();  // 低层具体类

    void saveOrder(Order order) {
        db.insert(order);
    }
}
```

✅ **符合DIP**（依赖倒转）：
```java
interface Database {  // 抽象
    void insert(Object data);
}

class OrderService {  // 高层
    private Database db;  // 依赖抽象

    public OrderService(Database db) {
        this.db = db;
    }

    void saveOrder(Order order) {
        db.insert(order);
    }
}

class MySQLDatabase implements Database {  // 低层依赖抽象
    public void insert(Object data) { /* ... */ }
}
```

---

## 历史背景

### 📋 Robert C. Martin与DIP（第28-29页）

依赖倒转原则是**Robert C. Martin**在**1996年**为《C++ Reporter》所写的专栏**Engineering Notebook**的第三篇。

后来加入到他在**2002年**出版的经典著作《**Agile Software Development, Principles, Patterns, and Practices**》中。

---

## 实现方式

### 📋 抽象+配置（第31页）

**依赖倒转原则的常用实现方式之一**：
- 在代码中使用**抽象类**
- 而将**具体类**放在**配置文件**中

**口号**：
> **"将抽象放进代码，将细节放进元数据"**
>
> Put Abstractions in Code, Details in Metadata

出处：《程序员修炼之道：从小工到专家》(The Pragmatic Programmer)

### 💡 类之间的耦合（第32页）

**三种耦合关系**：

1. **零耦合关系**
   - 两个类完全独立
   - 没有任何关联

2. **具体耦合关系**
   - 依赖具体的类
   - 耦合度最高

3. **抽象耦合关系**
   - 依赖抽象（接口/抽象类）
   - 耦合度较低

**DIP要求**：
- 客户端依赖于**抽象耦合**
- 以抽象方式耦合是依赖倒转原则的关键

---

## 实例解析

### 📋 数据转换系统问题（第33-34页）

**场景**：
某系统提供一个数据转换模块，可以将来自不同数据源的数据转换成多种格式：
- 数据源：DatabaseSource（数据库）、TextSource（文本文件）
- 转换格式：XMLTransformer（XML）、XLSTransformer（XLS）

**问题**：
- 由于需求的变化，系统可能需要增加新的数据源或者新的文件格式
- 每增加一个新类型的数据源或文件格式，客户类MainClass都需要**修改源代码**
- 违背了开闭原则

**任务**：使用依赖倒转原则对其进行重构。

### 🖼️ 重构后UML图（第35页）

根据UML图像分析记录：

```
┌────────────────────────────────────┐
│         config.xml                 │
│  <sourceName>DatabaseSource        │
│   </sourceName>                    │
│  <transformerName>XMLTransformer   │
│   </transformerName>               │
└────────────────────────────────────┘
         │
         ↓ (运行时读取)

┌────────────────────────────┐
│       MainClass            │
├────────────────────────────┤
│ + main(String args[]): void│
└────────────────────────────┘
     │                  │
     │                  │
     ↓                  ↓
┌──────────────┐  ┌──────────────────┐
│AbstractSource│  │AbstractTransformer│ ← 红框标注
│  (抽象)      │  │   (抽象)          │
├──────────────┤  ├──────────────────┤
│+ read(): Data│  │+ transform(Data) │
└──────────────┘  └──────────────────┘
     △                     △
     │                     │
┌────┴────┐         ┌──────┴──────┐
│         │         │             │
DatabaseSource   TextSource   XMLTransformer   XLSTransformer
```

### ✅ 重构后代码

```java
// 1. 抽象数据源
abstract class AbstractSource {
    abstract Data read();
}

// 2. 具体数据源
class DatabaseSource extends AbstractSource {
    Data read() {
        // 从数据库读取
        return new Data();
    }
}

class TextSource extends AbstractSource {
    Data read() {
        // 从文本文件读取
        return new Data();
    }
}

// 3. 抽象转换器
abstract class AbstractTransformer {
    abstract void transform(Data data);
}

// 4. 具体转换器
class XMLTransformer extends AbstractTransformer {
    void transform(Data data) {
        // 转换为XML
    }
}

class XLSTransformer extends AbstractTransformer {
    void transform(Data data) {
        // 转换为XLS
    }
}

// 5. MainClass（依赖抽象）
class MainClass {
    public static void main(String[] args) {
        // 从配置文件读取类名
        String sourceName = XMLUtil.getSourceName();
        String transformerName = XMLUtil.getTransformerName();

        // 通过反射创建对象
        AbstractSource source =
            (AbstractSource) Class.forName(sourceName).newInstance();
        AbstractTransformer transformer =
            (AbstractTransformer) Class.forName(transformerName).newInstance();

        // 使用抽象类型
        Data data = source.read();
        transformer.transform(data);
    }
}
```

### 🎯 DIP的体现

**对扩展开放**：
```java
// 添加新数据源：CSVSource
class CSVSource extends AbstractSource {
    Data read() {
        // 从CSV读取
        return new Data();
    }
}

// 添加新转换器：JSONTransformer
class JSONTransformer extends AbstractTransformer {
    void transform(Data data) {
        // 转换为JSON
    }
}

// MainClass无需修改 ✅
```

**对修改关闭**：
- MainClass只依赖抽象
- 添加新的数据源或转换器不需要修改MainClass

---

## DIP与OCP的关系

### 核心观点

**简单来说**：
- 依赖倒转原则就是指：代码要**依赖于抽象的类**，而不要**依赖于具体的类**
- 要**针对接口或抽象类编程**，而不是**针对具体类编程**

**与OCP的关系**：
- 实现开闭原则的关键是**抽象化**
- 并且从抽象化导出具体化实现
- 如果说**开闭原则是面向对象设计的目标**
- 那么**依赖倒转原则就是面向对象设计的主要手段**

```
   目标：OCP
      ↓
 主要手段：DIP
      ↓
  实现技术：
  抽象化+多态+配置
```

---

## 本章总结

### 核心要点

1. **DIP定义**
   - 高层和低层都依赖抽象
   - 针对接口编程，不针对实现

2. **依赖倒转的含义**
   - 传统：高层 → 低层
   - 倒转：高层 → 抽象 ← 低层

3. **实现技术**
   - 定义抽象（接口/抽象类）
   - 具体类实现抽象
   - 客户端依赖抽象
   - 配置文件指定具体类

4. **DIP是实现OCP的主要手段**

### 记忆口诀

> **"高低靠抽象，细节靠抽象"**
> （高层低层都靠抽象，细节依赖抽象）

> **"针对接口编程"**

### ⚠️ 考点

1. 背诵DIP定义
2. 理解"倒转"的含义
3. DIP与OCP的关系
4. 数据转换系统的重构

---

**返回**: [README.md](./README.md) | **上一章**: [04-里氏代换原则-LSP.md](./04-里氏代换原则-LSP.md) | **下一章**: [06-接口隔离原则-ISP.md](./06-接口隔离原则-ISP.md)
