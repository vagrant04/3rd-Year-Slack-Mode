# Day 06: 设计模式（四）—— 剩余重要模式 + 防御性编程

> 学习时间：30分钟 | 重要程度：★★★★★（防御性编程2021必考，Singleton/Template Method高频考点）
> 参考资料：复习资料/笔记/设计模式-整体.pdf, 旧课件/pmx/09, Exam0-往年考试.pdf

---

## 一、模板方法模式 Template Method（行为型）

### 1. 意图
定义一个操作中的**算法骨架**，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。

### 2. 核心概念：好莱坞原则

> "Don't call us, we'll call you."（别找我们，我们会找你）

- **控制反转**：子类不主动调用父类方法，而是由父类的模板方法在适当时机调用子类的重写方法
- 父类掌控算法的整体流程，子类只负责具体步骤的实现

### 3. 完整UML结构

```
┌─────────────────────────────────────┐
│    AbstractClass                    │
│                                     │
│  +templateMethod() {   ← final！   │
│     step1();          // 具体方法   │
│     step2();          // 抽象方法   │
│     if (hook()) {     // 钩子判断   │
│       step3();        // 抽象方法   │
│     }                               │
│     step4();          // 具体方法   │
│  }                                  │
│                                     │
│  -step1() { ... }      具体方法     │
│  #step2()              抽象方法     │
│  #step3()              抽象方法     │
│  -step4() { ... }      具体方法     │
│  +hook(): boolean { return true; }  │
│                         钩子方法     │
└─────────────────────────────────────┘
                    △
           ┌────────┴─────────┐
           │                  │
┌──────────┴───────┐  ┌──────┴──────────────┐
│ConcreteClassA    │  │ConcreteClassB       │
│                  │  │                     │
│ #step2() {实现A} │  │ #step2() {实现B}    │
│ #step3() {实现A} │  │ #step3() {实现B}    │
│                  │  │ +hook() {return     │
│                  │  │   false;} //跳过3   │
└──────────────────┘  └─────────────────────┘
```

### 4. 三种方法类型（必背！）

| 方法类型 | 特征 | 说明 |
|---------|------|------|
| **具体方法(Concrete)** | 有实现，子类不覆盖 | 算法中固定不变的步骤 |
| **抽象方法(Abstract)** | 无实现，子类必须覆盖 | 算法中必须定制的步骤 |
| **钩子方法(Hook)** | 有默认实现，子类可选覆盖 | 算法中可选的扩展点，默认为空或返回默认值 |

### 5. 完整代码示例：数据挖掘框架

```java
// ============ AbstractClass: 数据挖掘算法骨架 ============
abstract class DataMiner {
    
    // 模板方法：定义算法骨架（final防止子类修改流程！）
    public final void mine(String path) {
        String rawData = openFile(path);      // 步骤1：打开文件（抽象）
        String data = extractData(rawData);    // 步骤2：提取数据（抽象）
        String parsed = parseData(data);       // 步骤3：解析数据（抽象）
        
        if (shouldAnalyze()) {                 // 钩子：是否需要分析
            analyzeData(parsed);               // 步骤4：分析数据（具体）
        }
        
        sendReport(parsed);                    // 步骤5：发送报告（具体）
        closeFile();                           // 步骤6：关闭文件（具体）
    }
    
    // 抽象方法：子类必须实现
    protected abstract String openFile(String path);
    protected abstract String extractData(String rawData);
    protected abstract String parseData(String data);
    
    // 具体方法：固定实现
    private void analyzeData(String data) {
        System.out.println("Performing standard analysis on data...");
    }
    
    private void sendReport(String data) {
        System.out.println("Sending report via email...");
    }
    
    private void closeFile() {
        System.out.println("Closing file resources.");
    }
    
    // 钩子方法：子类可选覆盖
    protected boolean shouldAnalyze() {
        return true; // 默认执行分析
    }
}

// ============ ConcreteClass A: CSV数据挖掘 ============
class CSVDataMiner extends DataMiner {
    @Override
    protected String openFile(String path) {
        System.out.println("Opening CSV file: " + path);
        return "csv_raw_data";
    }
    
    @Override
    protected String extractData(String rawData) {
        System.out.println("Extracting CSV columns...");
        return "csv_extracted";
    }
    
    @Override
    protected String parseData(String data) {
        System.out.println("Parsing CSV rows with comma delimiter...");
        return "csv_parsed";
    }
}

// ============ ConcreteClass B: PDF数据挖掘 ============
class PDFDataMiner extends DataMiner {
    @Override
    protected String openFile(String path) {
        System.out.println("Opening PDF file: " + path);
        return "pdf_raw_data";
    }
    
    @Override
    protected String extractData(String rawData) {
        System.out.println("Extracting text from PDF pages...");
        return "pdf_extracted";
    }
    
    @Override
    protected String parseData(String data) {
        System.out.println("Parsing PDF text blocks...");
        return "pdf_parsed";
    }
    
    @Override
    protected boolean shouldAnalyze() {
        return false; // PDF不需要分析，直接发送
    }
}

// ============ 客户端 ============
class Client {
    public static void main(String[] args) {
        DataMiner csvMiner = new CSVDataMiner();
        csvMiner.mine("data.csv");
        // 输出: Opening CSV... → Extracting CSV... → Parsing CSV... 
        //       → Performing standard analysis... → Sending report... → Closing...
        
        DataMiner pdfMiner = new PDFDataMiner();
        pdfMiner.mine("report.pdf");
        // 输出: Opening PDF... → Extracting PDF... → Parsing PDF... 
        //       → Sending report... → Closing...
        // 注意：跳过了analysis（hook返回false）
    }
}
```

