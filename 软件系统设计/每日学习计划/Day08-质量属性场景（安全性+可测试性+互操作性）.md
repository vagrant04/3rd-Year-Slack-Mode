# Day 08: 质量属性与场景（下）—— 安全性 + 可测试性 + 互操作性

> 学习时间：30分钟 | 重要程度：★★★★☆
> 参考资料：复习资料/笔记/系统架构（简）.pdf p15-20, 旧课件/zt-质量属性

---

## 一、安全性 Security

### 1. CIA三要素
| 要素 | 英文 | 含义 |
|------|------|------|
| **机密性** | Confidentiality | 数据不被未授权访问 |
| **完整性** | Integrity | 数据不被未授权修改 |
| **可用性** | Availability | 授权用户能正常访问 |

### 2. 安全性场景示例（2025考试参考）
> 当**外部攻击者**（刺激源）在**正常运行**（环境）下对**用户数据库**（制品）发起**SQL注入攻击**（刺激）时，系统应**检测并阻止攻击、记录日志**（响应），且**99.999%的信用卡交易保持安全**（响应度量）。

### 3. 安全性策略

#### 检测攻击 (Detect Attacks)
| 策略 | 说明 |
|------|------|
| **Detect Intrusion** | 入侵检测系统(IDS) |
| **Detect Service Denial** | 检测DoS攻击 |
| **Verify Message Integrity** | 校验消息完整性(Hash/签名) |
| **Detect Message Delay** | 检测消息延迟（防重放攻击） |

#### 抵抗攻击 (Resist Attacks)
| 策略 | 说明 |
|------|------|
| **Authenticate Users** | 身份认证（密码、证书、生物特征） |
| **Authorize Users** | 访问控制（ACL、RBAC） |
| **Maintain Data Confidentiality** | 加密传输和存储 |
| **Limit Access** | 限制访问（防火墙、DMZ） |
| **Limit Exposure** | 最小暴露面 |

#### 从攻击中恢复 (React/Recover)
| 策略 | 说明 |
|------|------|
| **Revoke Access** | 撤销访问权限 |
| **Lock Computer** | 锁定账户 |
| **Inform Actors** | 通知相关人员 |
| **Audit Trail** | 审计追踪 |

---

## 二、可测试性 Testability

### 1. 核心关注
- 如何容易地发现软件缺陷
- 可观察性：能看到系统的中间状态
- 可控制性：能设置系统到特定状态

### 2. 可测试性场景示例
> 当**测试团队**（刺激源）在**开发阶段**（环境）对**业务逻辑模块**（制品）进行**单元测试**（刺激）时，应**85%以上的代码路径可被测试覆盖**（响应度量）。

### 3. 可测试性策略

#### 控制与观察系统状态
| 策略 | 说明 |
|------|------|
| **Specialized Interfaces** | 专用测试接口 |
| **Record/Playback** | 记录/回放输入 |
| **Localize State Storage** | 状态集中存储便于检查 |
| **Abstract Data Sources** | 抽象数据源（可替换为mock） |
| **Sandbox** | 沙箱隔离测试 |
| **Executable Assertions** | 可执行的断言 |

#### 限制复杂度
| 策略 | 说明 |
|------|------|
| **Limit Structural Complexity** | 限制结构复杂度（低耦合高内聚） |
| **Limit Nondeterminism** | 减少非确定性行为 |

---

## 三、互操作性 Interoperability

### 1. 定义
两个或多个系统在特定环境中有意义地交互信息的能力。

### 2. 两个方面
- **语法互操作性**：数据格式兼容（如JSON、XML）
- **语义互操作性**：数据含义一致

### 3. 互操作性场景示例
> 当**外部支付系统**（刺激源）在**正常运行**（环境）下与**订单系统**（制品）进行**支付确认交互**（刺激）时，系统应**正确解析并处理支付结果**（响应），**99.9%的交互成功完成**（响应度量）。

### 4. 互操作性策略

#### 定位 (Locate)
| 策略 | 说明 |
|------|------|
| **Discover Service** | 服务发现（注册中心） |

#### 管理接口 (Manage Interfaces)
| 策略 | 说明 |
|------|------|
| **Orchestrate** | 编排多个服务的交互 |
| **Tailor Interface** | 定制接口适配不同消费者 |

---

## 四、质量属性之间的权衡（重要考点！）

### 1. 常见权衡关系

| 提高 | 可能降低 | 原因 |
|------|----------|------|
| 性能 | 可修改性 | 性能优化常引入紧耦合 |
| 安全性 | 性能 | 加密、验证增加开销 |
| 安全性 | 易用性 | 安全措施增加操作步骤 |
| 可用性 | 性能 | 冗余/同步机制消耗资源 |
| 可用性 | 安全性 | 更多副本=更多攻击面 |
| 可修改性 | 性能 | 抽象层增加间接开销 |

### 2. ATAM中的权衡点(Tradeoff Point)
- 权衡点是一个架构决策，它**同时影响多个质量属性**
- 正向影响某个属性的同时可能负向影响另一个
- 例："使用加密通信"正向影响安全性，负向影响性能

### 3. 敏感点(Sensitivity Point)
- 敏感点是一个架构决策，该决策的**微小变化**会对**某个质量属性**产生**显著影响**
- 例："数据库连接池大小"是性能的敏感点

---

## 五、质量属性设计决策的七个类别

1. **资源分配** (Allocation of Responsibilities)
2. **协调模型** (Coordination Model)
3. **数据模型** (Data Model)
4. **资源管理** (Management of Resources)
5. **架构元素映射** (Mapping Among Architecture Elements)
6. **绑定时间决策** (Binding Time Decisions)
7. **技术选型** (Choice of Technology)

---

## 六、质量属性场景写作模板（考试直接用！）

### 模板：
```
Source:        [谁/什么触发了这个场景]
Stimulus:      [具体发生了什么事件]
Environment:   [发生时系统处于什么状态]
Artifact:      [系统的哪个部分受到影响]
Response:      [系统应该如何反应]
Response Measure: [如何量化地衡量响应是否满足要求]
```

### 完整示例合集：

**可用性场景**：
```
Source: 硬件故障
Stimulus: 主服务器磁盘故障
Environment: 正常运行时间
Artifact: 数据存储子系统
Response: 系统检测故障，自动切换到备用磁盘，通知运维
Response Measure: 停机时间 < 5分钟, 无数据丢失
```

**性能场景**：
```
Source: 用户群
Stimulus: 1000个并发请求到达
Environment: 正常负载
Artifact: Web应用服务器
Response: 处理请求并返回结果
Response Measure: 平均响应时间 < 2秒, 吞吐量 > 500 TPS
```

**安全性场景**：
```
Source: 未授权用户
Stimulus: 试图访问管理后台
Environment: 正常运行
Artifact: 认证模块
Response: 拒绝访问，记录尝试，3次失败后锁定IP
Response Measure: 100%的未授权访问被阻止
```

---

## 七、今日自测

1. 写出安全性CIA三要素并举例。
2. 什么是敏感点(Sensitivity Point)和权衡点(Tradeoff Point)？
   > 敏感点：对某个属性影响显著的决策点。权衡点：同时影响多个属性的决策点。
3. 为什么提高安全性可能降低性能？举例说明。
   > 加密通信增加CPU计算开销；认证流程增加请求延迟。
4. 用六要素模板写一个互操作性场景。

---

## 八、明日预告

Day 09将学习：架构视图（Module/C&C/Allocation Views），4+1视图模型，视图文档化。
