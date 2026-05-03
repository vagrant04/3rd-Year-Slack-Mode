# Day 04: 设计模式（二）—— Observer + Command + Composite + State

> 学习时间：30分钟 | 重要程度：★★★★★（Observer是设计题必考，Command/Composite高频）
> 参考资料：复习资料/笔记/设计模式-整体.pdf, 旧课件/pmx/05-06

---

## 一、观察者模式 Observer Pattern（行为型）

### 1. 意图
定义对象间的一种一对多的依赖关系。当一个对象状态改变时，所有依赖于它的对象都得到通知并自动更新。

### 2. 结构
```
┌───────────────────┐         ┌──────────────────┐
│    <<interface>>   │         │  <<interface>>    │
│      Subject       │────────▶│    Observer       │
│ +attach(Observer)  │         │ +update()         │
│ +detach(Observer)  │         └──────────────────┘
│ +notify()          │                  △
└───────────────────┘                  │
         △                     ┌───────┴────────┐
         │                     │                │
┌────────┴────────┐    ┌──────┴──┐    ┌───────┴───┐
│ConcreteSubject  │    │ObserverA│    │ObserverB  │
│ -state          │    │+update()│    │+update()  │
│ +getState()     │    └─────────┘    └───────────┘
│ +setState()     │
└─────────────────┘
```

### 3. 推模型 vs 拉模型（2022真题）

| 模型 | 机制 | 优点 | 缺点 |
|------|------|------|------|
| **推模型(Push)** | Subject主动将详细数据推送给Observer | Observer无需再次请求数据 | Subject需要知道Observer需要什么数据 |
| **拉模型(Pull)** | Subject只通知"有变化"，Observer自己拉取所需数据 | 灵活，Observer按需获取 | 可能需要多次请求 |

**Java示例（推模型）**：
```java
// notify中直接传递数据
public void notifyObservers(String message) {
    for (Observer obs : observers) {
        obs.update(message); // 推送具体信息
    }
}
```

**Java示例（拉模型）**：
```java
// notify中只传递subject引用
public void notifyObservers() {
    for (Observer obs : observers) {
        obs.update(this); // observer自己调getState()拉数据
    }
}
```

### 4. 经典考题（2021/2022/2025设计题）：大学通知系统

**题目**：设计通知系统，学校发布通知后，学生/老师等角色收到通知。

**设计方案**：Observer + Composite
```java
interface Observer { void update(String notice); }

class Student implements Observer {
    public void update(String notice) { System.out.println("学生收到: " + notice); }
}
class Teacher implements Observer {
    public void update(String notice) { System.out.println("教师收到: " + notice); }
}

class NoticeBoard { // Subject
    private List<Observer> observers = new ArrayList<>();
    public void attach(Observer o) { observers.add(o); }
    public void detach(Observer o) { observers.remove(o); }
    public void publish(String notice) {
        for (Observer o : observers) o.update(notice);
    }
}
```

### 5. Java中的notifyObserver重载（2025真题）
```java
// java.util.Observable提供两种notify
notifyObservers()        // 拉模型：不传数据
notifyObservers(Object arg) // 推模型：传递数据
```

---

## 二、命令模式 Command Pattern（行为型）

### 1. 意图
将一个请求封装为一个对象，从而可以用不同的请求对客户进行参数化；支持撤销操作、排队、日志记录。

### 2. 结构
```
┌────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────┐
│Invoker │───▶│ Command  │───▶│ConcreteCmd   │───▶│ Receiver │
│        │    │+execute()│    │+execute()    │    │+action() │
└────────┘    └──────────┘    │-receiver     │    └──────────┘
                              └──────────────┘
```

### 3. 四个角色（2021/2025真题必考）
- **Command（命令接口）**：声明execute()方法
- **ConcreteCommand（具体命令）**：绑定Receiver与动作，实现execute()
- **Invoker（调用者）**：持有Command引用，请求命令执行
- **Receiver（接收者）**：实际执行命令逻辑的对象

