# Day 05: 设计模式（三）—— 结构型模式重点$\color{red}{（已阅）}$

> 学习时间：30分钟 | 重要程度：★★★★★（Facade vs Proxy是2025真题，Decorator是Java I/O经典考点）
> 参考资料：复习资料/笔记/设计模式-整体.pdf, 旧课件/pmx/07-08, Exam0-往年考试.pdf

---

## 一、适配器模式 Adapter Pattern（结构型）

### 1. 意图
将一个类的接口转换成客户希望的另一个接口。使得原本由于接口不兼容而不能一起工作的类可以一起工作。

**别名**：Wrapper（包装器）

### 2. 动机场景
假设你有一个已存在的日志系统（OldLogger），接口是`logMessage(String msg, int level)`，但新系统期望的日志接口是`log(String message)`。你不能修改OldLogger（第三方库/遗留系统），此时需要Adapter来"翻译"接口。

### 3. 两种实现方式

**类适配器（Class Adapter）——通过多继承/接口实现+继承**：
```
                    ┌──────────────────┐
                    │  <<interface>>    │
   Client ────────▶│     Target       │
                    │  +request()      │
                    └──────────────────┘
                             △
                             │ implements
                    ┌────────┴─────────┐
                    │     Adapter      │─────继承────▶ Adaptee
                    │  +request() {    │              +specificRequest()
                    │   specificReq(); │
                    │  }               │
                    └──────────────────┘
```

**对象适配器（Object Adapter）——通过组合（推荐！）**：
```
                    ┌──────────────────┐
                    │  <<interface>>    │
   Client ────────▶│     Target       │
                    │  +request()      │
                    └──────────────────┘
                             △
                             │ implements
                    ┌────────┴─────────┐         ┌──────────────┐
                    │     Adapter      │────────▶│   Adaptee    │
                    │  -adaptee        │  持有    │+specificReq()│
                    │  +request() {    │         └──────────────┘
                    │   adaptee.       │
                    │   specificReq(); │
                    │  }               │
                    └──────────────────┘
```

### 4. 类适配器 vs 对象适配器

| 比较项 | 类适配器 | 对象适配器 |
|--------|---------|-----------|
| 实现方式 | 继承Adaptee + 实现Target | 持有Adaptee引用 + 实现Target |
| 灵活性 | 只能适配一个具体类 | 可适配Adaptee及其所有子类 |
| 覆盖行为 | 可以覆盖Adaptee方法 | 需要子类化Adaptee才能覆盖 |
| Java支持 | Java不支持多继承，受限 | 完美支持，推荐方式 |
| 对象关系 | IS-A | HAS-A |
| 体现原则 | - | CRP（组合复用原则） |

### 5. 完整代码示例

```java
// ============ 已有的遗留接口（不能修改）============
class LegacyRectangle {
    // 旧接口：用两点坐标画矩形
    public void draw(int x1, int y1, int x2, int y2) {
        System.out.println("Drawing rectangle from (" + x1 + "," + y1 
                         + ") to (" + x2 + "," + y2 + ")");
    }
}

// ============ 新系统期望的目标接口 ============
interface Shape {
    // 新接口：用起点+宽高画形状
    void draw(int x, int y, int width, int height);
}

// ============ 对象适配器 ============
class RectangleAdapter implements Shape {
    private LegacyRectangle legacyRect;
    
    public RectangleAdapter(LegacyRectangle legacyRect) {
        this.legacyRect = legacyRect;
    }
    
    @Override
    public void draw(int x, int y, int width, int height) {
        // 转换：将(x, y, width, height)转为(x1, y1, x2, y2)
        int x2 = x + width;
        int y2 = y + height;
        legacyRect.draw(x, y, x2, y2);
    }
}

// ============ 客户端代码 ============
class Client {
    public static void main(String[] args) {
        // 客户端使用新接口Shape
        Shape shape = new RectangleAdapter(new LegacyRectangle());
        shape.draw(10, 20, 100, 50); 
        // 内部转换后调用: legacyRect.draw(10, 20, 110, 70)
    }
}
```

### 6. 适配器模式体现的原则
- **OCP（开放封闭原则）**：不修改已有代码，通过新增Adapter类扩展功能
- **CRP（组合复用原则）**：对象适配器用组合替代继承
- **SRP（单一职责）**：Adapter只负责接口转换，不包含业务逻辑