### 6. Template Method vs Strategy（必考对比！）

| 比较项 | Template Method | Strategy |
|--------|-----------------|----------|
| **变化粒度** | 算法中的**某几步** | **整个算法** |
| **实现机制** | 继承（子类化） | 组合（持有策略对象） |
| **控制权** | 父类控制流程，子类实现细节（好莱坞原则） | 客户端选择策略 |
| **关系** | IS-A（子类是父类的特化） | HAS-A（Context持有Strategy） |
| **修改粒度** | 细（只改某一步） | 粗（替换整个算法） |
| **多态方向** | 子类覆盖父类方法 | 运行时注入不同策略对象 |
| **类图特征** | 抽象类+具体子类 | 接口+多个策略实现类+Context |
| **典型应用** | JUnit TestCase, Servlet.service() | Collections.sort(Comparator) |

### 7. Template Method体现的原则
- **OCP**：不修改算法骨架（关闭），通过子类扩展具体步骤（开放）
- **DIP**：高层模块（抽象类）不依赖低层模块（子类），两者依赖抽象
- **好莱坞原则**：控制反转，父类决定何时调用子类

---

## 二、单例模式 Singleton（创建型）

### 1. 意图
保证一个类仅有一个实例，并提供一个全局访问点来访问它。

### 2. 适用场景
- 系统中只需要一个实例的对象：线程池、缓存、对话框、注册表、日志对象、设备驱动
- 需要频繁创建和销毁的对象
- 需要全局统一管理的资源

### 3. 实现方式对比（5种，全部掌握）

#### 方式1：饿汉式（Eager Initialization）
```java
class Singleton {
    // 类加载时即创建实例（JVM保证线程安全）
    private static final Singleton INSTANCE = new Singleton();
    
    private Singleton() {} // 私有构造函数，防止外部new
    
    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```
- **优点**：简单，线程安全（JVM类加载机制保证）
- **缺点**：不管是否使用都会创建实例（浪费内存）
- **适用**：实例一定会被使用的场景

#### 方式2：懒汉式-线程不安全（仅了解，不要在考试中使用）
```java
class Singleton {
    private static Singleton instance;
    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {       // 两个线程可能同时进入
            instance = new Singleton(); // 可能创建多个实例！
        }
        return instance;
    }
}
```
- **问题**：多线程环境下不安全，可能创建多个实例

