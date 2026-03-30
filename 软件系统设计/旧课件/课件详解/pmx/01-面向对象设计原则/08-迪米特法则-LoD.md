# 迪米特法则 (LoD)

**页码范围**: 第51-57页
**核心概念**: 最少知识原则，只和朋友通信
**英文**: Law of Demeter (LoD) / Least Knowledge Principle (LKP)
**重要性**: ★★★☆☆

---

## 📄 第51页 - 迪米特法则定义

### 三种定义方式
1. **Don't talk to strangers** (不要和陌生人说话)
2. **Talk only to your immediate friends** (只与你的直接朋友通信)
3. **Each unit should have only limited knowledge about other units: only units "closely" related to the current unit** (每一个软件单位对其他单位都只有最少的知识，局限于密切相关的单位)

### 重点解析
**核心思想**: 降低类之间的耦合，减少交互。

---

## 📄 第52-54页 - 迪米特法则分析

### 来源
- 1987年美国东北大学 (Northeastern University)
- 研究项目名为"Demeter"

### 朋友的定义
对于一个对象，其**朋友**包括：
1. 当前对象本身 (this)
2. 以参数形式传入的对象
3. 当前对象的成员对象
4. 成员对象集合中的元素
5. 当前对象创建的对象

**非朋友** (陌生人):
- 朋友的朋友
- 全局对象
- 通过其他对象获得的对象

### 狭义 vs 广义
**狭义LoD**: 方法调用链不要太长
```java
// ❌ 违反LoD (调用链过长)
a.getB().getC().getD().doSomething();

// ✅ 符合LoD
a.doSomething();  // a内部处理
```

**广义LoD**: 信息隐藏，模块独立

---

## 📄 第55-57页 - 迪米特法则实例

### 实例：界面与DAO解耦

#### 重构前
```
Form1 → DAO1
Form1 → DAO2
Form2 → DAO1
Form2 → DAO3
...
(界面类和数据访问类直接耦合，关系复杂)
```

#### 重构后
```
Form1 →
Form2 → Mediator → DAO1
Form3 →           → DAO2
                  → DAO3
```

通过引入**中介者** (Mediator)，界面类只与中介者通信，不直接访问DAO。

---

## 🎯 迪米特法则总结

### 核心要点
1. ✅ 只和朋友通信，不和陌生人说话
2. ✅ 降低类之间的耦合
3. ✅ 信息隐藏，模块独立

### 实践建议
- 避免长的方法调用链 (`a.b().c().d()`)
- 使用中介者模式解耦复杂交互
- 降低成员变量和方法的访问权限

---
