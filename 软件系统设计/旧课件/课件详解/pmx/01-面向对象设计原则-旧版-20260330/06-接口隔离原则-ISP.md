# 接口隔离原则 (ISP)

**页码范围**: 第38-43页
**核心概念**: 使用多个专门的接口，而不是单一总接口
**英文**: Interface Segregation Principle
**重要性**: ★★☆☆☆

---

## 📄 第38页 - 接口隔离原则定义

### 定义
**中文**: 客户端不应该依赖那些它不需要的接口。
**英文**: Clients should not be forced to depend upon interfaces that they do not use.

**注意**: 这里的"接口"指的是所定义的**方法**。

**另一种定义**:
一旦一个接口太大，则需要将它分割成一些更细小的接口，使用该接口的客户端仅需知道与之相关的方法即可。

### 重点解析
**核心思想**: 接口要"小而专"，不要"大而全"。

**"胖接口"问题**:
```java
// ❌ 胖接口
interface IService {
    void methodA();
    void methodB();
    void methodC();
    void methodD();
    void methodE();
}

// Client1只需要methodA和methodB
class Client1 implements IService {
    public void methodA() { /* 实现 */ }
    public void methodB() { /* 实现 */ }
    public void methodC() { /* 空实现，不需要 */ }
    public void methodD() { /* 空实现，不需要 */ }
    public void methodE() { /* 空实现，不需要 */ }
}
```

❌ **问题**: Client1被迫实现它不需要的方法！

### 考点提示
⚠️ ISP的定义和"胖接口"的问题

---

## 📄 第39-40页 - 接口隔离原则分析

### 内容要点
**接口隔离**是指:
- 使用**多个专门的接口**，而不使用**单一的总接口**
- 每一个接口应该承担一种**相对独立的角色**，不多不少，不干不该干的事，该干的事都要干

**两个维度**:
1. **角色隔离**: 一个接口代表一个角色
2. **需求隔离**: 接口仅提供客户端需要的行为

### 拆分原则
✅ **接口拆分时**:
- 首先必须满足**单一职责原则**
- 在满足**高内聚**的前提下，接口中的方法**越少越好**
- 采用**定制服务**的方式，为不同的客户端提供不同的接口

### 示例
```java
// ❌ 胖接口
interface IWorker {
    void work();
    void eat();
    void sleep();
}

// ✅ 拆分后
interface IWorkable {
    void work();
}

interface IFeedable {
    void eat();
}

interface ISleepable {
    void sleep();
}

// 人类实现所有接口
class Human implements IWorkable, IFeedable, ISleepable {
    public void work() { ... }
    public void eat() { ... }
    public void sleep() { ... }
}

// 机器人只实现工作接口
class Robot implements IWorkable {
    public void work() { ... }
    // 不需要eat和sleep
}
```

---

## 📄 第41-43页 - 接口隔离原则实例

### 实例：胖接口AbstractService重构

#### 重构前 (违反ISP)
```
Client1 →
Client2 → AbstractService (胖接口)
Client3 →

AbstractService {
    + methodA()
    + methodB()
    + methodC()
    + methodD()
    + methodE()
}

问题:
- Client1只需要methodA和methodB
- Client2只需要methodC
- Client3只需要methodD和methodE
- 但都被迫依赖整个胖接口
```

#### 重构后 (符合ISP)
```
Client1 → IServiceA { methodA(), methodB() }
Client2 → IServiceB { methodC() }
Client3 → IServiceC { methodD(), methodE() }

ServiceImpl implements IServiceA, IServiceB, IServiceC {
    // 实现所有方法
}
```

✅ **好处**:
- 每个客户端只依赖它需要的接口
- 接口变化影响范围小
- 客户端职责清晰

### 考点提示
⚠️ 胖接口拆分是ISP的典型案例

---

## 🎯 接口隔离原则总结

### 核心要点
1. ✅ 使用多个专门接口，不用单一总接口
2. ✅ 客户端不应该依赖它不需要的接口
3. ✅ 接口要"小而专"，满足单一职责

### ISP vs SRP
- **SRP**: 关注类的职责
- **ISP**: 关注接口的粒度
- 都强调"小而专一"

### 实践建议
- 接口方法数量一般不超过5个
- 如果接口超过10个方法 → 考虑拆分
- 根据客户端需求设计接口

---