#### 方式3：懒汉式-双重检查锁定（DCL, Double-Checked Locking）
```java
class Singleton {
    // volatile防止指令重排序！
    private static volatile Singleton instance;
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        if (instance == null) {                  // 第一次检查（无锁，快速返回）
            synchronized (Singleton.class) {     // 加锁
                if (instance == null) {          // 第二次检查（防止重复创建）
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```
- **为什么需要volatile**：`new Singleton()` 不是原子操作，分为3步（分配内存→初始化→赋值引用），指令重排可能导致其他线程获取到未初始化的对象
- **为什么两次检查**：外层check避免每次都加锁（性能），内层check避免多线程下重复创建
- **优点**：懒加载+线程安全+高性能
- **适用**：考试最推荐的写法

#### 方式4：静态内部类（Holder Pattern）
```java
class Singleton {
    private Singleton() {}
    
    // 静态内部类：只有在被引用时才会加载
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
    
    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
        // 第一次调用时触发SingletonHolder类加载
    }
}
```
- **原理**：利用JVM类加载的懒加载机制+线程安全保证
- **优点**：懒加载+线程安全+代码简洁
- **适用**：Java中最优雅的实现

#### 方式5：枚举（Enum Singleton）
```java
enum Singleton {
    INSTANCE;
    
    public void doSomething() {
        System.out.println("doing something");
    }
}
// 使用: Singleton.INSTANCE.doSomething();
```
- **优点**：天然线程安全、防止反射攻击、防止反序列化创建新实例
- **缺点**：不够直观，不能延迟加载
- **适用**：最安全的实现（Effective Java推荐）

### 4. Singleton五种方式总结

| 方式 | 懒加载 | 线程安全 | 防反射 | 防序列化 | 推荐度 |
|------|--------|---------|--------|---------|--------|
| 饿汉式 | ✗ | ✓ | ✗ | ✗ | ★★★ |
| 懒汉式(不安全) | ✓ | ✗ | ✗ | ✗ | ★ |
| 双重检查锁 | ✓ | ✓ | ✗ | ✗ | ★★★★ |
| 静态内部类 | ✓ | ✓ | ✗ | ✗ | ★★★★★ |
| 枚举 | ✗ | ✓ | ✓ | ✓ | ★★★★★ |

### 5. Singleton的三个必要条件
1. **私有构造函数**：防止外部通过new创建实例
2. **私有静态实例变量**：持有唯一实例的引用
3. **公有静态访问方法**：全局唯一的获取入口

### 6. Singleton的问题（面试/考试加分）
- 违反SRP：既管理自身创建又包含业务逻辑
- 难以测试：全局状态使得单元测试难以隔离
- 隐藏依赖：使用者不通过构造函数/参数获取，难以追踪依赖关系
- 对策：依赖注入(DI)框架管理实例生命周期，替代手工Singleton

---

## 三、享元模式 Flyweight（结构型）

### 1. 意图
运用**共享技术**有效地支持大量细粒度的对象。通过共享已经存在的对象来减少需要创建的对象数量，从而减少内存使用。

### 2. 核心概念（必背！）

| 概念 | 英文 | 特征 | 存储位置 |
|------|------|------|---------|
| **内部状态** | Intrinsic State | 不随环境变化，可以共享 | 存在享元对象**内部** |
| **外部状态** | Extrinsic State | 随环境变化，不可共享 | 由**客户端**传入 |

**关键理解**：将对象的属性分为"不变的共享部分"和"变化的独有部分"，只共享不变部分。

### 3. 完整UML结构

```
┌──────────────────┐         ┌──────────────────────────┐
│     Client       │────────▶│   FlyweightFactory       │
└──────────────────┘         │                          │
        │                    │  -pool: Map<Key,Flyweight>│
        │                    │                          │
        │ 传入外部状态       │  +getFlyweight(key) {    │
        │                    │    if (!pool.has(key))    │
        │                    │      pool.put(key, new   │
        │                    │        ConcreteFW(key)); │
        │                    │    return pool.get(key);  │
        │                    │  }                        │
        │                    └──────────────────────────┘
        │                              │
        │                              │ 管理
        ▼                              ▼
┌──────────────────────────────────────────┐
│          <<interface>> Flyweight         │
│  +operation(extrinsicState): void       │
└─────────────────────────────────────────┘
                    △
                    │
        ┌───────────┴────────────┐
        │                        │
┌───────┴──────────┐    ┌───────┴───────────────┐
│ ConcreteFlyweight│    │UnsharedConcreteFW     │
│                  │    │ (不共享的特殊对象)     │
│ -intrinsicState  │    │ -allState             │
│ +operation(ext) {│    │ +operation(ext) {...}  │
│   // 使用内部+  │    └───────────────────────┘
│   // 外部状态   │
│ }               │
└─────────────────┘
```