### 7. 适用场景
- 使用第三方库但接口不匹配时
- 遗留系统集成到新系统
- 统一多个接口不同但功能相似的类
- Java中的经典应用：`Arrays.asList()` 将数组适配为List接口

### 8. Adapter vs Bridge（易混淆！）

| 比较项 | Adapter | Bridge |
|--------|---------|--------|
| 目的 | 让不兼容的接口协作 | 将抽象与实现分离，独立变化 |
| 使用时机 | 已有系统，事后补救 | 设计阶段，预先规划 |
| 关系 | 修复不兼容 | 预防组合爆炸 |

---

## 二、装饰器模式 Decorator Pattern（结构型）

### 1. 意图
动态地给一个对象添加一些额外的职责。就增加功能来说，Decorator比生成子类更灵活。

**别名**：Wrapper（与Adapter相同别名，但目的不同！）

### 2. 动机场景
假设你有一个文本组件，需要加边框、加滚动条、加阴影...如果用继承：
- TextArea, BorderedTextArea, ScrollableTextArea, BorderedScrollableTextArea... → **类爆炸！**

用Decorator可以动态任意组合：`new Border(new Scrollbar(new TextArea()))`

### 3. 完整UML结构

```
┌──────────────────────────┐
│    <<interface>>          │
│      Component           │◁────────────────────────────────────┐
│  +operation(): String    │                                     │
└──────────────────────────┘                                     │
            △                                                    │
       ┌────┴──────────┐                                         │
       │               │                                         │
┌──────┴────────┐  ┌───┴──────────────────────────┐              │
│ConcreteComp   │  │      Decorator (abstract)    │──component──┘
│               │  │  -component: Component       │
│+operation() { │  │  +Decorator(Component c) {   │
│  return       │  │    this.component = c;       │
│  "base";      │  │  }                           │
│}              │  │  +operation() {              │
└───────────────┘  │    return component.oper();  │
                   │  }                           │
                   └──────────────────────────────┘
                              △
                   ┌──────────┴──────────────┐
                   │                         │
          ┌────────┴──────────┐    ┌─────────┴─────────┐
          │  ConcreteDecorA   │    │  ConcreteDecorB   │
          │  +operation() {   │    │  +operation() {   │
          │   return "A(" +   │    │   return "B(" +   │
          │   super.oper()    │    │   super.oper()    │
          │   + ")";          │    │   + ")";          │
          │  }                │    │  }                │
          └───────────────────┘    └───────────────────┘
```

### 4. 关键约束（必须理解！）
1. **Decorator实现（继承）Component接口**：保持类型兼容性
2. **Decorator持有（组合）Component引用**：实现运行时组合
3. **Decorator的operation()中先调用component.operation()**：然后添加自己的行为
4. **可以无限嵌套**：每个Decorator都是Component，可被另一个Decorator包装

### 5. 完整代码示例：咖啡价格系统

```java
// ============ Component接口 ============
interface Coffee {
    String getDescription();
    double getCost();
}

// ============ ConcreteComponent ============
class SimpleCoffee implements Coffee {
    @Override
    public String getDescription() {
        return "Simple Coffee";
    }
    @Override
    public double getCost() {
        return 1.0;
    }
}

// ============ Decorator抽象类 ============
abstract class CoffeeDecorator implements Coffee {
    protected Coffee decoratedCoffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription();
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost();
    }
}

// ============ ConcreteDecorator A: 加牛奶 ============
class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + " + Milk";
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.5;
    }
}

// ============ ConcreteDecorator B: 加糖 ============
class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }
    
    @Override
    public String getDescription() {
        return decoratedCoffee.getDescription() + " + Sugar";
    }
    
    @Override
    public double getCost() {
        return decoratedCoffee.getCost() + 0.3;
    }
}

// ============ 客户端：动态组合 ============
class Client {
    public static void main(String[] args) {
        Coffee coffee = new SimpleCoffee();
        System.out.println(coffee.getDescription() + " $" + coffee.getCost());
        // 输出: Simple Coffee $1.0

        coffee = new MilkDecorator(coffee);
        System.out.println(coffee.getDescription() + " $" + coffee.getCost());
        // 输出: Simple Coffee + Milk $1.5

        coffee = new SugarDecorator(coffee);
        System.out.println(coffee.getDescription() + " $" + coffee.getCost());
        // 输出: Simple Coffee + Milk + Sugar $1.8
        
        // 双倍牛奶！
        coffee = new MilkDecorator(coffee);
        System.out.println(coffee.getDescription() + " $" + coffee.getCost());
        // 输出: Simple Coffee + Milk + Sugar + Milk $2.3
    }
}
```

