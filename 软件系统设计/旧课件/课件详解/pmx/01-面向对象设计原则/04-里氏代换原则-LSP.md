# 04-里氏代换原则 LSP（第23-27页）

> Liskov Substitution Principle
>
> 子类对象可以透明地替换父类对象

---

## 第23页 - 定义

### 📋 里氏代换原则定义

**定义方式一**（严格定义）：
- 如果对每一个类型为S的对象o1，都有类型为T的对象o2，使得以T定义的所有程序P在所有的对象o2都代换成o1时，程序P的行为没有变化，那么类型S是类型T的子类型。

**英文定义**：
> If for each object o1 of type S there is an object o2 of type T such that for all programs P defined in terms of T, the behavior of P is unchanged when o1 is substituted for o2 then S is a subtype of T.

**定义方式二**（易理解版）：
- 所有引用基类（父类）的地方必须能**透明地**使用其子类的对象。

**英文定义**：
> Functions that use pointers or references to base classes must be able to use objects of derived classes without knowing it.

### 💡 理解要点

**"透明地替换"的含义**：
```
父类引用 parent = new 父类();
     ↓
替换为子类对象
     ↓
父类引用 parent = new 子类();
     ↓
程序行为不变 ✅
```

**举例**：
```java
// 父类
class Bird {
    void fly() {
        System.out.println("鸟在飞");
    }
}

// 子类
class Sparrow extends Bird {
    @Override
    void fly() {
        System.out.println("麻雀在飞");
    }
}

// 客户端代码
void letBirdFly(Bird bird) {
    bird.fly();
}

// ✅ 符合LSP：可以透明替换
Bird bird1 = new Bird();
Bird bird2 = new Sparrow();  // 替换为子类
letBirdFly(bird1);  // 正常工作
letBirdFly(bird2);  // 正常工作
```

**违反LSP的例子**：
```java
// 企鹅是鸟，但不会飞
class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException("企鹅不会飞");
    }
}

// ❌ 违反LSP：替换后程序行为改变（抛异常）
Bird bird = new Penguin();
letBirdFly(bird);  // 运行时异常！
```

### ⚠️ 考点

- 能够背诵两种定义方式
- 理解"透明替换"的含义
- 能够识别违反LSP的设计

---

## 第24页 - 分析

### 📋 里氏代换原则分析

**通俗表述**：
- 在软件中如果能够使用基类对象，那么一定能够使用其子类对象
- 把基类都替换成它的子类，程序将不会产生任何错误和异常
- 反过来则不成立：如果一个软件实体使用的是一个子类的话，那么它不一定能够使用基类

```
基类 → 子类：可以 ✅
子类 → 基类：不一定 ❌
```

**LSP与OCP的关系**：
- LSP是实现**开闭原则**的重要方式之一
- 由于使用基类对象的地方都可以使用子类对象
- 因此在程序中**尽量使用基类类型来对对象进行定义**
- 而在**运行时再确定其子类类型**，用子类对象来替换父类对象

### 💡 理解要点

**为什么LSP重要？**

1. **支持多态**
   ```java
   Shape shape = getShape();  // 运行时确定具体类型
   shape.draw();  // 多态调用
   ```

2. **实现OCP**
   ```java
   void processShape(Shape shape) {
       shape.draw();  // 可以处理任何Shape子类
   }
   // 添加新的Shape子类不需要修改这个方法
   ```

3. **提高可扩展性**
   ```java
   List<Shape> shapes = new ArrayList<>();
   shapes.add(new Circle());
   shapes.add(new Rectangle());
   // 可以统一处理不同子类
   ```

### ⚠️ 违反LSP的后果

1. **破坏多态**：无法用基类引用统一处理
2. **违反OCP**：添加新子类可能导致原有代码失败
3. **降低可复用性**：基于基类的通用代码无法复用

---

## 第25页 - 历史背景

### 📋 Barbara Liskov简介

里氏代换原则由**2008年图灵奖得主**、美国第一位计算机科学女博士、麻省理工学院教授**Barbara Liskov**和卡内基·梅隆大学**Jeannette Wing**教授于**1994年**提出。

**原文定义**：
> Let q(x) be a property provable about objects x of type T. Then q(y) should be true for objects y of type S where S is a subtype of T.

**Barbara Liskov的成就**：
- **2008年图灵奖**得主
- **2004年约翰·冯诺依曼奖**得主
- 美国工程院院士
- 美国艺术与科学院院士
- 美国计算机协会会士
- 美国**第一个计算机科学女博士**

### 💡 理解原文定义

```
如果q(x)是关于类型T的对象x的可证明性质
那么q(y)应该对类型S的对象y也成立
其中S是T的子类型
```

**通俗解释**：
- 父类对象的所有性质
- 子类对象都应该满足

---

## 第26页 - 实例说明

### 📋 问题场景

某系统需要实现对重要数据（如用户密码）的加密处理。

在数据操作类（DataOperator）中需要调用加密类中定义的加密算法。

系统提供了两个不同的加密类，**CipherA**和**CipherB**，它们实现不同的加密方法。

在DataOperator中可以选择其中的一个实现加密操作。

---

## 第27页 - UML图（违反LSP/DIP）

### 🖼️ 加密系统原始设计

根据UML图像分析，第27页展示了违反LSP和DIP的设计：

