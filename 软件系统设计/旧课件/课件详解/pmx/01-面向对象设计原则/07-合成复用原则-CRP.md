# 合成复用原则 (CRP)

**页码范围**: 第44-50页
**核心概念**: 组合优于继承
**英文**: Composite Reuse Principle
**重要性**: ★★★★☆

---

## 📄 第44页 - 合成复用原则定义

### 定义
**合成复用原则 (Composite Reuse Principle, CRP)** 又称为**组合/聚合复用原则 (Composition/Aggregate Reuse Principle, CARP)**

**中文**: 尽量使用对象组合，而不是继承来达到复用的目的。
**英文**: Favor composition of objects over inheritance as a reuse mechanism.

### 重点解析
**核心思想**: 用"has-a"关系替代"is-a"关系

---

## 📄 第45-47页 - 合成复用原则分析

### 复用的两种方式

#### 方式1: 继承复用 (白箱复用)
```java
class A { void methodA() { ... } }
class B extends A { void methodB() { ... } }
// B复用了A的methodA
```

✅ **优点**:
- 实现简单
- 易于扩展

❌ **缺点**:
- 破坏封装性 (子类可以访问父类protected成员)
- 静态复用 (编译时确定，运行时无法改变)
- 灵活性不足
- 白箱复用 (子类能看到父类实现细节)

#### 方式2: 组合/聚合复用 (黑箱复用)
```java
class A { void methodA() { ... } }
class B {
    private A a;  // 组合关系
    public B(A a) { this.a = a; }
    public void methodB() {
        a.methodA();  // 委派调用
    }
}
```

✅ **优点**:
- 耦合度低
- 可以选择性调用成员对象的操作
- 可以在运行时动态改变
- 黑箱复用 (不需要知道A的实现细节)

### 何时用继承，何时用组合？

| 使用场景 | 推荐方式 | 原因 |
|---------|---------|------|
| 明确的"is-a"关系 | 继承 | Dog is-a Animal |
| 仅为了复用代码 | 组合 ✅ | 避免不必要的继承 |
| 需要运行时切换实现 | 组合 ✅ | 继承是静态的 |
| 需要复用多个类 | 组合 ✅ | Java不支持多继承 |

---

## 📄 第48-50页 - 合成复用原则实例

### 实例：数据库访问类重构

#### 重构前 (使用继承)
```
DBUtil (数据库连接工具)
   △
   │ extends
   ├─ StudentDAO
   └─ TeacherDAO
```

❌ **问题**:
- 想换数据库连接方式 → 必须修改DBUtil → 影响所有DAO
- StudentDAO用JDBC，TeacherDAO用连接池 → 需要两个DBUtil类
- 违反OCP

#### 重构后 (使用组合)
```
IDBConnection (接口)
   △
   │ implements
   ├─ JDBCConnection
   └─ ConnectionPoolConnection

StudentDAO {
    private IDBConnection conn;  // 组合
}

TeacherDAO {
    private IDBConnection conn;  // 组合
}
```

✅ **好处**:
- DAO类可以灵活选择连接方式
- 新增连接方式不影响DAO
- 符合OCP和DIP

---

## 🎯 合成复用原则总结

### 核心要点
1. ✅ 组合/聚合优于继承
2. ✅ 继承是白箱复用，组合是黑箱复用
3. ✅ 组合更灵活，耦合度更低

### 口诀
> "Favor composition over inheritance"
> 优先使用组合而非继承

---
