# 07-合成复用原则 CRP（第44-50页）

> Composite Reuse Principle
>
> 优先使用组合/聚合，少用继承

---

## 核心定义

### 📋 合成复用原则定义（第44页）

**合成复用原则**（Composite Reuse Principle, CRP）
又称为**组合/聚合复用原则**（Composition/Aggregate Reuse Principle, CARP）

**定义**：
- 尽量使用**对象组合**，而不是**继承**来达到复用的目的

**英文定义**：
> Favor composition of objects over inheritance as a reuse mechanism.

### 💡 理解要点

**什么是组合/聚合？**
- 在一个新的对象里通过**关联关系**来使用一些已有的对象
- 使之成为新对象的一部分
- 新对象通过**委派调用**已有对象的方法达到复用功能的目的

**简言之**：
> **尽量使用组合/聚合关系，少用继承**

---

## 继承 vs 组合

### 📋 两种复用方式对比（第45-48页）

在面向对象设计中，可以通过两种基本方法在不同的环境中复用已有的设计和实现：
1. **继承复用**（Inheritance）
2. **组合/聚合复用**（Composition/Aggregation）

**继承复用**（白箱复用）：
- ✅ **优点**：
  - 实现简单
  - 易于扩展
- ❌ **缺点**：
  - 破坏系统的**封装性**
  - 从基类继承而来的实现是**静态的**，不可能在运行时发生改变
  - 没有足够的**灵活性**
  - 只能在**有限的环境**中使用

**组合/聚合复用**（黑箱复用）：
- ✅ **优点**：
  - **耦合度相对较低**
  - **选择性地**调用成员对象的操作
  - 可以在**运行时动态**进行
- ⚠️ **缺点**：
  - 需要定义更多的对象和接口

### 💡 白箱复用 vs 黑箱复用

**白箱复用（继承）**：
```
┌──────────────┐
│   父类       │  ← 内部实现可见（白箱）
│  (实现细节)  │
└──────────────┘
      △
      │ 继承
┌──────────────┐
│   子类       │  ← 可以看到父类内部
└──────────────┘
```

**黑箱复用（组合）**：
```
┌──────────────┐
│   组件       │  ← 内部实现不可见（黑箱）
│  (实现细节)  │
└──────────────┘
      ↑
      │ 持有
┌──────────────┐
│   使用者     │  ← 只能通过接口访问
└──────────────┘
```

---

## 实例解析

### 🖼️ 继承方式（第45页）- 违反CRP

**原始设计（使用继承）**：

```
      DBUtil  ← 红框标注
      └─ getConnection(): Connection
           △
           │ 继承
      ┌────┴────┐
      │         │
StudentDAO      TeacherDAO
├─ findStudentById()  ├─ findTeacherById()
└─ addStudent()       └─ setTeacherInfo()
```

**问题分析**：

1. **破坏封装**
   ```java
   class DBUtil {
       protected Connection getConnection() {
           // 数据库连接逻辑
       }
   }

   class StudentDAO extends DBUtil {
       void save(Student s) {
           Connection conn = getConnection();  // 可以直接访问父类实现
           // ❌ 子类知道了父类的实现细节
       }
   }
   ```

2. **静态绑定**
   - 继承关系在编译时确定
   - 运行时无法改变数据库连接方式

3. **耦合度高**
   - StudentDAO和TeacherDAO都紧密依赖DBUtil的实现
   - DBUtil的变化会影响所有子类

**代码示例（违反CRP）**：
```java
// ❌ 使用继承复用
class DBUtil {
    protected Connection getConnection() {
        return DriverManager.getConnection("jdbc:mysql://...");
    }
}

class StudentDAO extends DBUtil {
    void findStudentById(int id) {
        Connection conn = getConnection();  // 继承来的方法
        // 查询学生
    }

    void addStudent(Student s) {
        Connection conn = getConnection();
        // 添加学生
    }
}

class TeacherDAO extends DBUtil {
    void findTeacherById(int id) {
        Connection conn = getConnection();
        // 查询教师
    }

    void setTeacherInfo(Teacher t) {
        Connection conn = getConnection();
        // 更新教师
    }
}

// ❌ 问题：如果需要更换数据库连接方式
// 必须修改DBUtil或创建新的父类
```

### 🖼️ 组合方式（第47页）- 符合CRP

**重构后设计（使用组合）**：

```
      NewDBUtil
      └─ getConnection(): Connection
           △
           │ 继承
      ┌────┴────┐
  DBUtil      (其他实现)

StudentDAO
├─ dbOperator: DBUtil  ← 组合关系✅
├─ findStudentById()
├─ addStudent()
└─ save(StudentDTO): int

TeacherDAO
├─ dbOperator: DBUtil  ← 组合关系✅
├─ findTeacherById()
├─ setTeacherInfo()
└─ save(TeacherDTO): int
```

