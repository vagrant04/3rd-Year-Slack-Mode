# 里氏代换原则 (LSP)

**页码范围**: 第21-27页
**核心概念**: 子类必须能够替换其基类
**英文**: Liskov Substitution Principle
**重要性**: ★★★★☆

---

## 📄 第21页 - 里氏代换原则定义

### 页面内容
**里氏代换原则 (Liskov Substitution Principle, LSP)** 有两种定义方式：

#### 定义一 (严格的数学定义)
- **中文**: 如果对每一个类型为S的对象o1，都有类型为T的对象o2，使得以T定义的所有程序P在所有的对象o2都代换成o1时，程序P的行为没有变化，那么类型S是类型T的子类型。

- **英文**: If for each object o1 of type S there is an object o2 of type T such that for all programs P defined in terms of T, the behavior of P is unchanged when o1 is substituted for o2 then S is a subtype of T.

#### 定义二 (更易理解)
- **中文**: 所有引用基类（父类）的地方必须能透明地使用其子类的对象。

- **英文**: Functions that use pointers or references to base classes must be able to use objects of derived classes without knowing it.

### 重点解析

#### 定义解读
**定义一** (过于学术):
```
程序P使用类型T → 用S替换T → 程序P行为不变 → S是T的子类型
```

**定义二** (实用):
```
代码中用了父类 → 换成子类 → 程序应该正常工作
```

#### 核心思想
**"is-a"关系的正确实现**:
- 不仅是语法上的继承关系 (`class S extends T`)
- 更是**语义上的可替换性** (行为兼容)

### 示例说明

#### ✅ 符合LSP的例子
```java
class Rectangle {
    protected int width, height;

    public void setWidth(int w) { width = w; }
    public void setHeight(int h) { height = h; }
    public int getArea() { return width * height; }
}

class Square extends Rectangle {
    // Square是特殊的Rectangle，符合LSP
    public void setWidth(int w) {
        width = w;
        height = w;  // 正方形保持宽高相等
    }

    public void setHeight(int h) {
        width = h;
        height = h;
    }
}

// 客户端代码
void testArea(Rectangle r) {
    r.setWidth(5);
    r.setHeight(4);
    assert r.getArea() == 20;  // 期望是20
}
```

⚠️ **问题**: 如果传入Square对象，getArea()返回16而非20，**违反了LSP**！

💡 **经典反例**: 正方形-矩形问题是LSP的著名争议案例。

### 关键理解
**语法继承 ≠ 语义替换**:
- Java允许Square extends Rectangle (语法合法)
- 但Square可能无法替换Rectangle (语义不兼容)
- **LSP要求行为兼容，不仅是结构兼容**

### 考点提示
⚠️ **重要**:
- LSP的两种定义 (重点是第二种)
- 理解"透明地使用"的含义
- 正方形-矩形问题 (可能会考)

---

## 📄 第22页 - 里氏代换原则分析

### 页面内容
**通俗表述**:
- 在软件中如果能够使用基类对象，那么一定能够使用其子类对象
- 把基类都替换成它的子类，程序将不会产生任何错误和异常
- **反过来则不成立**: 如果一个软件实体使用的是一个子类的话，那么它不一定能够使用基类

**LSP与OCP的关系**:
- 里氏代换原则是实现**开闭原则的重要方式之一**
- 由于使用基类对象的地方都可以使用子类对象
- 因此在程序中**尽量使用基类类型来对对象进行定义**
- 而在**运行时再确定其子类类型**，用子类对象来替换父类对象

### 重点解析

#### 替换方向性
```
基类 → 子类  ✅ 可以替换 (LSP)
子类 → 基类  ❌ 不一定能替换
```

**例子**:
```java
Animal animal = new Dog();  // ✅ 可以
Dog dog = new Animal();     // ❌ 不可以 (编译错误)

// 语义上:
void feed(Animal animal) {
    animal.eat();
}

feed(new Dog());   // ✅ Dog is-a Animal，可以
feed(new Cat());   // ✅ Cat is-a Animal，可以
```