### 6. Java I/O中的Decorator（经典考点！）

Java I/O流体系是Decorator模式的经典应用：

```java
// Component: InputStream（抽象基类）
// ConcreteComponent: FileInputStream, ByteArrayInputStream
// Decorator基类: FilterInputStream
// ConcreteDecorator: BufferedInputStream, DataInputStream, etc.

// 示例：层层装饰
InputStream is = new DataInputStream(          // 装饰器3：读基本类型
                   new BufferedInputStream(      // 装饰器2：加缓冲
                     new FileInputStream(        // 具体组件：文件读取
                       "data.txt")));

// 调用链：DataInputStream → BufferedInputStream → FileInputStream → 文件
int value = ((DataInputStream)is).readInt(); // 先经过缓冲，再读文件

// 体系结构：
//  InputStream (Component)
//    ├── FileInputStream (ConcreteComponent)
//    ├── ByteArrayInputStream (ConcreteComponent)
//    └── FilterInputStream (Decorator基类) ← 持有InputStream引用
//          ├── BufferedInputStream (ConcreteDecorator)
//          ├── DataInputStream (ConcreteDecorator)
//          └── PushbackInputStream (ConcreteDecorator)
```

### 7. Decorator vs 继承（详细对比）

| 比较项 | Decorator | 继承（子类化） |
|--------|-----------|---------------|
| 组合时机 | 运行时动态组合 | 编译时静态确定 |
| 类的数量 | 少（n个Decorator可任意组合） | 多（2^n种组合子类） |
| 灵活性 | 极高，可任意嵌套 | 低，必须预先定义 |
| 添加职责 | 透明地添加，不影响其他对象 | 所有实例都受影响 |
| 同一装饰多次 | 可以（如双倍牛奶） | 不可能 |
| 调试难度 | 较高（链路长） | 较低 |
| 体现原则 | OCP + CRP | 可能违反OCP |

### 8. Decorator vs Proxy（易混淆！）

| 比较项 | Decorator | Proxy |
|--------|-----------|-------|
| 目的 | 动态添加职责 | 控制对象访问 |
| 嵌套 | 通常多层嵌套 | 通常单层 |
| 创建被包装对象 | 由客户端创建传入 | Proxy自己创建或管理 |
| 接口 | 与Component相同 | 与Subject相同 |
| 关注点 | 增强功能 | 增加控制 |

---

## 三、外观模式 Facade Pattern（结构型）

### 1. 意图
为子系统中的一组接口提供一个一致的界面（Unified Interface）。Facade定义了一个高层接口，使得这个子系统更加容易使用。

### 2. 动机场景
假设编译一个程序需要调用：Scanner（词法分析）→ Parser（语法分析）→ ProgramNodeBuilder → CodeGenerator。客户端不应该直接与这些复杂对象打交道，Facade封装了这个过程。

### 3. 完整UML结构

```
                    ┌────────────────────────────────────────┐
                    │            Subsystem                   │
┌────────┐         │  ┌──────────┐  ┌──────────┐           │
│        │         │  │ ClassA   │  │ ClassB   │           │
│ Client │────────▶│  └──────────┘  └──────────┘           │
│        │    ┌────┤                                        │
└────────┘    │    │  ┌──────────┐  ┌──────────┐           │
              │    │  │ ClassC   │  │ ClassD   │           │
              │    │  └──────────┘  └──────────┘           │
              │    └────────────────────────────────────────┘
              │
              ▼
       ┌──────────────┐
       │   Facade     │
       │              │
       │ +doTaskA()   │ ─── 内部调用ClassA + ClassB
       │ +doTaskB()   │ ─── 内部调用ClassC + ClassD
       │ +doTaskC()   │ ─── 内部调用ClassA + ClassC + ClassD
       └──────────────┘
```

**关键**：Client可以通过Facade简化调用，也可以绕过Facade直接访问子系统（Facade不限制直接访问）。

