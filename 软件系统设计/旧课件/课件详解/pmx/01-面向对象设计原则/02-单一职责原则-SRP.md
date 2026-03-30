# 02-单一职责原则 SRP（第11-17页）

> Single Responsibility Principle
>
> 一个类只负责一个功能领域的职责

---

## 第11页 - 定义

### 📋 单一职责原则定义

**定义方式一**（职责角度）：
- 一个对象应该只包含**单一的职责**，并且该职责被**完整地封装**在一个类中。
- **英文定义**：
  > Every object should have a single responsibility, and that responsibility should be entirely encapsulated by the class.

**定义方式二**（变化角度）：
- 就一个类而言，应该**仅有一个引起它变化的原因**。
- **英文定义**：
  > There should never be more than one reason for a class to change.

### 💡 理解要点

两种定义方式的关联：

```
职责 ⇄ 变化原因
  ↓         ↓
一个职责  =  一个变化原因
多个职责  =  多个变化原因（违反SRP）
```

**"变化原因"的理解**：
- 如果一个类有多个职责
- 当其中一个职责的需求改变时
- 需要修改这个类
- 这就是"一个变化原因"

**举例**：
- ❌ **违反SRP**：User类同时负责用户数据和数据库操作
  - 变化原因1：用户属性改变（如增加字段）
  - 变化原因2：数据库技术改变（从MySQL到PostgreSQL）

- ✅ **符合SRP**：User类只负责用户数据，UserRepository负责数据库操作
  - User类的变化原因：用户属性改变
  - UserRepository的变化原因：数据库技术改变

### ⚠️ 考点

- 能够背诵两种定义方式（中英文）
- 理解"职责"与"变化原因"的对应关系
- 能够识别一个类有几个变化原因

---

## 第12页 - 分析

### 📋 单一职责原则分析

**核心思想**：

一个类（或者大到模块，小到方法）承担的职责越多，它被复用的可能性越小，而且如果一个类承担的职责过多，就相当于将这些职责**耦合**在一起，当其中一个职责变化时，可能会影响其他职责的运作。

### 💡 职责的分类

类的职责主要包括**两个方面**：

1. **数据职责（Data Responsibility）**
   - 通过**属性**来体现
   - 例如：`String name`, `int age`

2. **行为职责（Behavior Responsibility）**
   - 通过**方法**来体现
   - 例如：`void save()`, `void validate()`

### 💡 为什么职责越多，复用性越低？

**场景示例**：
```java
// 职责混杂的类（难以复用）
class User {
    String name;
    String email;

    void saveToMySQL() { /* ... */ }      // 职责1：MySQL持久化
    void sendEmailViaSMTP() { /* ... */ } // 职责2：SMTP邮件发送
    void renderHTML() { /* ... */ }       // 职责3：HTML渲染
}

// 问题：如果另一个模块只需要用户数据和邮件发送，
// 但不需要HTML渲染，还必须依赖整个User类
```

**职责分离后（易于复用）**：
```java
class User {
    String name;
    String email;
}

class UserRepository {
    void save(User user) { /* MySQL */ }
}

class EmailService {
    void send(User user) { /* SMTP */ }
}

class UserView {
    void render(User user) { /* HTML */ }
}

// 现在可以单独复用任何一个类
```

### 💡 职责耦合的问题

**问题链示意图**：
```
┌─────────────────────────────────────┐
│  User类（混合职责）                  │
├─────────────────────────────────────┤
│  - 数据职责                          │
│  - 持久化职责  ← 数据库技术改变      │
│  - 邮件职责                          │
│  - 渲染职责                          │
└─────────────────────────────────────┘
         ↓
   修改持久化代码
         ↓
   可能影响 → 邮件职责的运作
         ↓
   可能影响 → 渲染职责的运作
```

### 🎯 单一职责原则的作用

SRP是实现**高内聚、低耦合**的指导方针：
- **高内聚**：一个类的所有方法都围绕同一个职责
- **低耦合**：不同职责之间通过接口交互，而非混在一起

### ⚠️ 应用难点

单一职责原则是**最简单但又最难运用**的原则，需要设计人员：
1. **发现**类的不同职责
2. **分离**这些职责到不同的类
3. 需要较强的**分析设计能力**和相关**重构经验**

**为什么难？**
- 职责的粒度难以把握（太粗或太细）
- 领域知识不足时难以识别职责边界
- 需要在理想设计和实用性之间平衡

### 💡 职责粒度的把握

**过粗**（违反SRP）：
```java
class SystemManager {
    void manageUsers() { /* ... */ }
    void manageOrders() { /* ... */ }
    void generateReports() { /* ... */ }
}
// 职责太多，应该拆分
```

**过细**（过度设计）：
```java
class UserNameGetter {
    String getName(User user) { return user.name; }
}
class UserNameSetter {
    void setName(User user, String name) { user.name = name; }
}
// 拆分过度，增加复杂度
```

**合适**（符合SRP）：
```java
class User {
    private String name;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
// 职责单一：管理用户数据
```

---

## 第13页 - 实例说明

