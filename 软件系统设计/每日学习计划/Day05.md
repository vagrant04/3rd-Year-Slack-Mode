# Day 05: 设计模式（三）—— 结构型模式重点

> 学习时间：30分钟 | 重要程度：★★★★☆（Facade vs Proxy是2025真题）
> 参考资料：复习资料/笔记/设计模式-整体.pdf, 旧课件/pmx/07-08

---

## 一、适配器模式 Adapter Pattern（结构型）

### 1. 意图
将一个类的接口转换成客户希望的另一个接口。使原本接口不兼容的类可以一起工作。

### 2. 两种实现方式

**类适配器（通过继承）**：
```
Client ──▶ Target ◁── Adapter ──继承──▶ Adaptee
```

**对象适配器（通过组合，推荐）**：
```
Client ──▶ Target ◁── Adapter ──持有──▶ Adaptee
```

### 3. 代码示例
```java
// 已有接口（不能修改）
class OldLogger {
    void logMessage(String msg) { System.out.println("OLD: " + msg); }
}

// 目标接口（客户端期望的）
interface Logger {
    void log(String message);
}

// 适配器
class LoggerAdapter implements Logger {
    private OldLogger oldLogger;
    public LoggerAdapter(OldLogger old) { this.oldLogger = old; }
    public void log(String message) {
        oldLogger.logMessage(message); // 转换调用
    }
}
```

### 4. 适用场景
- 使用第三方库但接口不匹配
- 遗留系统集成
- 统一多个类似但接口不同的类

---

## 二、装饰器模式 Decorator Pattern（结构型）

### 1. 意图
动态地给一个对象添加额外的职责。比子类方式更灵活。

### 2. 结构
```
┌────────────────┐
│  Component     │◁─────────────────────────────┐
│ +operation()   │                               │
└────────────────┘                               │
        △                                        │
   ┌────┴─────┐                                  │
   │          │                                  │
┌──┴───┐  ┌──┴──────────────┐                   │
│Concr │  │   Decorator     │───持有component───┘
│ete   │  │ +operation()    │
│Comp  │  └─────────────────┘
└──────┘          △
           ┌──────┴───────┐
           │              │
    ┌──────┴───┐   ┌─────┴────┐
    │DecoratorA│   │DecoratorB│
    │+oper()   │   │+oper()   │
    └──────────┘   └──────────┘
```

### 3. 核心特点
- Decorator继承Component（保持接口一致性）
- Decorator持有Component引用（组合）
- 可以无限嵌套装饰：`new DecB(new DecA(new ConcreteComp()))`
- 运行时动态组合行为

### 4. Decorator vs 继承

| 比较项 | Decorator | 继承 |
|--------|-----------|------|
| 组合时机 | 运行时动态 | 编译时静态 |
| 类的数量 | 少（可任意组合） | 多（组合爆炸） |
| 灵活性 | 高 | 低 |
| 体现原则 | OCP, CRP | - |

### 5. 经典示例：Java I/O
```java
// Java I/O就是装饰器模式的经典应用
InputStream is = new BufferedInputStream(
                    new FileInputStream("file.txt")); // 嵌套装饰
```

---

## 三、外观模式 Facade Pattern（结构型）

### 1. 意图
为子系统中的一组接口提供一个一致的界面。定义了一个高层接口，使得子系统更容易使用。

### 2. 结构
```
Client ──▶ Facade ──▶ SubsystemA
                  ├──▶ SubsystemB
                  └──▶ SubsystemC
```

### 3. 核心特点
- **简化接口**：将复杂的子系统封装在一个简单接口后
- **不限制访问**：客户仍可直接访问子系统（Facade是额外选择，非强制）
- **解耦**：客户端与子系统之间松耦合

### 4. 代码示例
```java
class HomeTheaterFacade {
    private Amplifier amp;
    private DVDPlayer dvd;
    private Projector projector;
    
    public void watchMovie(String movie) {
        projector.on();
        amp.setVolume(10);
        dvd.play(movie);
    }
    public void endMovie() {
        dvd.stop();
        amp.off();
        projector.off();
    }
}
```

### 5. 体现的原则
- **LoD（迪米特法则）**：客户端只需认识Facade这一个"朋友"
- **SRP**：Facade只负责协调，不包含业务逻辑

---

## 四、代理模式 Proxy Pattern（结构型）

### 1. 意图
为其他对象提供一种代理以控制对这个对象的访问。

### 2. 结构
```
┌────────────────┐
│  <<interface>>  │
│    Subject      │
│ +request()      │
└────────────────┘
        △
   ┌────┴─────┐
   │          │
┌──┴──────┐  ┌┴───────────┐
│RealSubj │  │   Proxy    │──持有──▶ RealSubject
│+request()│  │+request()  │
└─────────┘  └────────────┘
```

### 3. 代理类型
| 类型 | 用途 | 示例 |
|------|------|------|
| **远程代理** | 为远程对象提供本地代表 | RMI Stub |
| **虚拟代理** | 延迟创建开销大的对象 | 图片懒加载 |
| **保护代理** | 控制访问权限 | 权限检查 |
| **缓存代理** | 缓存操作结果 | 数据库查询缓存 |

### 4. 代码示例（保护代理）
```java
class ProtectedDocument implements Document {
    private RealDocument realDoc;
    private User currentUser;
    
    public void read() {
        if (currentUser.hasPermission("read")) {
            realDoc.read();
        } else {
            throw new AccessDeniedException();
        }
    }
}
```

---

## 五、Facade vs Proxy（2025真题！）

| 比较项 | Facade | Proxy |
|--------|--------|-------|
| **目的** | 简化接口，提供高层访问 | 控制访问，增加间接层 |
| **对象关系** | 封装多个子系统对象 | 代理单个对象 |
| **接口** | 定义新的简化接口 | 与被代理对象接口相同 |
| **客户端感知** | 知道在用Facade | 可能不知道在用Proxy |
| **透明性** | 不透明（接口不同） | 透明（接口相同） |
| **体现原则** | LoD（最少知识） | DIP（间接访问） |

---

## 六、桥接模式 Bridge Pattern（结构型）

### 1. 意图
将抽象部分与它的实现部分分离，使它们都可以独立地变化。

### 2. 结构
```
┌──────────────┐         ┌──────────────┐
│ Abstraction  │────────▶│ Implementor  │
│ +operation() │         │ +operImpl()  │
└──────────────┘         └──────────────┘
       △                        △
       │                        │
┌──────┴──────┐         ┌──────┴──────┐
│RefinedAbstr │         │ConcreteImpl │
└─────────────┘         └─────────────┘
```

### 3. 核心思想
- 当一个类有**两个独立变化的维度**时，用桥接分离
- 例：形状（Circle, Square）× 颜色（Red, Blue） → 不要创建RedCircle, BlueCircle...
- 而是 Shape持有Color引用，两个维度独立扩展

### 4. Bridge vs Strategy
- Bridge关注**结构**：分离抽象与实现，两个维度独立变化
- Strategy关注**行为**：算法可替换

---

## 七、今日自测

1. Facade和Proxy的最核心区别是什么？（2025真题）
   > Facade简化多个子系统的接口（封装复杂性），Proxy控制对单个对象的访问（增加间接层且接口相同）。

2. Decorator为什么比继承更灵活？
   > Decorator可以运行时动态组合多个行为，避免继承带来的类爆炸。

3. Bridge模式解决什么问题？
   > 当类有两个独立变化维度时，避免多维度的类组合爆炸。

---

## 八、明日预告

Day 06将学习剩余重要设计模式：Template Method、Singleton、Flyweight、Iterator，以及防御性编程。