### 4. 代码示例
```java
// Command接口
interface Command { void execute(); }

// 具体命令
class LightOnCommand implements Command {
    private Light light; // Receiver
    public LightOnCommand(Light light) { this.light = light; }
    public void execute() { light.turnOn(); }
}

// Invoker
class RemoteControl {
    private Command command;
    public void setCommand(Command cmd) { this.command = cmd; }
    public void pressButton() { command.execute(); }
}

// 使用
Light light = new Light();
Command cmd = new LightOnCommand(light);
RemoteControl remote = new RemoteControl();
remote.setCommand(cmd);
remote.pressButton(); // 间接调用light.turnOn()
```

### 5. Command的核心价值
- **解耦**：Invoker不知道Receiver是谁，只知道Command接口
- **可撤销**：添加undo()方法，记录命令历史
- **宏命令（MacroCommand）**：组合多个Command，一次执行（2021真题编程题）

### 6. 宏命令代码（2021真题）
```java
class MacroCommand implements Command {
    private List<Command> commands;
    public MacroCommand(List<Command> cmds) { this.commands = cmds; }
    public void execute() {
        for (Command cmd : commands) cmd.execute();
    }
}
```

---

## 三、组合模式 Composite Pattern（结构型）

### 1. 意图
将对象组合成树形结构以表示"部分-整体"的层次结构。使得客户对单个对象和组合对象的使用具有一致性。

### 2. 结构
```
┌────────────────────┐
│   <<interface>>     │
│    Component        │
│ +operation()        │
│ +add(Component)     │
│ +remove(Component)  │
│ +getChild(int)      │
└────────────────────┘
          △
    ┌─────┴──────┐
    │            │
┌───┴────┐  ┌───┴────────┐
│  Leaf  │  │ Composite  │
│+oper() │  │+operation()│──── children: List<Component>
└────────┘  │+add()      │
            │+remove()   │
            └────────────┘
```

### 3. 典型应用场景
- 文件系统（文件=Leaf，文件夹=Composite）
- 组织结构（员工=Leaf，部门=Composite）
- 通知系统（个人=Leaf，群组=Composite）

### 4. 考试常见组合：Composite + Observer
**大学通知系统设计**（2021/2022设计题）：
- `Department` 是 Composite（包含子部门和个人）
- 发布通知时，Composite递归向所有叶子节点（Observer）发送update

```java
class Department implements Observer, Subject {
    private List<Observer> members = new ArrayList<>();
    public void update(String msg) {
        // 收到上级通知后，转发给所有成员
        for (Observer m : members) m.update(msg);
    }
}
```

---

## 四、状态模式 State Pattern（行为型）

### 1. 意图
允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它的类。

### 2. 结构
```
┌───────────────┐         ┌──────────────┐
│   Context     │────────▶│   State      │
│ -state        │         │ +handle()    │
│ +request()    │         └──────────────┘
└───────────────┘                △
                      ┌──────────┼──────────┐
                      │          │          │
               ┌──────┴──┐ ┌────┴───┐ ┌───┴──────┐
               │ StateA  │ │StateB  │ │ StateC   │
               │+handle()│ │+handle()│ │+handle() │
               └─────────┘ └────────┘ └──────────┘
```

### 3. 核心特点
- 状态转换逻辑在**ConcreteState内部**决定（不是客户端）
- 各状态之间互相知道彼此（知道下一个状态是什么）
- Context将行为委托给当前状态对象

### 4. State vs Strategy（再次强调区别）
- State：状态自动流转，由状态内部决定
- Strategy：算法由客户端选择，策略之间互不知晓

---

## 五、今日自测

1. Observer的推模型和拉模型各自的优缺点？
2. Command模式中四个角色的职责是什么？
3. Composite模式如何实现"对单个和组合对象统一处理"？
4. 设计题：如何用Observer+Composite实现多层级通知系统？

---

## 六、明日预告

Day 05将学习：Adapter（适配器）、Decorator（装饰器）、Facade（外观）、Proxy（代理）、Bridge（桥接）。
