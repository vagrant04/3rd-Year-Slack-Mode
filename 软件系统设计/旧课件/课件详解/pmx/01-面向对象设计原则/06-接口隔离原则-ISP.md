# 06-接口隔离原则 ISP（第38-43页）

> Interface Segregation Principle
>
> 使用多个专门的接口，不使用单一总接口

---

## 核心定义

### 📋 接口隔离原则定义（第38页）

**定义方式一**：
- 客户端不应该依赖那些它不需要的接口

**英文定义**：
> Clients should not be forced to depend upon interfaces that they do not use.

**注意**：在该定义中的**接口**指的是所定义的**方法**。

**定义方式二**：
- 一旦一个接口太大，则需要将它**分割**成一些更细小的接口
- 使用该接口的客户端仅需知道与之相关的方法即可

**英文定义**：
> Once an interface has gotten too 'fat' it needs to be split into smaller and more specific interfaces so that any clients of the interface will only know about the methods that pertain to them.

### 💡 理解要点

**什么是"胖接口"（Fat Interface）？**
- 一个接口包含太多方法
- 不同客户端只需要其中一部分方法
- 但被迫依赖整个接口

**接口隔离的核心思想**：
- 使用**多个专门的接口**，而不使用**单一的总接口**
- 每一个接口应该承担一种**相对独立的角色**
- 不多不少，不干不该干的事，该干的事都要干

---

## 分析要点

### 📋 ISP的两个角度（第39-41页）

**角度1：角色隔离原则**
- 一个接口就只代表一个**角色**
- 每个角色都有它特定的一个接口
- 此时这个原则可以叫做"**角色隔离原则**"

**角度2：客户端最小接口**
- 接口仅仅提供客户端**需要的行为**，即所需的方法
- 客户端不需要的行为则**隐藏**起来
- 应当为客户端提供**尽可能小的单独的接口**
- 而不要提供大的总接口

### 💡 ISP的应用原则

**与SRP的关系**：
- 使用接口隔离原则拆分接口时，首先必须**满足单一职责原则**
- 将一组相关的操作定义在一个接口中
- 且在满足**高内聚**的前提下，接口中的方法**越少越好**

**定制服务**：
- 可以在进行系统设计时采用**定制服务**的方式
- 即为不同的客户端提供**宽窄不同的接口**
- 只提供用户需要的行为，而隐藏用户不需要的行为

---

## 实例解析

### 🖼️ 胖接口问题（第39页）

**原始设计（违反ISP）**：

```
Client1 ──┐
Client2 ──┼──→ AbstractService
Client3 ──┘     ├─ operationA(): void
                ├─ operationB(): void
                └─ operationC(): void
```

**问题**：
- Client1只需要operationA和operationB
- Client2只需要operationC
- Client3只需要operationA和operationC
- 但都依赖整个AbstractService接口

**代码示例**：
```java
// ❌ 胖接口
interface AbstractService {
    void operationA();
    void operationB();
    void operationC();
}

class Client1 {
    void doSomething(AbstractService service) {
        service.operationA();
        service.operationB();
        // 不需要operationC，但被迫依赖
    }
}

class Client2 {
    void doSomething(AbstractService service) {
        service.operationC();
        // 不需要A和B，但被迫依赖
    }
}
```

### 🖼️ 接口拆分后（第40页）

**重构后设计（符合ISP）**：

```
Client1 ──→ AbstractServiceA
            ├─ operationA(): void
            └─ operationB(): void

Client2 ──→ AbstractServiceB
            └─ operationC(): void

Client3 ──→ AbstractServiceC
            ├─ operationA(): void
            └─ operationC(): void

ConcreteService implements
  AbstractServiceA,
  AbstractServiceB,
  AbstractServiceC
```

**代码示例**：
```java
// ✅ 拆分后的专门接口
interface AbstractServiceA {
    void operationA();
    void operationB();
}

interface AbstractServiceB {
    void operationC();
}

interface AbstractServiceC {
    void operationA();
    void operationC();
}

// 具体实现类实现所有接口
class ConcreteService implements
    AbstractServiceA,
    AbstractServiceB,
    AbstractServiceC {

    public void operationA() { /* ... */ }
    public void operationB() { /* ... */ }
    public void operationC() { /* ... */ }
}

// 客户端只依赖需要的接口
class Client1 {
    void doSomething(AbstractServiceA service) {
        service.operationA();
        service.operationB();
        // ✅ 不依赖operationC
    }
}

class Client2 {
    void doSomething(AbstractServiceB service) {
        service.operationC();
        // ✅ 不依赖A和B
    }
}
```

### ✅ 重构效果

| 维度 | 重构前 | 重构后 |
|-----|-------|-------|
| **接口数量** | 1个胖接口 | 3个专门接口 |
| **依赖精度** | 粗粒度（全依赖） | 细粒度（按需依赖） |
| **耦合度** | 高（依赖不需要的方法） | 低（只依赖需要的） |
| **灵活性** | 低（接口变化影响所有客户端） | 高（只影响相关客户端） |
| **符合ISP** | ❌ | ✅ |

---

## 本章总结

### 核心要点

1. **ISP定义**
   - 客户端不应该依赖不需要的接口
   - 拆分胖接口为多个专门接口

2. **两个角度**
   - 角色隔离：一个接口一个角色
   - 客户端定制：为不同客户端提供专门接口

3. **拆分原则**
   - 必须满足SRP（单一职责）
   - 满足高内聚
   - 接口方法越少越好

4. **与其他原则的关系**
   - ISP是SRP在接口层面的应用
   - ISP支持OCP（接口变化影响范围小）

### 记忆口诀

> **"胖接口拆分，客户端定制"**

> **"不要强迫客户端依赖不需要的方法"**

### ⚠️ 考点

1. 背诵ISP定义
2. 识别胖接口问题
3. 接口拆分的方法
4. ISP与SRP的关系

---

**返回**: [README.md](./README.md) | **上一章**: [05-依赖倒转原则-DIP.md](./05-依赖倒转原则-DIP.md) | **下一章**: [07-合成复用原则-CRP.md](./07-合成复用原则-CRP.md)
