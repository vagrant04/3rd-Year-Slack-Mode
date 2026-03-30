# 03-开闭原则 OCP（第18-22页）

> Open-Closed Principle
>
> 对扩展开放，对修改关闭

---

## 第18页 - 定义

### 📋 开闭原则定义

**定义**：
- 一个软件实体应当**对扩展开放，对修改关闭**。
- 也就是说在设计一个模块的时候，应当使这个模块可以在**不被修改的前提下被扩展**。
- 即实现在**不修改源代码**的情况下**改变**这个模块的行为。

**英文定义**：
> Software entities should be open for extension, but closed for modification.

### 💡 理解要点

**两个关键词**：

1. **对扩展开放（Open for Extension）**
   - 模块的行为可以被扩展
   - 可以添加新功能以满足新需求
   - 不需要修改现有代码

2. **对修改关闭（Closed for Modification）**
   - 模块的源代码不应该被修改
   - 已有的代码应该保持稳定
   - 通过扩展而非修改来适应变化

**看似矛盾的统一**：
```
如何在"不修改"的前提下"扩展"？
         ↓
    抽象化是关键
         ↓
依赖抽象（接口/抽象类）而非具体类
         ↓
新增功能 = 新增子类（不修改原有代码）
```

**举例理解**：
```java
// ❌ 违反OCP：每次添加新形状都要修改代码
class GraphicEditor {
    void drawShape(Shape shape) {
        if (shape.type == 1) {
            drawCircle(shape);
        } else if (shape.type == 2) {
            drawRectangle(shape);
        }
        // 添加新形状 → 需要修改这里
    }
}

// ✅ 符合OCP：添加新形状不需要修改原有代码
abstract class Shape {
    abstract void draw();
}

class Circle extends Shape {
    void draw() { /* 画圆 */ }
}

class Rectangle extends Shape {
    void draw() { /* 画矩形 */ }
}

class GraphicEditor {
    void drawShape(Shape shape) {
        shape.draw();  // 多态调用
        // 添加新形状 → 无需修改这里
    }
}
```

### ⚠️ 考点

- 能够背诵OCP的定义（中英文）
- 理解"开放"和"关闭"的含义
- 理解抽象化是实现OCP的关键

---

## 第19页 - 历史背景与分析

### 📋 开闭原则的提出

**历史背景**（第19页图片内容）：

开闭原则由**Bertrand Meyer**于**1988年**提出，它是面向对象设计中**最重要的原则之一**。

在开闭原则的定义中，**软件实体**可以指：
- 一个**软件模块**
- 一个由多个类组成的**局部结构**
- 一个**独立的类**

**Bertrand Meyer的经典著作**：
- 《Object-Oriented Software Construction》（面向对象软件构造）

### 💡 理解软件实体

**软件实体的层次**：
```
┌─────────────────────────────┐
│  系统（System）              │  ← 可以应用OCP
│  ├─ 模块（Module）           │  ← 可以应用OCP
│  │  ├─ 包（Package）         │  ← 可以应用OCP
│  │  │  ├─ 类（Class）        │  ← 可以应用OCP
│  │  │  │  ├─ 方法（Method）  │  ← 可以应用OCP
│  │  │  │  └─ ...             │
│  │  │  └─ ...                │
│  │  └─ ...                   │
│  └─ ...                      │
└─────────────────────────────┘
```

**OCP可以应用在不同粒度**：
- **方法级**：通过策略模式使算法可扩展
- **类级**：通过继承/实现使类可扩展
- **模块级**：通过插件机制使模块可扩展

---

## 第20页 - 抽象化是关键

### 📋 内容要点（根据第20页图片）

**抽象化是开闭原则的关键**。

开闭原则还可以通过一个更加具体的**"对可变性封装原则"**来描述：

**可变性封装原则（EVP）**：
- **Encapsulation of Variation Principle, EVP**
- 要求找到系统的**可变因素**并将其**封装**起来

**核心思想**（红色标注）：
> "抽象化是开闭原则的关键。"
> "对可变性封装原则(Principle of Encapsulation of Variation, EVP)要求找到系统的可变因素并将其封装起来。"

### 💡 理解EVP与OCP的关系

```
    OCP（目标）
      ↓
"对扩展开放，对修改关闭"
      ↓
   如何实现？
      ↓
    EVP（手段）
      ↓
"封装可变因素"
      ↓
   具体做法
      ↓
1. 识别可变点（哪里会变化？）
2. 抽象化（定义接口/抽象类）
3. 配置化（用配置文件指定具体类）
```

