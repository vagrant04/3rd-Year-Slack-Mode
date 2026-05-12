# Day 04: 设计模式（二）—— Observer + Command + Composite + State $\color{red}{（已阅）}$

> 学习时间：30分钟 | 重要程度：★★★★★（Observer是设计题必考，Command/Composite高频）
> 参考资料：复习资料/笔记/设计模式-整体.pdf, 旧课件/pmx/05-06

---

## 一、观察者模式 Observer Pattern（行为型）

### 1. 意图
定义对象间的一种**一对多**的依赖关系。当一个对象（Subject）状态改变时，所有依赖于它的对象（Observer）都得到通知并自动更新。

**别名**：Publish-Subscribe（发布-订阅），Dependents，Listener

### 2. 动机（为什么需要Observer）
- 多个对象需要监听同一个对象的状态变化
- 如果让被观察对象直接调用所有观察者，则产生紧耦合
- Observer模式通过抽象接口解耦Subject和Observer

### 3. 结构（UML类图详解）
```
┌─────────────────────────┐           ┌──────────────────────┐
│      <<interface>>       │           │   <<interface>>       │
│        Subject           │ observers │      Observer         │
│─────────────────────────│◆─────────▶│──────────────────────│
│ +attach(o: Observer)     │           │ +update(...)          │
│ +detach(o: Observer)     │           └──────────────────────┘
│ +notify()                │                      △
└─────────────────────────┘                      │
            △                            ┌───────┴────────┐
            │                            │                │
┌───────────┴──────────┐        ┌───────┴──────┐  ┌─────┴────────┐
│   ConcreteSubject     │        │ConcreteObsA  │  │ConcreteObsB  │
│──────────────────────│        │──────────────│  │──────────────│
│ -subjectState         │        │ -observerState│  │ -observerState│
│ +getState()           │        │ +update(...)  │  │ +update(...)  │
│ +setState(s)          │        └──────────────┘  └──────────────┘
└──────────────────────┘
```

**关键关系**：
- Subject **聚合** Observer（一对多）
- ConcreteObserver可能持有ConcreteSubject引用（拉模型时需要getState()）
- notify()遍历observers列表，逐一调用update()

### 4. 推模型 vs 拉模型（2022真题）

| 比较维度 | 推模型(Push) | 拉模型(Pull) |
|---------|------------|------------|
| **notify传参** | 传递具体数据 `update(data)` | 传递Subject引用 `update(subject)` |
| **Observer职责** | 被动接收数据 | 主动拉取需要的数据 |
| **Subject的假设** | 假设知道Observer需要什么数据 | 不假设Observer需要什么 |
| **耦合度** | Subject与Observer耦合度较高 | 更松耦合 |
| **灵活性** | 低（Subject决定推什么） | 高（Observer自由拉取） |
| **效率** | 高（一次调用获取所有数据） | 可能低（Observer需要多次调用getState） |
| **适用场景** | Observer都需要相同数据 | 不同Observer需要不同数据 |

**推模型完整代码**：
```java
// ===== 推模型 =====
interface Observer {
    void update(String title, String content, Date time);  // 推送具体数据
}

class ConcreteSubject {
    private List<Observer> observers = new ArrayList<>();
    private String title;
    private String content;
    
    public void attach(Observer o) { observers.add(o); }
    public void detach(Observer o) { observers.remove(o); }
    
    public void publishNotice(String title, String content) {
        this.title = title;
        this.content = content;
        notifyObservers();
    }
    
    private void notifyObservers() {
        for (Observer obs : observers) {
            obs.update(title, content, new Date());  // 推送所有数据
        }
    }
}

class StudentObserver implements Observer {
    private String name;
    public StudentObserver(String name) { this.name = name; }
    
    public void update(String title, String content, Date time) {
        System.out.println(name + " 收到通知: [" + title + "] " + content);
    }
}
```