### 📋 实例背景

某基于Java的C/S系统的"登录功能"通过如下登录类（Login）实现。

**问题**：现使用单一职责原则对其进行重构。

---

## 第16页 - UML图（违反SRP）

### 🖼️ Login类结构图

```
┌─────────────────────────────────────────┐
│              Login                      │
├─────────────────────────────────────────┤
│ + init() : void                         │
│ + display() : void                      │
│ + validate() : void                     │
│ + getConnection() : Connection          │
│ + findUser(String userName,             │
│            String userPassword): boolean│
│ + main(String args[]) : void            │
└─────────────────────────────────────────┘
```

### 📊 职责分析

这个Login类违反了SRP，因为它包含了**至少5种职责**：

| 方法 | 职责类型 | 说明 |
|-----|---------|------|
| `init()` | 界面初始化 | 初始化登录界面组件 |
| `display()` | 界面显示 | 显示登录窗口 |
| `validate()` | 业务逻辑 | 验证用户输入的合法性 |
| `getConnection()` | 数据库连接 | 获取数据库连接对象 |
| `findUser(...)` | 数据访问 | 从数据库查询用户 |
| `main(...)` | 程序入口 | 启动应用程序 |

### 💡 问题识别

**变化原因分析**：

1. **界面改变** → 需要修改`init()`和`display()`
2. **验证规则改变** → 需要修改`validate()`
3. **数据库技术改变** → 需要修改`getConnection()`
4. **数据访问方式改变** → 需要修改`findUser()`
5. **程序启动方式改变** → 需要修改`main()`

**一个类有5个变化原因** → 严重违反SRP ❌

### 🔴 代码坏味道

```java
// 违反SRP的Login类（示例代码）
public class Login {
    // 界面职责
    public void init() {
        // 初始化文本框、按钮等组件
    }

    public void display() {
        // 显示登录窗口
    }

    // 验证职责
    public void validate() {
        // 验证用户名密码格式
    }

    // 数据库连接职责
    public Connection getConnection() {
        return DriverManager.getConnection(
            "jdbc:mysql://localhost:3306/db", "root", "password");
    }

    // 数据访问职责
    public boolean findUser(String userName, String userPassword) {
        Connection conn = getConnection();
        // SQL查询用户
        return true; // 简化
    }

    // 程序入口职责
    public static void main(String[] args) {
        Login login = new Login();
        login.init();
        login.display();
    }
}
```

### ⚠️ 问题总结

| 问题 | 影响 |
|-----|------|
| **低内聚** | 一个类做了太多事情 |
| **高耦合** | 界面、业务、数据库混在一起 |
| **难复用** | 想复用数据访问逻辑，却必须带上界面代码 |
| **难维护** | 修改界面可能影响数据库代码 |
| **难测试** | 无法单独测试数据访问逻辑 |

---

## 第17页 - UML图（符合SRP）

### 🖼️ 重构后的类结构图

```
┌────────────────────────────┐
│       MainClass            │
├────────────────────────────┤
│ + main(String args[]): void│
└────────────────────────────┘
         │
         │ (依赖)
         ↓
┌────────────────────────────┐
│       LoginForm            │
├────────────────────────────┤
│ - dao : UserDAO            │
├────────────────────────────┤
│ + init() : void            │
│ + display() : void         │
│ + validate() : void        │
└────────────────────────────┘
         │
         │ (依赖)
         ↓
┌────────────────────────────┐
│       UserDAO              │
├────────────────────────────┤
│ - db : DBUtil              │
├────────────────────────────┤
│ + findUser(String userName,│
│   String userPassword)     │
│   : boolean                │
└────────────────────────────┘
         │
         │ (依赖)
         ↓
┌────────────────────────────┐
│       DBUtil               │
├────────────────────────────┤
│ + getConnection()          │
│   : Connection             │
└────────────────────────────┘
```

### 📊 职责分离分析

重构后，原来的Login类被拆分为**4个类**，各司其职：

| 类名 | 职责 | 变化原因 | SRP |
|-----|------|---------|-----|
| **MainClass** | 程序入口 | 启动方式改变 | ✅ |
| **LoginForm** | 界面显示和验证 | 界面或验证规则改变 | ✅ |
| **UserDAO** | 数据访问 | 数据访问方式改变 | ✅ |
| **DBUtil** | 数据库连接 | 数据库技术改变 | ✅ |

**依赖链**：
```
MainClass → LoginForm → UserDAO → DBUtil
  (入口)     (界面层)    (数据访问层) (数据库工具层)
```

### 💡 重构后的代码示例