### 4. 完整代码示例：家庭影院系统

```java
// ============ 子系统类（复杂的内部组件）============
class Amplifier {
    public void on() { System.out.println("Amplifier on"); }
    public void off() { System.out.println("Amplifier off"); }
    public void setVolume(int level) { 
        System.out.println("Volume set to " + level); 
    }
}

class DVDPlayer {
    public void on() { System.out.println("DVD Player on"); }
    public void off() { System.out.println("DVD Player off"); }
    public void play(String movie) { 
        System.out.println("Playing: " + movie); 
    }
    public void stop() { System.out.println("DVD stopped"); }
}

class Projector {
    public void on() { System.out.println("Projector on"); }
    public void off() { System.out.println("Projector off"); }
    public void wideScreenMode() { 
        System.out.println("Widescreen mode on"); 
    }
}

class TheaterLights {
    public void dim(int level) { 
        System.out.println("Lights dimmed to " + level + "%"); 
    }
    public void on() { System.out.println("Lights on"); }
}

// ============ Facade类：简化接口 ============
class HomeTheaterFacade {
    private Amplifier amp;
    private DVDPlayer dvd;
    private Projector projector;
    private TheaterLights lights;
    
    public HomeTheaterFacade(Amplifier amp, DVDPlayer dvd, 
                            Projector projector, TheaterLights lights) {
        this.amp = amp;
        this.dvd = dvd;
        this.projector = projector;
        this.lights = lights;
    }
    
    // 高层接口方法1：一键看电影
    public void watchMovie(String movie) {
        System.out.println("=== 准备看电影 ===");
        lights.dim(10);
        projector.on();
        projector.wideScreenMode();
        amp.on();
        amp.setVolume(8);
        dvd.on();
        dvd.play(movie);
    }
    
    // 高层接口方法2：一键结束
    public void endMovie() {
        System.out.println("=== 关闭影院 ===");
        dvd.stop();
        dvd.off();
        amp.off();
        projector.off();
        lights.on();
    }
}

// ============ 客户端 ============
class Client {
    public static void main(String[] args) {
        // 没有Facade时：客户端需要认识并操作所有子系统对象
        // 有Facade时：客户端只需认识Facade这一个对象
        HomeTheaterFacade theater = new HomeTheaterFacade(
            new Amplifier(), new DVDPlayer(), 
            new Projector(), new TheaterLights());
        
        theater.watchMovie("Inception"); // 一个调用完成所有工作
        theater.endMovie();
    }
}
```

### 5. Facade体现的设计原则

| 原则 | 体现方式 |
|------|---------|
| **LoD（迪米特法则/最少知识原则）** | 客户端只认识Facade一个"朋友"，不需要了解子系统内部细节 |
| **SRP（单一职责）** | Facade只负责协调子系统，不包含业务逻辑 |
| **封装变化** | 子系统内部的变化被Facade屏蔽，不影响客户端 |

### 6. Facade的重要特性
- **不限制直接访问**：Facade是一个额外选择，客户端仍然可以直接访问子系统
- **可以有多个Facade**：不同Facade提供不同的子系统使用方式
- **通常是单例的**：一个子系统通常只需要一个Facade对象
- **不是Adapter**：Adapter改变接口，Facade简化接口

---

## 四、代理模式 Proxy Pattern（结构型）

### 1. 意图
为其他对象提供一种代理以控制对这个对象的访问。

**别名**：Surrogate（替代者）

### 2. 完整UML结构

```
┌─────────────────────────┐
│    <<interface>>         │
│      Subject            │
│  +request(): void       │
│  +doSomething(): String │
└─────────────────────────┘
            △
       ┌────┴──────────────────┐
       │                       │
┌──────┴──────────┐    ┌───────┴───────────────────┐
│  RealSubject    │    │        Proxy              │
│                 │    │  -realSubject: RealSubject │
│  +request() {  │    │                           │
│    // 真实业务 │    │  +request() {             │
│    // 逻辑     │    │    // 前置控制            │
│  }             │    │    realSubject.request();  │
│                 │    │    // 后置控制            │
│  +doSomething()│    │  }                        │
│  {实际工作}    │    │  +doSomething() {         │
└─────────────────┘    │    // 控制逻辑           │
                       │    return realSubject     │
                       │      .doSomething();      │
                       │  }                        │
                       └───────────────────────────┘
                                    │
                                    │ 持有引用
                                    ▼
                             RealSubject实例
```