**拉模型完整代码**：
```java
// ===== 拉模型 =====
interface Observer {
    void update(Subject subject);  // 只传subject引用
}

interface Subject {
    void attach(Observer o);
    void detach(Observer o);
    void notifyObservers();
}

class NoticeBoard implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String title;
    private String content;
    private Date publishTime;
    
    public void attach(Observer o) { observers.add(o); }
    public void detach(Observer o) { observers.remove(o); }
    
    public void notifyObservers() {
        for (Observer obs : observers) {
            obs.update(this);  // 传递自身引用
        }
    }
    
    public void publish(String title, String content) {
        this.title = title;
        this.content = content;
        this.publishTime = new Date();
        notifyObservers();
    }
    
    // Getter方法供Observer拉取
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public Date getPublishTime() { return publishTime; }
}

class StudentObserver implements Observer {
    private String name;
    public StudentObserver(String name) { this.name = name; }
    
    public void update(Subject subject) {
        // Observer自己决定拉取什么数据
        NoticeBoard board = (NoticeBoard) subject;
        System.out.println(name + " 拉取通知标题: " + board.getTitle());
        // 可以选择不获取content，按需拉取
    }
}
```

### 5. Java标准库中的Observer（2025真题相关）

```java
// java.util.Observable（Subject）提供的方法：
public class Observable {
    public void addObserver(Observer o);
    public void deleteObserver(Observer o);
    public void notifyObservers();           // 拉模型：无参
    public void notifyObservers(Object arg); // 推模型：带数据
    protected void setChanged();             // 标记状态已改变（必须调用！）
    public boolean hasChanged();
}

// java.util.Observer接口：
public interface Observer {
    void update(Observable o, Object arg);   
    // o是Subject引用（拉模型用），arg是推送数据（推模型用）
}
```

**注意**：必须先调用`setChanged()`再调用`notifyObservers()`，否则不会触发通知！

### 6. Observer体现的设计原则
- **OCP**：新增Observer类型不需修改Subject代码
- **DIP**：Subject依赖Observer抽象接口，不依赖具体Observer
- **SRP**：Subject负责管理状态，Observer负责响应变化
- **松耦合**：Subject只知道Observer接口，不知道具体实现

### 7. Observer的缺点（可能考）
- 如果Observer链很长，notify开销大
- 如果Subject和Observer之间有循环依赖，可能导致无限循环
- Observer不知道其他Observer的存在，可能导致不可预期的更新顺序
- 内存泄漏：如果Observer没有被正确detach

---

## 二、命令模式 Command Pattern（行为型）

### 1. 意图
将一个请求**封装为一个对象**，从而可以：
- 用不同的请求对客户进行参数化
- 对请求排队或记录日志
- 支持可撤销的操作

### 2. 动机
- 菜单项不知道点击后具体做什么
- 需要在不同时间指定、排列和执行请求
- 需要支持undo/redo操作

### 3. 结构（UML详解）
```
┌──────────────┐         ┌─────────────────────┐
│   Client     │         │   <<interface>>      │
│（创建命令    │         │     Command          │
│  绑定接收者）│         │─────────────────────│
└──────────────┘         │ +execute()           │
                          │ +undo()              │
                          └─────────────────────┘
                                     △
┌──────────────┐                     │
│   Invoker    │          ┌──────────┴───────────┐
│──────────────│          │   ConcreteCommand    │
│ -command     │─────────▶│─────────────────────│
│ +setCommand()│          │ -receiver: Receiver  │
│ +invoke()    │          │ -state               │
└──────────────┘          │ +execute()           │
                          │ +undo()              │
                          └──────────────────────┘
                                     │
                                     │ 调用
                                     ▼
                          ┌──────────────────────┐
                          │     Receiver         │
                          │─────────────────────│
                          │ +action()            │
                          │ +undoAction()        │
                          └──────────────────────┘
```

### 4. 四个角色详解（2021/2025真题必考）