**代码示例（符合CRP）**：
```java
// ✅ 使用组合复用
class DBUtil {
    public Connection getConnection() {
        return DriverManager.getConnection("jdbc:mysql://...");
    }
}

class StudentDAO {
    private DBUtil dbOperator;  // ✅ 组合关系

    public StudentDAO() {
        this.dbOperator = new DBUtil();
    }

    // ✅ 也可以通过setter注入，更灵活
    public void setDbOperator(DBUtil dbOperator) {
        this.dbOperator = dbOperator;
    }

    void findStudentById(int id) {
        Connection conn = dbOperator.getConnection();  // 委派调用
        // 查询学生
    }

    void addStudent(Student s) {
        Connection conn = dbOperator.getConnection();
        // 添加学生
    }

    int save(StudentDTO dto) {
        Connection conn = dbOperator.getConnection();
        // 保存学生
        return 1;
    }
}

class TeacherDAO {
    private DBUtil dbOperator;  // ✅ 组合关系

    public TeacherDAO() {
        this.dbOperator = new DBUtil();
    }

    public void setDbOperator(DBUtil dbOperator) {
        this.dbOperator = dbOperator;
    }

    void findTeacherById(int id) {
        Connection conn = dbOperator.getConnection();
        // 查询教师
    }

    void setTeacherInfo(Teacher t) {
        Connection conn = dbOperator.getConnection();
        // 更新教师
    }

    int save(TeacherDTO dto) {
        Connection conn = dbOperator.getConnection();
        // 保存教师
        return 1;
    }
}

// ✅ 优点：可以在运行时切换数据库连接方式
StudentDAO dao = new StudentDAO();
dao.setDbOperator(new ConnectionPoolDBUtil());  // 运行时切换
```

### ✅ 重构效果对比

| 维度 | 继承方式 | 组合方式 |
|-----|---------|---------|
| **封装性** | ❌ 破坏（白箱） | ✅ 良好（黑箱） |
| **灵活性** | ❌ 静态绑定 | ✅ 运行时可变 |
| **耦合度** | ❌ 高 | ✅ 低 |
| **可维护性** | ❌ 父类变化影响所有子类 | ✅ 组件变化影响小 |
| **可扩展性** | ⚠️ 通过继承扩展 | ✅ 通过替换组件扩展 |
| **符合CRP** | ❌ | ✅ |

---

## CRP的深入理解

### 📋 组合/聚合的优势（第49-50页）

组合/聚合可以使系统更加灵活：
- 类与类之间的**耦合度降低**
- 一个类的变化对其他类造成的影响**相对较少**
- 因此一般**首选使用组合/聚合来实现复用**

**继承的使用原则**：
- 其次才考虑继承
- 在使用继承时，需要**严格遵循里氏代换原则**
- 有效使用继承会有助于对问题的理解，降低复杂度
- 而**滥用继承**反而会增加系统构建和维护的难度以及系统的复杂度
- 因此需要**慎重使用继承复用**

### 💡 何时使用继承？

**应该使用继承的情况**：
1. **is-a关系**（是一个）
   - Student **is a** Person ✅
   - Student **is a** Database ❌

2. **符合LSP**
   - 子类可以完全替换父类
   - 不破坏父类的行为

3. **确实需要多态**
   - 需要通过父类引用统一处理不同子类

**应该使用组合的情况**：
1. **has-a关系**（有一个）
   - Student **has a** Address ✅
   - StudentDAO **has a** DBUtil ✅

2. **复用功能**
   - 只是想复用某个类的功能
   - 不是真正的"是一个"关系

3. **需要灵活性**
   - 需要在运行时切换实现
   - 需要降低耦合度

---

## 本章总结

### 核心要点

1. **CRP定义**
   - 优先使用组合/聚合
   - 少用继承

2. **继承 vs 组合**
   - 继承：白箱复用，静态，耦合高
   - 组合：黑箱复用，动态，耦合低

3. **使用原则**
   - 首选组合/聚合
   - 慎用继承
   - 继承时遵循LSP

4. **重构方向**
   - 将继承改为组合
   - 通过setter注入组件
   - 提高灵活性

### 记忆口诀

> **"组合优于继承"**

> **"Has-a用组合，Is-a用继承"**

> **"黑箱胜白箱，组合胜继承"**

### 判断方法

```
问自己："这是'有一个'关系还是'是一个'关系？"
- 有一个 → 用组合 ✅
- 是一个 → 用继承（但要谨慎）

问自己："需要运行时灵活切换吗？"
- 需要 → 用组合 ✅
- 不需要 → 可以用继承

问自己："子类真的能替换父类吗？"
- 能 → 可以用继承
- 不能 → 用组合 ✅
```

### ⚠️ 考点

1. 背诵CRP定义
2. 继承 vs 组合的对比
3. DAO类的重构（第45、47页）
4. 何时用继承，何时用组合
5. CRP与LSP的关系

---

**返回**: [README.md](./README.md) | **上一章**: [06-接口隔离原则-ISP.md](./06-接口隔离原则-ISP.md) | **下一章**: [08-迪米特法则-LoD.md](./08-迪米特法则-LoD.md)