#### LSP实现OCP的机制
```
1. 定义抽象基类/接口    (抽象层)
         ↓
2. 编写依赖基类的代码   (客户端对修改关闭)
         ↓
3. 创建新的子类实现    (扩展)
         ↓
4. 运行时注入子类对象   (多态替换)
         ↓
5. 程序行为改变         (扩展成功)
         ↓
6. 客户端代码不变       (对修改关闭)
```

**关键**: 第4步的替换必须**透明** → 这就是LSP的要求！

#### 设计指导原则
💡 **"面向基类编程"**:
- 变量声明类型使用基类: `Animal animal`
- 方法参数类型使用基类: `void process(Animal animal)`
- 返回值类型使用基类: `public Animal getAnimal()`

✅ **好处**:
- 灵活性: 可以在运行时替换具体类型
- 扩展性: 新增子类不影响已有代码
- 可测试性: 可以用Mock对象替换真实对象

### 里程碑意义
这一页揭示了**OCP的实现秘诀**:
```
LSP + 多态 = OCP的实现基础
```

### 考点提示
⚠️ **核心理解**:
- LSP是如何支持OCP的
- "尽量使用基类类型定义对象"的含义
- 运行时确定子类类型 (多态)

### 易混淆点
💡 **LSP不是说"一定要用基类"**:
- 如果你的代码明确只需要特定子类 → 可以直接使用子类类型
- LSP强调的是: 当你**本来就用的是基类**时，替换成子类应该没问题

---

## 📄 第23页 - 里氏代换原则的历史和提出者

### 页面内容
**提出者**: Barbara Liskov

**原文** (1994):
> Let q(x) be a property provable about objects x of type T. Then q(y) should be true for objects y of type S where S is a subtype of T.

**Barbara Liskov的成就**:
- 2008年**图灵奖得主** 🏆
- 2004年**约翰·冯诺依曼奖得主**
- 美国工程院院士
- 美国艺术与科学院院士
- 美国计算机协会会士
- **美国第一个计算机科学女博士** 👩‍🎓

### 重点解析

#### 原文解读
```
如果类型T的对象x具有属性q(x)
那么类型S的对象y也应该具有属性q(y)
其中S是T的子类型
```

**翻译成人话**:
父类满足的性质，子类也应该满足。

#### 例子
```java
// 性质q: "矩形的面积 = 宽 × 高"
Rectangle r;
q(r) = r.getArea() == r.getWidth() * r.getHeight();  // true

// 如果Square是Rectangle的子类
Square s;
q(s) = s.getArea() == s.getWidth() * s.getHeight();  // 应该也是true

// 但是如果Square的setWidth()同时改变height
// 可能会违反客户端的预期 (见第21页的例子)
```

#### Barbara Liskov的贡献
💡 **开创性意义**:
- 在1994年就系统性地阐述了**子类型的语义约束**
- 影响了后续所有OO语言的类型系统设计
- 证明了**女性在计算机科学领域的杰出贡献**

### 学术价值
LSP不仅是工程经验，还有**数学理论基础**:
- 基于类型理论 (Type Theory)
- 可以形式化证明
- 是程序语言设计的理论依据

### 考点提示
⚠️ **可能考点**:
- Barbara Liskov的主要成就
- LSP提出的年代 (1994)
- 理解原文的含义 (不要求背诵原文)

---

## 📄 第24页 - 里氏代换原则实例说明

### 页面内容
**实例背景**:
某系统需要实现对重要数据（如用户密码）的加密处理。在数据操作类 (DataOperator) 中需要调用加密类中定义的加密算法。

**系统提供**:
- 两个不同的加密类: **CipherA** 和 **CipherB**
- 它们实现不同的加密方法
- 在DataOperator中可以选择其中的一个实现加密操作

**原始设计** (假设违反LSP):
```
DataOperator → CipherA
            → CipherB
```

### 问题分析

#### 可能的错误设计 (违反LSP)
```java
class DataOperator {
    public void encrypt(Object data, String type) {
        if (type.equals("A")) {
            CipherA cipher = new CipherA();
            cipher.encrypt(data);
        } else if (type.equals("B")) {
            CipherB cipher = new CipherB();
            cipher.encrypt(data);
        }
    }
}
```

❌ **问题**:
1. DataOperator直接依赖具体的加密类
2. 新增加密算法要修改DataOperator
3. 违反OCP (对修改不关闭)