| 角色 | 职责 | 类比 |
|------|------|------|
| **Command（命令接口）** | 声明execute()和undo()方法 | 订单格式 |
| **ConcreteCommand（具体命令）** | 持有Receiver引用，execute()中调用receiver.action() | 具体订单 |
| **Invoker（调用者/请求者）** | 持有Command引用，在某个时机调用command.execute() | 服务员 |
| **Receiver（接收者）** | 知道如何执行实际操作 | 厨师 |

**核心解耦**：Invoker不知道Receiver是谁，也不知道具体做什么操作，它只知道Command接口。

### 5. 完整代码示例（含撤销功能）

```java
// ===== Command接口 =====
interface Command {
    void execute();
    void undo();
}

// ===== Receiver =====
class TextEditor {
    private StringBuilder content = new StringBuilder();
    
    public void insertText(String text, int position) {
        content.insert(position, text);
        System.out.println("插入文本: " + text + " at position " + position);
    }
    
    public void deleteText(int position, int length) {
        content.delete(position, position + length);
        System.out.println("删除文本: position " + position + ", length " + length);
    }
    
    public String getContent() { return content.toString(); }
}

// ===== ConcreteCommand =====
class InsertCommand implements Command {
    private TextEditor editor;    // Receiver
    private String text;          // 命令参数
    private int position;         // 命令参数
    
    public InsertCommand(TextEditor editor, String text, int position) {
        this.editor = editor;
        this.text = text;
        this.position = position;
    }
    
    public void execute() {
        editor.insertText(text, position);
    }
    
    public void undo() {
        editor.deleteText(position, text.length()); // 撤销=删除插入的文本
    }
}

// ===== Invoker =====
class CommandManager {
    private Stack<Command> history = new Stack<>();
    
    public void executeCommand(Command cmd) {
        cmd.execute();
        history.push(cmd);
    }
    
    public void undoLastCommand() {
        if (!history.isEmpty()) {
            Command lastCmd = history.pop();
            lastCmd.undo();
        }
    }
}

// ===== 使用 =====
TextEditor editor = new TextEditor();
CommandManager manager = new CommandManager();

Command cmd1 = new InsertCommand(editor, "Hello", 0);
Command cmd2 = new InsertCommand(editor, " World", 5);

manager.executeCommand(cmd1); // editor内容: "Hello"
manager.executeCommand(cmd2); // editor内容: "Hello World"
manager.undoLastCommand();    // 撤销 → editor内容: "Hello"
```

### 6. 宏命令 MacroCommand（2021真题编程题）

**宏命令**：将多个Command组合为一个复合命令，一次执行所有子命令。

```java
class MacroCommand implements Command {
    private List<Command> commands;
    
    public MacroCommand(List<Command> cmds) {
        this.commands = new ArrayList<>(cmds);
    }
    
    public void execute() {
        for (Command cmd : commands) {
            cmd.execute();
        }
    }
    
    public void undo() {
        // 逆序撤销！
        for (int i = commands.size() - 1; i >= 0; i--) {
            commands.get(i).undo();
        }
    }
}

// 使用宏命令
List<Command> partyCommands = Arrays.asList(
    new LightOnCommand(light),
    new MusicOnCommand(music),
    new ACOnCommand(ac)
);
Command partyMacro = new MacroCommand(partyCommands);
partyMacro.execute();  // 一次开启所有设备
partyMacro.undo();     // 一次关闭所有设备（逆序）
```

### 7. Command模式的应用场景
| 场景 | 说明 |
|------|------|
| **GUI按钮/菜单项** | 按钮绑定Command，不同按钮绑定不同Command |
| **事务(Transaction)** | 一组操作打包成Command，支持回滚 |
| **任务队列** | Command入队，Worker线程依次执行 |
| **日志/审计** | 记录所有Command，可回放(Replay) |
| **远程调用** | 将Command序列化后网络传输 |

### 8. Command体现的设计原则
- **SRP**：Invoker负责调用时机，Command负责封装请求，Receiver负责执行
- **OCP**：新增命令只需新增ConcreteCommand类
- **DIP**：Invoker依赖Command抽象接口