**可变因素的识别**：

| 场景 | 可变因素 | 封装方式 |
|-----|---------|---------|
| 图形系统 | 图形类型（圆形、矩形、三角形...） | Shape接口 |
| 按钮系统 | 按钮样式（圆形、矩形...） | AbstractButton |
| 支付系统 | 支付方式（支付宝、微信、银联...） | PaymentMethod接口 |
| 日志系统 | 日志输出方式（文件、数据库、控制台...） | Logger接口 |

**封装可变因素的步骤**：

1. **识别可变点**
   ```java
   // 问自己：这里将来会变化吗？
   if (type == "circle") { ... }
   else if (type == "rectangle") { ... }
   // → 类型会变化，需要封装
   ```

2. **定义抽象**
   ```java
   abstract class Shape {
       abstract void draw();
   }
   ```

3. **具体实现**
   ```java
   class Circle extends Shape {
       void draw() { /* ... */ }
   }
   class Rectangle extends Shape {
       void draw() { /* ... */ }
   }
   ```

4. **依赖抽象**
   ```java
   class GraphicEditor {
       void drawShape(Shape shape) {  // 依赖抽象
           shape.draw();
       }
   }
   ```

### ⚠️ EVP的重要性

**为什么EVP很重要？**
- OCP是目标，EVP是实现手段
- EVP提供了可操作的指导：找到可变因素
- 许多设计模式都是EVP的具体应用

**与设计模式的关系**：
- **策略模式**：封装算法的变化
- **工厂模式**：封装对象创建的变化
- **观察者模式**：封装事件响应的变化
- **状态模式**：封装状态转换的变化

---

## 第21页 - 实例说明（原始设计）

### 📋 问题场景（根据第21页图片）

某图形界面系统提供了各种不同形状的按钮，客户端代码可针对这些按钮进行编程，用户可能会改变需求要求使用不同的按钮。

**原始设计方案如图所示**：

```
场景1：使用圆形按钮
┌──────────────────┐
│   LoginForm      │
├──────────────────┤
│ - button:        │
│   CircleButton   │ ← 具体类型
├──────────────────┤
│ + display(): void│
└──────────────────┘
         │
         └─→ CircleButton
             ├─ view(): void

场景2：改用矩形按钮（需要修改LoginForm源代码）
┌──────────────────┐
│   LoginForm      │
├──────────────────┤
│ - button:        │
│   RectangleButton│ ← 具体类型（修改了这里）
├──────────────────┤
│ + display(): void│
└──────────────────┘
         │
         └─→ RectangleButton
             ├─ view(): void
```

**问题描述**：
- 某图形界面系统提供了各种不同形状的按钮
- 客户端代码可针对这些按钮进行编程
- 用户可能会**改变需求**要求使用**不同的按钮**
- 现对该系统进行重构，使之满足开闭原则的要求

### 💡 问题分析

**违反OCP的表现**：

1. **依赖具体类**
   ```java
   class LoginForm {
       private CircleButton button;  // ❌ 依赖具体类
   }
   ```

2. **修改源代码**
   - 要改用RectangleButton
   - 必须修改LoginForm的源代码
   - 重新编译、测试、部署

3. **扩展困难**
   - 每次添加新按钮类型
   - 都要修改所有使用按钮的表单类

**变化原因**：
- 按钮样式的变化（圆形 → 矩形 → 椭圆形 → ...）
- 这是一个**可变因素**，需要封装

### 🔴 代码坏味道

```java
// ❌ 违反OCP的设计
public class LoginForm {
    private CircleButton button;  // 写死了具体类型

    public LoginForm() {
        button = new CircleButton();  // 写死了创建方式
    }

    public void display() {
        // 显示表单
        button.view();  // 调用按钮的view方法
    }
}

public class CircleButton {
    public void view() {
        System.out.println("显示圆形按钮");
    }
}

// 需求变更：改用矩形按钮
// → 必须修改LoginForm的源代码 ❌
public class LoginForm {
    private RectangleButton button;  // 修改了这里

    public LoginForm() {
        button = new RectangleButton();  // 修改了这里
    }

    public void display() {
        button.view();
    }
}
```

**问题总结**：
- ❌ 对扩展不开放：添加新按钮需要修改现有代码
- ❌ 对修改不关闭：需求变化导致源代码被修改
- ❌ 可变因素未封装：按钮类型的变化暴露给了LoginForm