### 设计思路
💡 **应用LSP**:
1. 定义加密接口 (抽象基类)
2. CipherA和CipherB实现该接口
3. DataOperator只依赖接口
4. 任何实现了接口的加密类都可以替换使用

### 考点提示
⚠️ **理解**:
- 加密系统是LSP的典型应用场景
- 策略模式的前身

---

## 📄 第25-27页 - 里氏代换原则实例解析

### 重构方案 (符合LSP)

#### 重构后的类图
```
         ┌──────────────┐
         │  <<interface>>
         │  ICipher     │
         │ + encrypt()  │
         └──────┬───────┘
                △
                │ implements
      ┌─────────┼─────────┐
      │                   │
┌─────┴─────┐      ┌──────┴────┐
│ CipherA   │      │  CipherB  │
│+ encrypt()│      │+ encrypt()│
└───────────┘      └───────────┘

         ┌──────────────┐
         │DataOperator  │
         │- cipher      │
         │+ encrypt()   │
         └──────┬───────┘
                │ uses
                ↓
         ┌──────────────┐
         │   ICipher    │  (依赖抽象)
         └──────────────┘
```

#### 重构后的代码
```java
// 1. 定义加密接口
interface ICipher {
    byte[] encrypt(byte[] data);
    byte[] decrypt(byte[] data);
}

// 2. 具体实现A (如AES)
class CipherA implements ICipher {
    public byte[] encrypt(byte[] data) {
        // AES加密算法实现
        return aesEncrypt(data);
    }

    public byte[] decrypt(byte[] data) {
        // AES解密算法实现
        return aesDecrypt(data);
    }
}

// 3. 具体实现B (如DES)
class CipherB implements ICipher {
    public byte[] encrypt(byte[] data) {
        // DES加密算法实现
        return desEncrypt(data);
    }

    public byte[] decrypt(byte[] data) {
        // DES解密算法实现
        return desDecrypt(data);
    }
}

// 4. 数据操作类 (依赖抽象)
class DataOperator {
    private ICipher cipher;  // 依赖抽象接口

    // 通过构造函数或setter注入具体实现
    public DataOperator(ICipher cipher) {
        this.cipher = cipher;
    }

    // 加密数据
    public byte[] encryptData(byte[] data) {
        return cipher.encrypt(data);  // 多态调用
    }

    // 解密数据
    public byte[] decryptData(byte[] data) {
        return cipher.decrypt(data);  // 多态调用
    }
}

// 5. 使用示例
// 使用CipherA
DataOperator op1 = new DataOperator(new CipherA());
byte[] encrypted = op1.encryptData(myData);

// 替换为CipherB - DataOperator无需修改！
DataOperator op2 = new DataOperator(new CipherB());
byte[] encrypted2 = op2.encryptData(myData);
```

### LSP的体现

#### 可替换性验证
✅ **验证LSP是否满足**:
```java
// 原来用CipherA
ICipher cipher = new CipherA();
DataOperator op = new DataOperator(cipher);
op.encryptData(data);  // 正常工作

// 替换为CipherB
cipher = new CipherB();
op = new DataOperator(cipher);
op.encryptData(data);  // 依然正常工作

// 替换为新的CipherC
cipher = new CipherC();  // 新增的加密算法
op = new DataOperator(cipher);
op.encryptData(data);  // 依然正常工作 ✅
```

**结论**: CipherA、CipherB、CipherC可以互相替换，符合LSP。

### 重构效果

| 对比维度 | 重构前 | 重构后 (符合LSP) |
|---------|-------|-----------------|
| DataOperator依赖 | 依赖具体类CipherA/B | 依赖抽象接口ICipher ✅ |
| 新增算法 | 修改DataOperator的if-else | 添加新类实现ICipher ✅ |
| 可替换性 | 不支持透明替换 | 任何ICipher实现都可替换 ✅ |
| 符合OCP | ❌ 对修改开放 | ✅ 对扩展开放，对修改关闭 |
| 测试 | 难以Mock加密类 | 可以注入Mock实现测试 ✅ |

### LSP的设计规则

