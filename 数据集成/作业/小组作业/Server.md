# 服务器环境配置

## 当前状态

- 已成功在服务器上加载镜像并启动容器：`bigdata`（基于 `bigdata-ubuntu:1.0`）。
- 容器内已安装：JDK 8、Hadoop 3.3.6、Spark 3.3.4、Flink 1.17.2、Kafka 2.1.0、Zookeeper 3.7.2、ClickHouse 26.4。
- **容器内 SSH 尚需手动启动**。

## 服务器与账号

- 服务器：`10.60.254.41`
- 登录用户：`root`
- 密码：`LIUfeng@914`
- 只能使用无线网访问服务器。

## 登录服务器

```bash
ssh root@10.60.254.41
```

## 进入容器

```bash
docker exec -it bigdata bash
```

## 启动容器内 SSH

```bash
mkdir -p /run/sshd
service ssh start
```

## 环境变量位置

```text
/etc/profile.d/bigdata.sh
```
（已包含 JAVA/Hadoop/Spark/Flink/Kafka/Zookeeper 的路径）

## 版本检查

```bash
source /etc/profile.d/bigdata.sh
hadoop version | head -n 1
spark-submit --version 2>&1 | head -n 2
flink --version
kafka-topics.sh --version
zkServer.sh --version
clickhouse-client --version
```

## 容器内服务启动

### ClickHouse

```bash
service clickhouse-server start
clickhouse-client --version
```

### Zookeeper

```bash
/opt/zookeeper/bin/zkServer.sh start
```

### Kafka（依赖 Zookeeper）

```bash
/opt/kafka/bin/kafka-server-start.sh -daemon /opt/kafka/config/server.properties
```

### Flink（本地模式）

```bash
/opt/flink/bin/start-cluster.sh
```