### 4. 完整代码示例：文本编辑器的字符渲染

```java
// ============ Flyweight接口 ============
interface CharacterGlyph {
    // extrinsicState = 位置和大小（由客户端传入）
    void display(int row, int col, int fontSize);
}

// ============ ConcreteFlyweight：共享的字符 ============
class ConcreteCharacter implements CharacterGlyph {
    // intrinsicState（内部状态）：字符的字形数据，可以共享
    private char character;        // 字符本身
    private String fontFamily;     // 字体族
    private byte[] glyphData;      // 字形位图数据（很大！）
    
    public ConcreteCharacter(char c, String fontFamily) {
        this.character = c;
        this.fontFamily = fontFamily;
        this.glyphData = loadGlyph(c, fontFamily); // 模拟加载字形
        System.out.println("Creating glyph for '" + c + "' in " + fontFamily);
    }
    
    private byte[] loadGlyph(char c, String font) {
        return new byte[1024]; // 模拟1KB字形数据
    }
    
    @Override
    public void display(int row, int col, int fontSize) {
        // 内部状态(character, glyphData) + 外部状态(row, col, fontSize) 共同渲染
        System.out.println("Display '" + character + "' at (" 
                         + row + "," + col + ") size=" + fontSize);
    }
}

// ============ FlyweightFactory：享元工厂 ============
class CharacterFactory {
    private Map<String, CharacterGlyph> pool = new HashMap<>();
    
    public CharacterGlyph getCharacter(char c, String fontFamily) {
        String key = c + "_" + fontFamily;
        
        if (!pool.containsKey(key)) {
            pool.put(key, new ConcreteCharacter(c, fontFamily));
        }
        
        return pool.get(key); // 返回共享的享元对象
    }
    
    public int getPoolSize() {
        return pool.size();
    }
}

// ============ 客户端 ============
class TextEditor {
    public static void main(String[] args) {
        CharacterFactory factory = new CharacterFactory();
        
        // 文档内容: "hello world" — 11个字符
        String text = "hello world";
        
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == ' ') continue;
            
            // 获取共享的字符对象
            CharacterGlyph glyph = factory.getCharacter(c, "Arial");
            // 传入外部状态（位置、大小）
            glyph.display(0, i, 12);
        }
        
        // 'l'出现3次，'o'出现2次，但只各创建了一次！
        System.out.println("Pool size: " + factory.getPoolSize());
        // 输出: Pool size: 7 (h,e,l,o,w,r,d) 而非10个对象
        
        // 如果文档有100万个字符，但只有几十种字形
        // 享元从100万个对象 → 几十个共享对象 + 位置信息
    }
}
```

### 5. Flyweight vs Singleton vs Prototype vs 对象池

| 模式 | 目的 | 对象数量 | 状态处理 |
|------|------|---------|---------|
| **Flyweight** | 共享对象减少内存 | 少（共享） | 分离内/外部状态 |
| **Singleton** | 全局唯一实例 | 1个 | 单一状态 |
| **Prototype** | 克隆创建对象 | 多（复制） | 复制整个状态 |
| **对象池** | 复用对象减少创建开销 | 有限（借出/归还） | 重置状态后复用 |

### 6. 实际应用
- **Java String Pool**：`String s = "hello"` 字符串常量池就是Flyweight
- **Integer缓存**：`Integer.valueOf(127)` Java缓存-128到127的Integer对象
- **游戏开发**：大量相同类型的子弹/树木/粒子共享模型数据
- **文本编辑器**：相同字符共享字形数据，只存储不同的位置

---

## 四、迭代器模式 Iterator（行为型）

### 1. 意图
提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。

### 2. 动机
不同的集合（数组、链表、树、图）有不同的内部结构，但客户端希望用统一的方式遍历它们。Iterator将遍历逻辑从集合中分离出来。