---

## 第22页 - 实例解析（重构后设计）

### 🖼️ UML图（符合OCP）

```
┌──────────────────────────────────────┐
│          config.xml                  │
│  ......                              │
│  <className>CircleButton</className> │ ← 配置文件
│  ......                              │
└──────────────────────────────────────┘
         │ (运行时读取)
         ↓
┌──────────────────┐
│   LoginForm      │
├──────────────────┤
│ - button:        │
│   AbstractButton │ ← 抽象类型 ✅
├──────────────────┤
│ + display(): void│
│ ...              │
└──────────────────┘
         │ (依赖)
         ↓
┌──────────────────┐
│  AbstractButton  │
│   {abstract}     │
├──────────────────┤
│ + view(): void   │
│ ...              │
└──────────────────┘
         △
         │ (继承)
    ┌────┴────┐
    │         │
┌───────────┐ ┌─────────────────┐
│CircleButton│ │RectangleButton  │
├───────────┤ ├─────────────────┤
│+ view():  │ │+ view():        │
│  void     │ │  void           │
└───────────┘ └─────────────────┘
```

### 💡 重构要点

**三个关键改进**：

1. **引入抽象类AbstractButton**
   ```java
   abstract class AbstractButton {
       abstract void view();
   }
   ```

2. **LoginForm依赖抽象而非具体**
   ```java
   class LoginForm {
       private AbstractButton button;  // ✅ 依赖抽象
   }
   ```

3. **使用配置文件指定具体类型**
   ```xml
   <!-- config.xml -->
   <className>CircleButton</className>
   ```

### ✅ 重构后的完整代码

```java
// 1. 定义抽象按钮类
public abstract class AbstractButton {
    public abstract void view();
}

// 2. 具体按钮类
public class CircleButton extends AbstractButton {
    @Override
    public void view() {
        System.out.println("显示圆形按钮");
    }
}

public class RectangleButton extends AbstractButton {
    @Override
    public void view() {
        System.out.println("显示矩形按钮");
    }
}

// 3. 配置文件读取工具
public class XMLUtil {
    public static String getClassName() {
        try {
            // 读取config.xml
            DocumentBuilderFactory factory =
                DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse("config.xml");

            NodeList nodeList = doc.getElementsByTagName("className");
            String className = nodeList.item(0).getFirstChild().getNodeValue();
            return className;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

// 4. LoginForm（对修改关闭，对扩展开放）
public class LoginForm {
    private AbstractButton button;  // ✅ 依赖抽象

    public LoginForm() {
        // 通过配置文件和反射创建按钮对象
        String className = XMLUtil.getClassName();
        try {
            button = (AbstractButton) Class.forName(className).newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void display() {
        System.out.println("显示登录表单");
        button.view();  // 多态调用
    }
}

// 5. 客户端代码
public class Client {
    public static void main(String[] args) {
        LoginForm form = new LoginForm();
        form.display();
    }
}
```

**配置文件（config.xml）**：
```xml
<?xml version="1.0"?>
<config>
    <className>CircleButton</className>
</config>
```

**使用不同按钮**：
```xml
<!-- 改用矩形按钮：只需修改配置文件 -->
<config>
    <className>RectangleButton</className>
</config>
```

### 🎯 OCP的体现

**对扩展开放**：
```java
// 添加新的按钮类型：椭圆按钮
public class EllipseButton extends AbstractButton {
    @Override
    public void view() {
        System.out.println("显示椭圆形按钮");
    }
}

// 使用新按钮：修改配置文件
<config>
    <className>EllipseButton</className>
</config>

// ✅ LoginForm的源代码完全不需要修改
```

**对修改关闭**：
- LoginForm的源代码保持不变
- 所有依赖LoginForm的代码也不需要修改
- 无需重新编译、测试、部署LoginForm

### 📊 重构效果对比

| 维度 | 重构前 | 重构后 |
|-----|-------|-------|
| **添加新按钮** | ❌ 修改LoginForm源代码 | ✅ 只需添加新子类 |
| **切换按钮** | ❌ 修改LoginForm源代码 | ✅ 只需修改配置文件 |
| **编译部署** | ❌ 需要重新编译部署 | ✅ 无需重新编译 |
| **影响范围** | ❌ 影响所有依赖LoginForm的代码 | ✅ 零影响 |
| **可扩展性** | ❌ 低 | ✅ 高 |
| **可维护性** | ❌ 低 | ✅ 高 |
| **符合OCP** | ❌ 否 | ✅ 是 |