**核心**：Proxy和RealSubject实现**相同的接口**，对客户端透明。

### 3. 代理的四种类型（必须全部掌握）

| 类型 | 英文 | 目的 | 典型示例 |
|------|------|------|---------|
| **远程代理** | Remote Proxy | 为远程对象提供本地代表 | Java RMI Stub, Web Service Client |
| **虚拟代理** | Virtual Proxy | 延迟创建开销大的对象 | 图片懒加载、大对象延迟初始化 |
| **保护代理** | Protection Proxy | 控制对原始对象的访问权限 | 权限检查、认证系统 |
| **缓存代理** | Caching Proxy | 缓存频繁请求的结果 | 数据库查询缓存 |

### 4. 完整代码示例

#### 示例A：虚拟代理（延迟加载大图片）

```java
// ============ Subject接口 ============
interface Image {
    void display();
    int getWidth();
    int getHeight();
}

// ============ RealSubject：真实的高分辨率图片 ============
class HighResolutionImage implements Image {
    private String filename;
    private byte[] imageData; // 巨大的图片数据
    
    public HighResolutionImage(String filename) {
        this.filename = filename;
        loadFromDisk(); // 耗时操作！
    }
    
    private void loadFromDisk() {
        System.out.println("Loading image from disk: " + filename);
        // 模拟加载大文件，耗时3秒
        imageData = new byte[10_000_000]; // 10MB
    }
    
    @Override
    public void display() {
        System.out.println("Displaying: " + filename);
    }
    
    @Override
    public int getWidth() { return 1920; }
    @Override
    public int getHeight() { return 1080; }
}

// ============ Virtual Proxy：延迟创建 ============
class ImageProxy implements Image {
    private String filename;
    private HighResolutionImage realImage; // 延迟创建
    
    public ImageProxy(String filename) {
        this.filename = filename;
        // 注意：这里不创建RealSubject！
    }
    
    @Override
    public void display() {
        // 只有真正需要显示时才加载
        if (realImage == null) {
            realImage = new HighResolutionImage(filename);
        }
        realImage.display();
    }
    
    @Override
    public int getWidth() { return 1920; } // 不需要加载就能返回
    @Override
    public int getHeight() { return 1080; }
}

// ============ 客户端 ============
class DocumentViewer {
    public static void main(String[] args) {
        // 文档有100张图片，但用户可能只看第1张
        Image[] images = new Image[100];
        for (int i = 0; i < 100; i++) {
            images[i] = new ImageProxy("image_" + i + ".png");
            // 没有加载任何图片！速度极快
        }
        
        // 用户只滚动到第3张图片
        images[2].display(); // 此时才加载image_2.png
    }
}
```

#### 示例B：保护代理（权限控制）

```java
// ============ Subject接口 ============
interface Document {
    String read();
    void write(String content);
    void delete();
}

// ============ RealSubject ============
class RealDocument implements Document {
    private String content;
    private String name;
    
    public RealDocument(String name, String content) {
        this.name = name;
        this.content = content;
    }
    
    @Override
    public String read() { return content; }
    
    @Override
    public void write(String content) { this.content = content; }
    
    @Override
    public void delete() { 
        System.out.println("Document " + name + " deleted"); 
    }
}

// ============ Protection Proxy ============
class SecureDocumentProxy implements Document {
    private RealDocument realDoc;
    private User currentUser;
    
    public SecureDocumentProxy(RealDocument doc, User user) {
        this.realDoc = doc;
        this.currentUser = user;
    }
    
    @Override
    public String read() {
        if (currentUser.hasPermission("READ")) {
            return realDoc.read();
        }
        throw new SecurityException("No READ permission!");
    }
    
    @Override
    public void write(String content) {
        if (currentUser.hasPermission("WRITE")) {
            realDoc.write(content);
        } else {
            throw new SecurityException("No WRITE permission!");
        }
    }
    
    @Override
    public void delete() {
        if (currentUser.hasPermission("ADMIN")) {
            realDoc.delete();
        } else {
            throw new SecurityException("Only ADMIN can delete!");
        }
    }
}
```

### 5. Proxy在Java中的应用