### 3. 完整UML结构

```
┌────────────────────────┐      ┌──────────────────────────┐
│  <<interface>>          │      │   <<interface>>           │
│    Aggregate           │      │     Iterator              │
│ +createIterator():     │      │  +hasNext(): boolean      │
│    Iterator            │      │  +next(): T               │
└────────────────────────┘      │  +remove(): void          │
          △                     └──────────────────────────┘
          │                                △
          │                                │
┌─────────┴──────────────┐      ┌──────────┴───────────────┐
│  ConcreteAggregate     │─────▶│  ConcreteIterator        │
│  -elements: T[]        │创建   │  -aggregate: ConcrAggr   │
│  +createIterator() {   │      │  -currentIndex: int      │
│    return new ConcrItr │      │  +hasNext() { ... }      │
│    (this);             │      │  +next() { ... }         │
│  }                     │      └──────────────────────────┘
│  +get(int): T          │
│  +size(): int          │
└────────────────────────┘
```

### 4. 完整代码示例：自定义集合+迭代器

```java
// ============ Iterator接口 ============
interface Iterator<T> {
    boolean hasNext();
    T next();
}

// ============ Aggregate接口 ============
interface IterableCollection<T> {
    Iterator<T> createIterator();
}

// ============ ConcreteAggregate: 自定义书架 ============
class BookShelf implements IterableCollection<String> {
    private String[] books;
    private int count = 0;
    
    public BookShelf(int maxSize) {
        this.books = new String[maxSize];
    }
    
    public void addBook(String book) {
        books[count++] = book;
    }
    
    public String getBookAt(int index) {
        return books[index];
    }
    
    public int getLength() {
        return count;
    }
    
    @Override
    public Iterator<String> createIterator() {
        return new BookShelfIterator(this);
    }
}

// ============ ConcreteIterator: 书架迭代器 ============
class BookShelfIterator implements Iterator<String> {
    private BookShelf bookShelf;
    private int currentIndex;
    
    public BookShelfIterator(BookShelf bookShelf) {
        this.bookShelf = bookShelf;
        this.currentIndex = 0;
    }
    
    @Override
    public boolean hasNext() {
        return currentIndex < bookShelf.getLength();
    }
    
    @Override
    public String next() {
        String book = bookShelf.getBookAt(currentIndex);
        currentIndex++;
        return book;
    }
}

// ============ 客户端：统一遍历方式 ============
class Client {
    public static void main(String[] args) {
        BookShelf shelf = new BookShelf(10);
        shelf.addBook("Design Patterns");
        shelf.addBook("Clean Code");
        shelf.addBook("Refactoring");
        
        // 使用Iterator遍历——不需要知道内部是数组还是链表
        Iterator<String> it = shelf.createIterator();
        while (it.hasNext()) {
            System.out.println(it.next());
        }
    }
}
```

### 5. Java中的Iterator（标准库）

```java
// Java Collection Framework 使用了Iterator模式
List<String> list = Arrays.asList("A", "B", "C");

// 方式1：显式使用Iterator
java.util.Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
}

// 方式2：for-each（语法糖，底层也是Iterator）
for (String s : list) {
    System.out.println(s);
}

// Java的接口层次：
// Iterable<T>  → 集合实现此接口，提供iterator()方法
//   └─ iterator() → 返回Iterator<T>
// Iterator<T>  → hasNext(), next(), remove()
```

### 6. Iterator的价值

| 价值 | 说明 |
|------|------|
| **封装内部结构** | 客户端不需要知道集合内部是数组、链表、树还是哈希表 |
| **统一遍历接口** | 不同集合用相同方式遍历 |
| **支持多种遍历** | 同一集合可以有正序、逆序、过滤等多种迭代器 |
| **职责分离** | 遍历逻辑从集合中分离出来（SRP） |

---

## 五、防御性编程 Defensive Programming（★★★★★ 2021真题重点！）

### 1. 概述

防御性编程是一种编程实践，核心思想是：**程序应该能够处理它不期望的输入和状态，而不是崩溃**。