```
┌──────────────────────────┐
│      config.xml          │
│  <className>CipherB      │
│   </className>           │
└──────────────────────────┘
         │
         ↓ (运行时读取)

┌──────────────────────────┐
│     DataOperator         │
├──────────────────────────┤
│ - cipherA: CipherA  ❌   │ ← 具体类型（红框标注）
├──────────────────────────┤
│ + setCipherA(          │
│     CipherA): void  ❌   │ ← 参数是具体类（红框标注）
│ + encrypt(String)        │
│     : String             │
└──────────────────────────┘
         │
         └──→ CipherA
              └─ encrypt(String): String

         CipherB（独立存在，无法使用）
         └─ encrypt(String): String
```

### 📊 问题分析

**违反LSP的表现**：

1. **成员变量类型是具体类**
   ```java
   private CipherA cipherA;  // ❌ 不能替换为CipherB
   ```

2. **setter参数类型是具体类**
   ```java
   public void setCipherA(CipherA cipher) {  // ❌ 只能传入CipherA
       this.cipherA = cipher;
   }
   ```

3. **配置文件形同虚设**
   ```xml
   <!-- 配置了CipherB，但DataOperator无法使用 -->
   <className>CipherB</className>
   ```

**问题根源**：
- DataOperator依赖具体类CipherA
- 即使有CipherB类，也无法替换CipherA
- 违反了LSP（子类不能透明替换父类，因为根本没有父类）
- 同时违反了DIP（依赖具体而非抽象）

### 🔴 代码坏味道

```java
// ❌ 违反LSP和DIP的设计
public class DataOperator {
    private CipherA cipherA;  // 具体类型

    public void setCipherA(CipherA cipher) {  // 参数是具体类
        this.cipherA = cipher;
    }

    public String encrypt(String plainText) {
        return cipherA.encrypt(plainText);
    }
}

public class CipherA {
    public String encrypt(String plainText) {
        // A算法加密
        return "A:" + plainText;
    }
}

public class CipherB {
    public String encrypt(String plainText) {
        // B算法加密
        return "B:" + plainText;
    }
}

// 客户端代码
DataOperator operator = new DataOperator();
operator.setCipherA(new CipherA());  // 只能用CipherA

// ❌ 无法使用CipherB
// operator.setCipherA(new CipherB());  // 编译错误！
```

### 💡 重构方向

**需要引入抽象**（LSP的前提）：

```java
// ✅ 引入抽象父类/接口
abstract class AbstractCipher {
    abstract String encrypt(String plainText);
}

class CipherA extends AbstractCipher {
    String encrypt(String plainText) {
        return "A:" + plainText;
    }
}

class CipherB extends AbstractCipher {
    String encrypt(String plainText) {
        return "B:" + plainText;
    }
}

// ✅ DataOperator依赖抽象
class DataOperator {
    private AbstractCipher cipher;  // 抽象类型

    public void setCipher(AbstractCipher cipher) {  // 参数是抽象类
        this.cipher = cipher;
    }

    public String encrypt(String plainText) {
        return cipher.encrypt(plainText);
    }
}

// ✅ 现在可以透明替换
DataOperator operator = new DataOperator();
operator.setCipher(new CipherA());  // 可以
operator.setCipher(new CipherB());  // 也可以 ✅
```

---

## 🎯 本章总结

### 核心要点

1. **LSP定义**
   - 子类对象可以透明地替换父类对象
   - 程序行为不变

2. **LSP的前提**
   - 必须有**继承关系**（或实现接口）
   - 子类必须**完全兼容**父类的行为

3. **LSP与其他原则的关系**
   - **LSP是实现OCP的重要方式**
   - **LSP需要DIP支持**（依赖抽象）

4. **违反LSP的常见情况**
   - 子类抛出父类没有的异常
   - 子类加强了前置条件
   - 子类弱化了后置条件

### 记忆技巧

**LSP口诀**：
> **"子类替父类，行为不能变"**

**判断方法**：
```
问自己："把父类引用指向子类对象，程序还正常吗？"
- 正常 → 符合LSP ✅
- 异常/错误 → 违反LSP ❌
```

### 经典反例

**矩形-正方形问题**（第21页提及）：
```java
class Rectangle {
    protected int width, height;
    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
    int getArea() { return width * height; }
}

class Square extends Rectangle {
    @Override
    void setWidth(int w) {
        width = height = w;  // 保持正方形性质
    }
    @Override
    void setHeight(int h) {
        width = height = h;  // 保持正方形性质
    }
}

// ❌ 违反LSP
void test(Rectangle rect) {
    rect.setWidth(5);
    rect.setHeight(4);
    assert rect.getArea() == 20;  // 期望20
}

test(new Rectangle());  // ✅ 通过：5*4=20
test(new Square());     // ❌ 失败：4*4=16
```

### ⚠️ 考点汇总

1. **定义题**：背诵LSP定义（两种方式）
2. **历史题**：Barbara Liskov及图灵奖
3. **识别题**：判断设计是否违反LSP
4. **论述题**：
   - LSP与OCP的关系
   - 矩形-正方形问题分析
5. **重构题**：将违反LSP的代码重构

### 下一章预告

[05-依赖倒转原则-DIP.md](./05-依赖倒转原则-DIP.md) 将介绍：
- 为什么说DIP是实现OCP的主要手段？
- 如何"依赖抽象，不依赖具体"？
- 数据转换系统案例（第35页UML图）

---

**返回**: [README.md](./README.md) | **导航**: [00-导航.md](./00-导航.md) | **上一章**: [03-开闭原则-OCP.md](./03-开闭原则-OCP.md) | **下一章**: [05-依赖倒转原则-DIP.md](./05-依赖倒转原则-DIP.md)