| 场景 | 说明 |
|------|------|
| **Java RMI** | Stub就是远程对象的远程代理 |
| **Spring AOP** | 动态代理实现切面（日志、事务、权限） |
| **Hibernate LazyLoading** | 虚拟代理延迟加载关联对象 |
| **JDK Proxy** | `java.lang.reflect.Proxy` 动态代理接口 |

---

## 五、Facade vs Proxy（2025真题！必背！）

### 详细对比表

| 比较项 | Facade（外观） | Proxy（代理） |
|--------|---------------|--------------|
| **核心目的** | 简化接口，提供高层统一访问 | 控制访问，增加间接层 |
| **封装对象数量** | 封装**多个**子系统对象 | 代理**单个**对象 |
| **接口关系** | 定义**全新的**简化接口 | 与被代理对象**接口相同** |
| **透明性** | 不透明（客户端知道是Facade） | 透明（客户端不知道是Proxy） |
| **功能增强** | 不增加功能，只是简化调用 | 可增加控制逻辑（权限/缓存/延迟） |
| **可替换性** | Facade不能替代子系统对象 | Proxy可以直接替代RealSubject |
| **体现原则** | LoD（最少知识原则） | DIP（依赖倒转） |
| **使用场景** | 子系统太复杂，需要简化 | 需要控制对象访问方式 |

### 2025真题参考答案模板

**Q：Facade和Proxy的区别是什么？**

**A**：
1. **目的不同**：Facade的目的是为子系统提供简化的统一接口，降低使用复杂度；Proxy的目的是控制对单个对象的访问，增加访问控制层。
2. **对象关系不同**：Facade封装并协调多个子系统对象；Proxy代理单个真实对象。
3. **接口不同**：Facade定义了全新的简化接口，与子系统接口不同；Proxy与被代理对象实现相同的接口，对客户端透明。
4. **示例**：Facade如家庭影院遥控器（简化多个设备操作），Proxy如Spring AOP的事务代理（控制方法的事务行为）。

---

## 六、桥接模式 Bridge Pattern（结构型）

### 1. 意图
将抽象部分(Abstraction)与它的实现部分(Implementation)分离，使它们都可以独立地变化。

### 2. 问题场景
假设有形状(Shape)和颜色(Color)两个维度：
- 形状：Circle, Rectangle, Triangle
- 颜色：Red, Blue, Green

**用继承**：需要 3×3=9 个类（RedCircle, BlueCircle, GreenCircle, RedRectangle...）→ **组合爆炸！**
- 增加一个新形状→新增3个类
- 增加一个新颜色→新增3个类

**用Bridge**：只需 3+3=6 个类，两个维度独立扩展。

### 3. 完整UML结构

```
┌───────────────────────┐              ┌──────────────────────┐
│    Abstraction        │              │  <<interface>>        │
│  -impl: Implementor  │─────────────▶│   Implementor        │
│  +operation() {       │   聚合       │  +operationImpl()    │
│   impl.operImpl();    │              └──────────────────────┘
│  }                    │                        △
└───────────────────────┘                   ┌────┴────┐
          △                                 │         │
          │                          ┌──────┴───┐ ┌───┴──────┐
┌─────────┴────────────┐            │ConcrImpl A│ │ConcrImpl B│
│  RefinedAbstraction  │            │+operImpl()│ │+operImpl()│
│  +extendedOper() {   │            └──────────┘ └──────────┘
│   // 扩展功能        │
│   impl.operImpl();   │
│  }                   │
└──────────────────────┘
```

### 4. 完整代码示例：形状×颜色