三大核心技术：
1. **断言（Assertions）**
2. **错误处理（Error Handling）**
3. **路障/防火墙（Barricades）**

---

### 2. 断言 Assertions（详细）

#### 定义
断言是开发和测试阶段用于检查**"不可能发生"的条件**的机制。如果断言条件为false，说明程序有bug。

#### 使用场景（什么时候用断言）

| 应该用断言的场景 | 不应该用断言的场景 |
|-----------------|------------------|
| 检查前置条件（方法入口参数约束） | 用户输入验证 |
| 检查后置条件（方法返回值约束） | 网络超时处理 |
| 检查类不变量（对象状态一致性） | 文件不存在处理 |
| 检查不可达的代码分支 | 数据库连接失败 |
| 验证算法的中间结果 | 任何预期可能发生的错误 |

#### 完整代码示例

```java
class Account {
    private double balance;
    
    public Account(double initialBalance) {
        // 前置条件断言：初始余额不能为负
        assert initialBalance >= 0 : 
            "Initial balance cannot be negative: " + initialBalance;
        this.balance = initialBalance;
    }
    
    public void withdraw(double amount) {
        // 前置条件断言
        assert amount > 0 : "Withdrawal amount must be positive: " + amount;
        assert amount <= balance : 
            "Insufficient funds. Balance: " + balance + ", Amount: " + amount;
        
        double oldBalance = balance;
        balance -= amount;
        
        // 后置条件断言：余额应该减少了正确的金额
        assert balance == oldBalance - amount : 
            "Balance calculation error!";
        // 类不变量断言：余额不应该为负
        assert balance >= 0 : "Balance went negative after withdrawal!";
    }
    
    public double getBalance() {
        // 类不变量断言
        assert balance >= 0 : "Invariant violated: negative balance!";
        return balance;
    }
}
```

#### 断言的关键规则（必背！）

1. **断言用于检查程序员的错误，不是用户的错误**
2. **断言失败 = 代码有bug**（不是外部条件异常）
3. **生产环境通常禁用断言**（`java -ea` 启用，默认禁用）
4. **断言不应该有副作用**：`assert list.remove(item)` ← 错误！禁用后行为改变
5. **先断言后执行**：断言是检查条件的，不是执行操作的

---

### 3. 错误处理 Error Handling（详细）

#### 错误处理策略列表（全部掌握）

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| **返回中性值** | 返回空字符串""、0、空列表等 | 对结果格式有要求但可以容忍空值 |
| **返回上一个正确值** | 使用最后一次成功的缓存值 | 传感器读数、实时数据 |
| **替换为最近的合法值** | 超出范围时用边界值 | 温度超限时用最大/最小值 |
| **记录日志并继续** | 写日志但不中断流程 | 非关键操作失败 |
| **返回错误码** | 返回特定值表示错误 | C语言风格，函数式返回 |
| **抛出异常** | 将错误传递给调用者 | Java/Python等OO语言 |
| **关闭程序** | 安全关闭系统 | 安全关键系统（医疗/航空） |

#### 错误处理 vs 断言（对比表，必背！）

| 对比项 | 断言 (Assertion) | 错误处理 (Error Handling) |
|--------|-----------------|-------------------------|
| **目的** | 检查程序员的错误/内部逻辑bug | 处理预期可能发生的外部异常 |
| **触发含义** | 代码有bug，必须修复 | 外部条件异常，需要恢复 |
| **生产环境** | 通常关闭（-ea/-da） | 必须保留 |
| **处理方式** | 立即终止（开发中） | 恢复/降级/通知 |
| **检查对象** | 内部状态、前/后置条件、不变量 | 用户输入、网络、文件、资源 |
| **示例** | `assert index >= 0` | `if (file == null) throw new IOException()` |
| **编程阶段** | 开发和调试阶段 | 整个生命周期 |

---

### 4. 路障/防火墙 Barricades（2021真题核心考点！）

#### 定义
路障（Barricade）是在系统的**外部接口**处设置的验证层，将系统明确分为**"安全区"**和**"不安全区"**。所有进入系统的数据都必须通过路障的验证和清洗。

#### 核心架构