#### 子类必须遵守的约束
✅ **子类可以做的**:
1. 实现父类的抽象方法
2. 添加自己特有的方法
3. 覆盖父类的非抽象方法 (但要保证行为兼容)

❌ **子类不能做的**:
1. 违反父类的契约 (前置条件、后置条件)
2. 抛出父类方法未声明的异常
3. 改变父类方法的语义

#### 契约式设计 (Design by Contract)
```java
interface ICipher {
    /**
     * 加密数据
     * @param data 原始数据 (前置条件: data != null)
     * @return 加密后的数据 (后置条件: result != null && result.length > 0)
     */
    byte[] encrypt(byte[] data);
}

// 子类必须遵守这些契约
class CipherA implements ICipher {
    public byte[] encrypt(byte[] data) {
        if (data == null) throw new IllegalArgumentException();  // 维护前置条件
        byte[] result = aesEncrypt(data);
        assert result != null && result.length > 0;  // 维护后置条件
        return result;
    }
}
```

### 违反LSP的典型错误

#### 错误1: 子类抛出新异常
```java
interface DataProcessor {
    void process(Data data);  // 未声明抛出异常
}

class FileProcessor implements DataProcessor {
    public void process(Data data) throws IOException {  // ❌ 违反LSP
        // 文件操作可能抛出IOException
    }
}

// 客户端代码:
void handle(DataProcessor processor) {
    processor.process(data);  // 没有catch IOException，运行时崩溃！
}
```

#### 错误2: 子类改变方法语义
```java
interface Stack {
    void push(Object item);  // 应该添加到栈顶
    Object pop();            // 应该从栈顶移除
}

class BrokenStack implements Stack {
    public void push(Object item) {
        // ❌ 错误: 添加到栈底而非栈顶
        list.addFirst(item);
    }
}

// 违反LSP: 虽然语法正确，但语义错误
```

### 实践指南
✅ **确保LSP的方法**:
1. 使用接口或抽象类定义契约
2. 子类严格遵守父类的契约
3. 单元测试验证可替换性
4. Code Review检查子类实现

### 考点提示
⚠️ **重要考点**:
- LSP与OCP的关系
- "尽量使用基类类型定义对象"
- 加密类重构案例

### LSP与其他原则
- **DIP (依赖倒转)**: 要依赖抽象 → LSP确保子类可替换
- **OCP (开闭原则)**: LSP是实现OCP的基础
- **ISP (接口隔离)**: 接口要小 → 子类更容易遵守LSP

---

## 🎯 里氏代换原则 (第21-27页) 知识点总结

### 核心要点
1. ✅ **定义**: 基类能出现的地方，子类一定能出现
2. ✅ **方向性**: 子类可以替换父类，反之不行
3. ✅ **与OCP关系**: LSP是实现OCP的重要方式
4. ✅ **设计指导**: 尽量使用基类类型定义对象
5. ✅ **经典案例**: 加密类重构
6. ✅ **提出者**: Barbara Liskov (图灵奖得主)

### 必背内容
- [ ] LSP的定义 (第二种定义)
- [ ] LSP与OCP的关系
- [ ] "透明地使用"的含义

### 设计检验清单
判断继承是否符合LSP:
1. ✅ 子类是否遵守了父类的契约？
2. ✅ 子类是否改变了父类方法的语义？
3. ✅ 子类是否抛出了父类未声明的异常？
4. ✅ 用子类替换父类，客户端代码是否正常工作？

### 常见错误
❌ **语法继承 ≠ 语义替换**:
- 不要因为"在现实世界中A是B"就让A继承B
- 要看"在程序中A能否替换B"

❌ **正方形继承矩形** (经典反例):
- 现实: 正方形 is-a 矩形 ✅
- 程序: Square不能完全替换Rectangle ❌
- 原因: 正方形的setWidth会改变height，违反了矩形的行为预期

### LSP的金句
> "所有引用基类的地方必须能透明地使用其子类的对象"

💡 **"透明"的含义**: 客户端不知道也不需要知道使用的是哪个子类。

### 下一步
学习**依赖倒转原则 (DIP)** - 面向对象设计的主要手段！

---

**提示**: LSP看似是关于"继承"的原则，实际上是关于"抽象"的原则！