---

## 三、组合模式 Composite Pattern（结构型）

### 1. 意图
将对象组合成**树形结构**以表示"部分-整体"的层次结构。使得客户对**单个对象**和**组合对象**的使用具有**一致性**。

### 2. 结构（UML详解）
```
┌──────────────────────────────────┐
│          <<abstract>>             │
│           Component               │
│──────────────────────────────────│
│ +operation()                      │
│ +add(c: Component)      [可选]   │
│ +remove(c: Component)   [可选]   │
│ +getChild(i: int)       [可选]   │
└──────────────────────────────────┘
                  △
        ┌─────────┴─────────┐
        │                   │
┌───────┴───────┐   ┌──────┴──────────────────┐
│     Leaf      │   │      Composite           │
│───────────────│   │──────────────────────────│
│ +operation()  │   │ -children: List<Component>│
└───────────────┘   │ +operation()             │ ← 遍历children调用operation()
                    │ +add(c: Component)       │
                    │ +remove(c: Component)    │
                    │ +getChild(i: int)        │
                    └──────────────────────────┘
```

### 3. 两种设计方式

**透明方式**：add/remove/getChild定义在Component中
- 优点：客户端完全一致地对待Leaf和Composite
- 缺点：Leaf中的add/remove无意义（需要抛出异常或空实现）

**安全方式**：add/remove/getChild只在Composite中定义
- 优点：Leaf不包含无意义操作
- 缺点：客户端需要区分Leaf和Composite（需要类型转换）

### 4. 完整代码示例（文件系统）

```java
// ===== Component =====
abstract class FileSystemComponent {
    protected String name;
    
    public FileSystemComponent(String name) { this.name = name; }
    
    public abstract void display(int depth);
    public abstract int getSize();
    
    // 默认实现（Leaf不需要这些操作）
    public void add(FileSystemComponent c) {
        throw new UnsupportedOperationException();
    }
    public void remove(FileSystemComponent c) {
        throw new UnsupportedOperationException();
    }
}

// ===== Leaf =====
class File extends FileSystemComponent {
    private int size;
    
    public File(String name, int size) {
        super(name);
        this.size = size;
    }
    
    public void display(int depth) {
        System.out.println("  ".repeat(depth) + "📄 " + name + " (" + size + "KB)");
    }
    
    public int getSize() { return size; }
}

// ===== Composite =====
class Directory extends FileSystemComponent {
    private List<FileSystemComponent> children = new ArrayList<>();
    
    public Directory(String name) { super(name); }
    
    public void add(FileSystemComponent c) { children.add(c); }
    public void remove(FileSystemComponent c) { children.remove(c); }
    
    public void display(int depth) {
        System.out.println("  ".repeat(depth) + "📁 " + name);
        for (FileSystemComponent child : children) {
            child.display(depth + 1);  // 递归显示
        }
    }
    
    public int getSize() {
        int total = 0;
        for (FileSystemComponent child : children) {
            total += child.getSize();  // 递归计算
        }
        return total;
    }
}

// ===== 使用 =====
Directory root = new Directory("root");
Directory src = new Directory("src");
src.add(new File("Main.java", 10));
src.add(new File("Utils.java", 5));
root.add(src);
root.add(new File("README.md", 2));

root.display(0);   // 递归显示整个树
root.getSize();    // 递归计算：10+5+2=17KB
```

### 5. 经典考试组合：Composite + Observer（通知系统设计题）

**完整设计方案**（2021/2022/2025设计题）：