```
┌─────────────────────────────────────────────────────────────┐
│                    外部世界（不可信）                          │
│  用户输入 / HTTP请求 / 文件数据 / 第三方API响应 / 传感器     │
└─────────────────────────┬───────────────────────────────────┘
                          │ 所有数据进入
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              ██ BARRICADE（路障/防火墙层）██                  │
│                                                             │
│  ✓ 验证所有输入参数的类型、范围、格式                         │
│  ✓ 清洗（Sanitize）恶意内容（SQL注入、XSS）                  │
│  ✓ 转换数据格式为内部表示                                    │
│  ✓ 对非法数据使用【错误处理】策略                            │
│                                                             │
│  实现：Controller层 / Validator类 / Filter / Middleware       │
└─────────────────────────┬───────────────────────────────────┘
                          │ 已验证的可信数据
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              内部系统（可信区域）                              │
│                                                             │
│  ✓ 假设所有收到的数据已经过验证                              │
│  ✓ 使用【断言】检查不变量（如果断言失败 = 路障有bug）         │
│  ✓ 专注于业务逻辑                                           │
│                                                             │
│  实现：Service层 / Domain层 / Repository层                   │
└─────────────────────────────────────────────────────────────┘
```

#### 关键原则（必背3点！）

1. **路障外使用错误处理**：外部数据不可信，任何异常都是"预期可能发生的"
2. **路障内使用断言**：数据已验证，如果条件不满足说明是路障本身的bug
3. **路障负责转换**：将"不可信的外部数据"转化为"可信的内部数据"

#### 完整代码示例：Web应用的Barricade

```java
// ============ BARRICADE层：Controller（路障）============
class UserController {
    private UserService userService;
    
    // 这是系统边界——所有外部输入在此验证
    public Response createUser(HttpRequest request) {
        // ===== 路障验证开始 =====
        String name = request.getParam("name");
        String email = request.getParam("email");
        String ageStr = request.getParam("age");
        
        // 1. 非空验证
        if (name == null || name.trim().isEmpty()) {
            return Response.error(400, "Name is required");
        }
        
        // 2. 格式验证
        if (!email.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")) {
            return Response.error(400, "Invalid email format");
        }
        
        // 3. 类型和范围验证
        int age;
        try {
            age = Integer.parseInt(ageStr);
        } catch (NumberFormatException e) {
            return Response.error(400, "Age must be a number");
        }
        if (age < 0 || age > 150) {
            return Response.error(400, "Age must be between 0-150");
        }
        
        // 4. 清洗（防止XSS）
        name = sanitize(name);
        
        // ===== 路障验证结束，传入可信数据 =====
        UserDTO dto = new UserDTO(name, email, age);
        userService.createUser(dto);
        return Response.success("User created");
    }
    
    private String sanitize(String input) {
        return input.replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;")
                    .replaceAll("\"", "&quot;");
    }
}

// ============ 内部可信区域：Service层 ============
class UserService {
    private UserRepository repo;
    
    public void createUser(UserDTO dto) {
        // 在路障内部，数据已经验证过了
        // 如果这里的断言失败，说明路障(Controller)有bug
        assert dto != null : "DTO should never be null after barricade";
        assert dto.getName() != null && !dto.getName().isEmpty() : 
            "Name should be validated by barricade";
        assert dto.getAge() >= 0 && dto.getAge() <= 150 : 
            "Age should be validated by barricade";
        
        // 直接执行业务逻辑，不需要重复验证
        User user = new User(dto.getName(), dto.getEmail(), dto.getAge());
        repo.save(user);
    }
}
```

#### Barricade的实际应用映射

| Web应用层次 | 角色 | 使用技术 |
|------------|------|---------|
| **Controller** | Barricade | 错误处理、输入验证、数据清洗 |
| **Service** | 内部可信区 | 断言检查不变量 |
| **Repository** | 内部可信区 | 断言检查数据库约束 |
| **Filter/Middleware** | 预路障 | 认证、CSRF检查、速率限制 |

---