### 💡 设计模式体现

这个重构案例综合应用了多个设计模式：

1. **策略模式（Strategy Pattern）**
   - AbstractButton定义了按钮显示的策略接口
   - 不同的具体按钮类是不同的策略实现

2. **简单工厂模式（Simple Factory）**
   - XMLUtil + 反射机制充当工厂
   - 根据配置文件创建具体按钮对象

3. **依赖倒转原则（DIP）**
   - LoginForm依赖抽象的AbstractButton
   - 而不依赖具体的CircleButton或RectangleButton

### 🎯 OCP的实现技术

**实现OCP的常用技术**：

1. **抽象化（Abstraction）**
   - 定义接口或抽象类
   - 客户端依赖抽象而非具体

2. **多态（Polymorphism）**
   - 通过继承或实现接口
   - 运行时动态绑定

3. **配置化（Configuration）**
   - 使用配置文件（XML、properties、YAML等）
   - 外部化可变因素

4. **反射（Reflection）**
   - 根据类名字符串动态创建对象
   - Java: `Class.forName().newInstance()`

5. **依赖注入（Dependency Injection）**
   - Spring框架的核心机制
   - 通过容器注入依赖

### ⚠️ OCP的局限性

**不是所有地方都能做到OCP**：
- 完全的OCP是不现实的（会导致过度设计）
- 需要在灵活性和复杂性之间平衡
- 只对**频繁变化**的部分应用OCP

**如何判断是否需要OCP？**
```
问自己三个问题：
1. 这里经常变化吗？ → 是 → 考虑OCP
2. 变化的成本高吗？ → 是 → 考虑OCP
3. 抽象化的收益大于成本吗？ → 是 → 应用OCP
```

---

## 🎯 本章总结

### 核心要点

1. **OCP定义**
   - 对扩展开放，对修改关闭
   - 面向对象设计的**终极目标**

2. **实现OCP的关键**
   - 抽象化（定义接口/抽象类）
   - 封装可变因素（EVP）
   - 依赖抽象而非具体（DIP）

3. **实现技术**
   - 抽象 + 多态 + 配置 + 反射

4. **重构步骤**
   - 识别可变因素
   - 定义抽象
   - 具体实现继承抽象
   - 客户端依赖抽象
   - 用配置文件指定具体类

### 记忆技巧

**OCP口诀**：
> **"开扩闭改，抽象是关键"**
> （对扩展开放，对修改关闭，抽象化是关键）

**实现口诀**：
> **"找变化，抽象化，配置化"**

**判断方法**：
> 问自己："添加新功能需要修改原有代码吗？"
> - 需要修改 → 违反OCP ❌
> - 不需要修改 → 符合OCP ✅

### 与其他原则的关系

```
       OCP（目标）
         ↓
   ┌─────┼─────┐
   ↓     ↓     ↓
  DIP   LSP   EVP
(手段) (方式) (描述)
```

- **DIP**：依赖抽象是实现OCP的主要手段
- **LSP**：子类可替换父类是实现OCP的重要方式
- **EVP**：封装可变因素是OCP的具体描述

### ⚠️ 考点汇总

1. **定义题**：默写OCP定义（中英文）
2. **识别题**：判断代码/设计是否符合OCP
3. **重构题**：将违反OCP的代码重构为符合OCP
4. **论述题**：
   - 为什么说OCP是最重要的原则？
   - 如何实现OCP？
   - OCP与DIP/LSP的关系？
5. **综合题**：按钮系统的完整设计和实现

### 实践建议

1. **不要过度设计**
   - 只对频繁变化的部分应用OCP
   - 避免为了OCP而OCP

2. **渐进式重构**
   - 先写简单的代码
   - 当发现变化频繁时再重构为OCP

3. **结合配置文件**
   - 将可变因素外部化
   - 使系统更加灵活

### 下一章预告

[04-里氏代换原则-LSP.md](./04-里氏代换原则-LSP.md) 将介绍：
- 什么是"子类可替换父类"？
- LSP与OCP的关系
- 加密系统的设计案例（第27页UML图）

---

**返回**: [README.md](./README.md) | **导航**: [00-导航.md](./00-导航.md) | **上一章**: [02-单一职责原则-SRP.md](./02-单一职责原则-SRP.md) | **下一章**: [04-里氏代换原则-LSP.md](./04-里氏代换原则-LSP.md)