```java
// 1. 程序入口类
public class MainClass {
    public static void main(String[] args) {
        LoginForm form = new LoginForm();
        form.init();
        form.display();
    }
}

// 2. 界面类（单一职责：界面显示和验证）
public class LoginForm {
    private UserDAO dao = new UserDAO();

    public void init() {
        // 初始化界面组件
    }

    public void display() {
        // 显示登录窗口
    }

    public void validate() {
        // 验证输入格式
        String username = getUsernameFromUI();
        String password = getPasswordFromUI();

        if (username.isEmpty() || password.isEmpty()) {
            showError("用户名或密码不能为空");
            return;
        }

        // 调用DAO进行验证
        boolean success = dao.findUser(username, password);
        if (success) {
            showSuccess("登录成功");
        } else {
            showError("用户名或密码错误");
        }
    }
}

// 3. 数据访问类（单一职责：用户数据访问）
public class UserDAO {
    private DBUtil db = new DBUtil();

    public boolean findUser(String userName, String userPassword) {
        Connection conn = db.getConnection();
        try {
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT * FROM users WHERE username=? AND password=?");
            stmt.setString(1, userName);
            stmt.setString(2, userPassword);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}

// 4. 数据库工具类（单一职责：数据库连接管理）
public class DBUtil {
    public Connection getConnection() {
        try {
            return DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/db",
                "root",
                "password");
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}
```

### ✅ 重构效果对比

| 维度 | 重构前（Login类） | 重构后（4个类） |
|-----|-----------------|---------------|
| **内聚性** | ❌ 低内聚（5种职责混杂） | ✅ 高内聚（每个类一种职责） |
| **耦合度** | ❌ 高耦合（所有职责耦合在一起） | ✅ 低耦合（通过依赖关联） |
| **可复用性** | ❌ 难复用（想用数据访问必须带界面） | ✅ 易复用（DBUtil可独立复用） |
| **可维护性** | ❌ 修改界面可能影响数据库 | ✅ 修改界面不影响数据库 |
| **可测试性** | ❌ 难以单独测试某个功能 | ✅ 可以单独测试每个类 |
| **变化原因** | ❌ 5个变化原因 | ✅ 每个类1个变化原因 |

### 🎯 设计模式体现

重构后的设计体现了几个模式思想：

1. **分层架构（Layered Architecture）**
   ```
   表现层：LoginForm
      ↓
   业务层：（本例中简化）
      ↓
   数据访问层：UserDAO
      ↓
   工具层：DBUtil
   ```

2. **DAO模式（Data Access Object）**
   - UserDAO封装了所有数据库访问逻辑
   - LoginForm不需要知道数据如何存储

3. **依赖注入思想**（可进一步改进）
   ```java
   // 进一步改进：通过构造函数注入
   public class LoginForm {
       private UserDAO dao;

       public LoginForm(UserDAO dao) {
           this.dao = dao;  // 依赖注入
       }
   }
   ```

### 💡 SRP与其他原则的关系

在这个重构案例中，我们还隐含地应用了其他原则：

1. **与OCP的关系**
   - 通过职责分离，系统更容易扩展
   - 例如：可以轻松增加新的DAO（TeacherDAO）

2. **与DIP的关系**（可进一步改进）
   - 可以让LoginForm依赖抽象的IUserDAO接口
   - 而不是具体的UserDAO类

3. **与LoD的关系**
   - LoginForm不直接访问DBUtil
   - 通过UserDAO作为中介

---

## 🎯 本章总结

### 核心要点

1. **SRP定义**
   - 一个类只有一个职责
   - 只有一个引起变化的原因

2. **职责的识别**
   - 数据职责（属性）
   - 行为职责（方法）
   - 通过"变化原因"来判断

3. **违反SRP的后果**
   - 低内聚、高耦合
   - 难复用、难维护、难测试

4. **重构手法**
   - 识别不同的职责
   - 将职责分离到不同的类
   - 建立合理的依赖关系

### 记忆技巧

**SRP口诀**：
> **"一类一责，各司其职"**

**判断方法**：
> **"问自己：这个类有几个变化原因？"**
> - 1个 → 符合SRP ✅
> - 多个 → 违反SRP ❌

### 常见误区

❌ **误区1**：类越小越好
- SRP不是让你无限拆分类
- 要在单一职责和过度设计之间平衡

❌ **误区2**：一个类只能有一个方法
- 一个职责可以由多个方法共同完成
- 例如：LoginForm的init()、display()、validate()都属于"界面职责"

❌ **误区3**：职责等于层次
- 职责是逻辑概念，层次是架构概念
- 同一层次中的类也可能有不同职责

### ⚠️ 考点汇总

1. **定义题**：默写SRP的两种定义（中英文）
2. **识别题**：给出类图，判断是否违反SRP
3. **重构题**：给出违反SRP的代码，要求重构
4. **论述题**：说明SRP的重要性和应用难点
5. **综合题**：SRP与其他原则的关系

### 下一章预告

[03-开闭原则-OCP.md](./03-开闭原则-OCP.md) 将介绍面向对象设计的**终极目标**：
- 为什么说OCP是最重要的原则？
- 如何做到"对扩展开放，对修改关闭"？
- 按钮系统的重构实例（第19、22页UML图）

---

**返回**: [README.md](./README.md) | **导航**: [00-导航.md](./00-导航.md) | **上一章**: [01-课程引入与基础.md](./01-课程引入与基础.md) | **下一章**: [03-开闭原则-OCP.md](./03-开闭原则-OCP.md)