```java
// ===== Observer接口 =====
interface NoticeObserver {
    void receiveNotice(String title, String content);
    String getName();
}

// ===== Component（既是Observer又可包含子Observer）=====
abstract class OrganizationComponent implements NoticeObserver {
    protected String name;
    public OrganizationComponent(String name) { this.name = name; }
    public String getName() { return name; }
    
    public void add(OrganizationComponent c) { throw new UnsupportedOperationException(); }
    public void remove(OrganizationComponent c) { throw new UnsupportedOperationException(); }
}

// ===== Leaf（个人）=====
class Person extends OrganizationComponent {
    private String role; // 学生/教师
    
    public Person(String name, String role) {
        super(name);
        this.role = role;
    }
    
    public void receiveNotice(String title, String content) {
        System.out.println("[" + role + "] " + name + " 收到通知: " + title);
    }
}

// ===== Composite（部门/班级）=====
class Department extends OrganizationComponent {
    private List<OrganizationComponent> members = new ArrayList<>();
    
    public Department(String name) { super(name); }
    
    public void add(OrganizationComponent c) { members.add(c); }
    public void remove(OrganizationComponent c) { members.remove(c); }
    
    public void receiveNotice(String title, String content) {
        System.out.println("📢 " + name + " 转发通知: " + title);
        // 递归转发给所有成员
        for (OrganizationComponent member : members) {
            member.receiveNotice(title, content);
        }
    }
}

// ===== Subject（通知发布者）=====
class NoticePublisher {
    private List<NoticeObserver> subscribers = new ArrayList<>();
    
    public void subscribe(NoticeObserver observer) { subscribers.add(observer); }
    public void unsubscribe(NoticeObserver observer) { subscribers.remove(observer); }
    
    public void publishNotice(String title, String content) {
        for (NoticeObserver obs : subscribers) {
            obs.receiveNotice(title, content);
        }
    }
}

// ===== 使用 =====
// 构建组织树
Department cs = new Department("计算机学院");
Department class1 = new Department("软件1班");
class1.add(new Person("张三", "学生"));
class1.add(new Person("李四", "学生"));
cs.add(class1);
cs.add(new Person("王教授", "教师"));

// 学校通知系统
NoticePublisher school = new NoticePublisher();
school.subscribe(cs); // 订阅整个学院（Composite）

school.publishNotice("放假通知", "国庆放假7天");
// 输出：
// 📢 计算机学院 转发通知: 放假通知
// 📢 软件1班 转发通知: 放假通知
// [学生] 张三 收到通知: 放假通知
// [学生] 李四 收到通知: 放假通知
// [教师] 王教授 收到通知: 放假通知
```

---

## 四、状态模式 State Pattern（行为型）

### 1. 意图
允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它的类。

### 2. 结构（UML详解）
```
┌──────────────────────┐           ┌─────────────────────┐
│      Context         │           │  <<interface>>       │
│──────────────────────│           │      State           │
│ -state: State        │──────────▶│─────────────────────│
│ +request()           │           │ +handle(ctx: Context)│
│ +setState(s: State)  │           └─────────────────────┘
└──────────────────────┘                    △
                                   ┌────────┼────────┐
                                   │        │        │
                            ┌──────┴──┐ ┌──┴─────┐ ┌┴──────────┐
                            │ StateA  │ │ StateB │ │ StateC    │
                            │+handle()│ │+handle()│ │+handle()  │
                            └─────────┘ └────────┘ └───────────┘
```

### 3. 完整代码示例（订单状态机）