### 5. 三者的关系总结（考试必写！）

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│    外部不可信区域                                         │
│    → 使用【错误处理】应对预期可能的异常                    │
│                                                          │
├────────────────── BARRICADE ─────────────────────────────┤
│                                                          │
│    内部可信区域                                           │
│    → 使用【断言】验证内部逻辑的正确性                     │
│    → 断言失败 = 路障有漏洞/内部代码有bug                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**一句话总结**：路障是分界线，路障外用错误处理（因为外部数据可能出错），路障内用断言（因为数据已验证，如果出错说明程序有bug）。

---

### 6. 2021真题参考答案

**Q：什么是断言？什么是路障？两者的关系是什么？**

**A**：
1. **断言(Assertion)**：在开发阶段用于检查"不应该发生"的条件的机制。断言检查程序内部逻辑的正确性（前置条件、后置条件、类不变量）。断言失败意味着代码有bug。生产环境通常关闭断言。

2. **路障(Barricade)**：在系统外部接口处设置的验证层，将系统分为"可信区"和"不可信区"。路障负责验证所有外部输入，将不可信数据转化为可信数据。

3. **关系**：
   - 路障**外部**使用**错误处理**（因为外部输入可能出错，属于预期异常）
   - 路障**内部**使用**断言**（因为数据已经过路障验证，如果条件不满足说明是程序的bug）
   - 典型实现：Controller层作为路障验证所有输入，Service层内部使用断言确保逻辑正确

---

## 六、创建型模式总对比（考前必看表格）

| 模式 | 创建什么 | 如何创建 | 适用场景 | 关键特征 |
|------|----------|----------|----------|---------|
| **Simple Factory** | 单一产品 | 工厂类switch/if | 简单场景 | 违反OCP |
| **Factory Method** | 单一产品 | 子类决定 | 单产品维度扩展 | 体现OCP |
| **Abstract Factory** | 产品族 | 工厂组合 | 多产品族切换 | 整族替换 |
| **Builder** | 复杂对象 | 分步构造 | 对象有多种表示 | 链式调用 |
| **Prototype** | 相似对象 | 克隆(clone) | 对象初始化开销大 | 深拷贝/浅拷贝 |
| **Singleton** | 唯一实例 | 私有构造+静态 | 全局唯一资源 | 线程安全 |

---

## 七、设计模式与设计原则的对应关系（考试加分）

| 原则 | 体现该原则的模式 |
|------|-----------------|
| **OCP** | Strategy, Factory Method, Observer, Template Method, Decorator |
| **SRP** | Facade, Iterator, Observer(Subject/Observer分离) |
| **LSP** | Template Method(子类安全替换父类), Strategy(策略可互换) |
| **DIP** | Factory Method, Abstract Factory, Observer, Bridge |
| **ISP** | Adapter(只适配需要的接口), Iterator(最小遍历接口) |
| **CRP** | Strategy, Bridge, Decorator, Adapter(对象版) |
| **LoD** | Facade(减少朋友数), Mediator(减少直接依赖) |

---

## 八、今日自测

1. **Template Method中"好莱坞原则"是什么意思？**
   > "Don't call us, we'll call you" —— 父类决定算法骨架和调用时机，子类只负责实现具体步骤。控制反转。

2. **Singleton的双重检查锁定为什么需要volatile？**
   > 防止指令重排序。`new Singleton()` 分3步（分配内存→初始化→赋值引用），重排可能导致其他线程获取未初始化的对象。

3. **Flyweight的内部状态和外部状态？以字符渲染为例。**
   > 内部状态：字符的字形数据、字体（可共享，存在享元内部）。外部状态：字符的位置、大小、颜色（不可共享，由客户端传入）。

4. **什么是Barricade？它与断言的关系？（2021真题）**
   > Barricade是系统边界的验证层，将系统分为可信区和不可信区。路障外用错误处理（外部不可信），路障内用断言（内部应可信，断言失败=bug）。

5. **为什么说断言不能替代错误处理？**
   > 断言在生产环境通常被禁用，且断言用于检查"不应该发生"的程序员错误。错误处理应对"预期可能发生"的运行时异常（用户输入、网络等），生产环境必须保留。

---

## 九、明日预告

Day 07将进入架构部分：质量属性概念、质量属性场景（六要素）、七大质量属性及其策略（Availability, Modifiability, Performance）。