```java
// ============ Implementor接口（颜色维度）============
interface Color {
    String fill();
}

// ============ ConcreteImplementor ============
class Red implements Color {
    @Override
    public String fill() { return "Red"; }
}

class Blue implements Color {
    @Override
    public String fill() { return "Blue"; }
}

class Green implements Color {
    @Override
    public String fill() { return "Green"; }
}

// ============ Abstraction（形状维度）============
abstract class Shape {
    protected Color color; // Bridge!!! 这就是"桥"
    
    public Shape(Color color) {
        this.color = color;
    }
    
    abstract void draw();
}

// ============ RefinedAbstraction ============
class Circle extends Shape {
    private int radius;
    
    public Circle(Color color, int radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    void draw() {
        System.out.println("Drawing " + color.fill() 
                         + " Circle with radius " + radius);
    }
}

class Rectangle extends Shape {
    private int width, height;
    
    public Rectangle(Color color, int width, int height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    @Override
    void draw() {
        System.out.println("Drawing " + color.fill() 
                         + " Rectangle " + width + "x" + height);
    }
}

// ============ 客户端 ============
class Client {
    public static void main(String[] args) {
        // 形状和颜色独立组合
        Shape redCircle = new Circle(new Red(), 5);
        Shape blueRect = new Rectangle(new Blue(), 10, 20);
        Shape greenCircle = new Circle(new Green(), 3);
        
        redCircle.draw();   // Drawing Red Circle with radius 5
        blueRect.draw();    // Drawing Blue Rectangle 10x20
        greenCircle.draw(); // Drawing Green Circle with radius 3
        
        // 新增颜色：只需新增一个Color实现类
        // 新增形状：只需新增一个Shape子类
        // 不会组合爆炸！
    }
}
```

### 5. Bridge的"桥"在哪里？
- **桥** = Abstraction中持有Implementor的引用
- 这个引用连接了两个独立变化的继承层次
- 形状层次和颜色层次通过这个引用"桥接"在一起

### 6. Bridge vs Strategy vs Adapter（三者对比）

| 比较项 | Bridge | Strategy | Adapter |
|--------|--------|----------|---------|
| **目的** | 分离两个独立变化维度 | 算法可替换 | 接口转换 |
| **关注点** | 结构设计（预防组合爆炸） | 行为替换（运行时切换算法） | 兼容性修复（事后补救） |
| **使用时机** | 设计初期 | 设计初期或重构 | 集成遗留系统 |
| **变化维度** | 两个 | 一个（算法维度） | 一个（接口转换） |
| **抽象与实现** | 都可以独立扩展 | 只有策略可扩展 | 只是包装 |

### 7. 实际应用
- **JDBC**：DriverManager(Abstraction) + Driver(Implementor)，不同数据库有不同Driver实现
- **GUI框架**：Window(Abstraction) + WindowImp(Implementor)，不同操作系统有不同实现
- **消息发送**：Message(Abstraction) + MessageSender(Implementor)，如Email/SMS/Push

---

## 七、结构型模式总览对比

| 模式 | 核心目的 | 关键特征 | 典型场景 |
|------|---------|---------|---------|
| **Adapter** | 接口转换 | 包装一个对象使其接口兼容 | 遗留系统集成 |
| **Bridge** | 分离两个变化维度 | 抽象持有实现的引用 | 多维度独立扩展 |
| **Composite** | 树形结构统一操作 | Leaf和Composite实现相同接口 | 文件系统/组织架构 |
| **Decorator** | 动态添加职责 | 包装器链式嵌套 | Java I/O流 |
| **Facade** | 简化子系统接口 | 一个高层入口协调多对象 | 复杂库的简化接口 |
| **Flyweight** | 共享减少内存 | 内部状态共享+外部状态传入 | 字符渲染/棋子 |
| **Proxy** | 控制对象访问 | 与真实对象相同接口 | 权限/延迟加载/缓存 |

---

## 八、今日自测

1. **Facade和Proxy的最核心区别是什么？（2025真题）**
   > Facade简化多个子系统的接口（封装复杂性，定义新接口），Proxy控制对单个对象的访问（增加间接层，接口相同，对客户端透明）。

2. **Decorator为什么同时使用继承和组合？**
   > 继承Component接口保持类型兼容（所以Decorator可以替代Component），组合Component引用实现运行时动态添加行为。两者缺一不可。

3. **Bridge模式解决什么问题？用具体例子说明。**
   > 解决多维度变化导致的类组合爆炸。如形状×颜色，不用Bridge需要n×m个类，用Bridge只需n+m个类。

4. **Adapter和Bridge的区别？**
   > Adapter是事后补救（已有不兼容的接口），Bridge是预先设计（设计阶段就分离变化维度）。

5. **Java I/O用了什么设计模式？为什么？**
   > Decorator模式。因为流的功能（缓冲、数据类型转换、压缩等）可以自由组合，用继承会导致类爆炸，Decorator允许运行时任意组合。

---

## 九、明日预告

Day 06将学习剩余重要设计模式：Template Method、Singleton、Flyweight、Iterator，以及防御性编程（断言/路障/错误处理）。