```java
// ===== State接口 =====
interface OrderState {
    void pay(OrderContext ctx);
    void ship(OrderContext ctx);
    void deliver(OrderContext ctx);
    void cancel(OrderContext ctx);
    String getStateName();
}

// ===== Context =====
class OrderContext {
    private OrderState state;
    private String orderId;
    
    public OrderContext(String orderId) {
        this.orderId = orderId;
        this.state = new PendingPayState(); // 初始状态
    }
    
    public void setState(OrderState state) { this.state = state; }
    
    public void pay() { state.pay(this); }
    public void ship() { state.ship(this); }
    public void deliver() { state.deliver(this); }
    public void cancel() { state.cancel(this); }
    
    public String getStatus() { return state.getStateName(); }
}

// ===== ConcreteState: 待支付 =====
class PendingPayState implements OrderState {
    public void pay(OrderContext ctx) {
        System.out.println("支付成功！订单状态 → 待发货");
        ctx.setState(new PendingShipState()); // 状态自己决定转换！
    }
    public void ship(OrderContext ctx) {
        System.out.println("错误：未支付不能发货");
    }
    public void deliver(OrderContext ctx) {
        System.out.println("错误：未支付不能送达");
    }
    public void cancel(OrderContext ctx) {
        System.out.println("订单已取消");
        ctx.setState(new CancelledState());
    }
    public String getStateName() { return "待支付"; }
}

// ===== ConcreteState: 待发货 =====
class PendingShipState implements OrderState {
    public void pay(OrderContext ctx) {
        System.out.println("错误：已支付，无需重复支付");
    }
    public void ship(OrderContext ctx) {
        System.out.println("已发货！订单状态 → 配送中");
        ctx.setState(new ShippingState());
    }
    public void deliver(OrderContext ctx) {
        System.out.println("错误：未发货不能确认送达");
    }
    public void cancel(OrderContext ctx) {
        System.out.println("订单取消，退款处理中");
        ctx.setState(new CancelledState());
    }
    public String getStateName() { return "待发货"; }
}

// ===== ConcreteState: 配送中 =====
class ShippingState implements OrderState {
    public void pay(OrderContext ctx) { System.out.println("错误：已支付"); }
    public void ship(OrderContext ctx) { System.out.println("错误：已发货"); }
    public void deliver(OrderContext ctx) {
        System.out.println("订单送达！");
        ctx.setState(new DeliveredState());
    }
    public void cancel(OrderContext ctx) {
        System.out.println("错误：配送中不可取消");
    }
    public String getStateName() { return "配送中"; }
}
```

### 4. State vs Strategy 深度对比（考试高频！）

| 对比维度 | State（状态模式） | Strategy（策略模式） |
|---------|------------------|---------------------|
| **切换决定者** | 状态对象内部决定下一个状态 | 客户端/Context外部选择策略 |
| **状态间关系** | 状态之间互相知道，形成状态机 | 策略之间互不知晓 |
| **切换时机** | 运行时根据条件自动流转 | 通常初始化时设定 |
| **状态数量** | 对象有明确的几个状态 | 可供选择的算法族 |
| **核心目的** | 管理对象行为随状态变化 | 让算法可替换 |
| **Context角色** | 委托+被状态改变 | 委托（不被策略改变） |
| **典型场景** | TCP连接状态、订单状态机、电梯状态 | 排序算法、折扣策略、支付方式 |

**判断口诀**：
- 如果"行为随内部状态自动变化" → State
- 如果"客户端主动选择不同的行为方式" → Strategy

---

## 五、四种模式的综合对比

| 模式 | 类型 | 核心 | 体现原则 | 高频考法 |
|------|------|------|---------|---------|
| Observer | 行为型 | 一对多通知 | OCP, DIP | 推/拉模型、通知系统设计 |
| Command | 行为型 | 请求封装为对象 | SRP, OCP | 四角色、MacroCommand、undo |
| Composite | 结构型 | 部分-整体树形 | OCP | 与Observer组合的通知系统 |
| State | 行为型 | 行为随状态变 | OCP, SRP | vs Strategy区别 |

---

## 六、今日自测

1. 画出Observer模式的UML类图，标注推模型和拉模型的区别。
2. Command模式中，如果要支持undo/redo，需要在哪些地方做修改？
   > Command接口增加undo()方法；每个ConcreteCommand实现undo()（反向操作）；Invoker维护命令历史栈。
3. 用Composite+Observer设计一个公司多层级通知系统，画出类图并写关键代码。
4. 给出一个具体场景，判断应该用State还是Strategy，并说明理由。

---

## 七、明日预告

Day 05将学习：Adapter（适配器）、Decorator（装饰器）、Facade（外观）、Proxy（代理）、Bridge（桥接）—— 结构型模式详解。
