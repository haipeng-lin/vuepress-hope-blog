---
title: 轻量级日志：loki+grafana
date: 2025-09-25
article: false
---

## 前言

一个简单的 SpringBoot 项目部署到生产环境上，不免有些情况会出现测试中没有测出来的问题 bug，这时候日志记录就显得非常重要。常用的日志监控的框架有 ELK ，但是该框架占用服务器的资源有点过高，不适合轻量级的需求，为此，我们选用了另一种轻量级日志记录：loki 负责记录日志，grafana 负责检索日志。

## 1.日志组件

|          | Loki                                         | Loki4j                   | Grafana                      |
| -------- | -------------------------------------------- | ------------------------ | ---------------------------- |
| 描述     | 一个开源的日志聚合系统                       | 一个基于 Java 的日志框架 | 款开源的数据可视化和分析平台 |
| 特点     | 标签查询<br />无索引日志存储<br />多租户支持 | 易于集成<br />标签支持   | 数据可视化                   |
| 使用场景 | 大规模日志收集、实时日志查询                 |                          | IT 运维监控<br />日志分析    |

## 2.下载安装

以下为 linux 环境进行安装

- Loki：2.9.9
- Grafana：11.1.3

### 2.1 安装 Loki

- Loki 下载地址：[Loki ](https://github.com/grafana/loki/releases/)
- 下载：loki-linux-amd64.zip，并解压缩
- 在该目录下新建文件夹 config ，新增文件 loki-config.yaml

```yaml
server:
  # Loki 服务监听的 HTTP 端口号
  http_listen_port: 3100

schema_config:
  configs:
    - from: 2025-09-05
      # 使用 BoltDB 作为索引存储
      store: boltdb
      # 使用文件系统作为对象存储
      object_store: filesystem
      # 使用 v11 版本的 schema
      schema: v11
      index:
        # 索引前缀
        prefix: index_
        # 索引周期为 24 小时
        period: 24h

ingester:
  lifecycler:
    # 设置本地 IP 地址
    address: 192.168.1.1
    ring:
      kvstore:
        # 使用内存作为 kvstore
        store: inmemory
      # 复制因子设置为 1
      replication_factor: 1
    # 生命周期结束后的休眠时间
    final_sleep: 0s
  # chunk 的空闲期为 5 分钟
  chunk_idle_period: 5m
  # chunk 的保留期为 30 秒
  chunk_retain_period: 30s

storage_config:
  boltdb:
    # BoltDB 的存储路径
    directory: /usr/software/loki-2.9.9/BoltDB
  filesystem:
    # 文件系统的存储路径
    directory: /usr/software/loki-2.9.9/fileStore

limits_config:
  # 不强制执行指标名称
  enforce_metric_name: false
  # 拒绝旧样本
  reject_old_samples: true
  # 最大拒绝旧样本的年龄为 168 小时
  reject_old_samples_max_age: 168h
  # 每个用户每秒的采样率限制为 32 MB
  ingestion_rate_mb: 32
  # 每个用户允许的采样突发大小为 64 MB
  ingestion_burst_size_mb: 64

chunk_store_config:
  # 最大可查询历史日期为 28 天（672 小时），这个时间必须是 schema_config 中 period 的倍数，否则会报错
  max_look_back_period: 672h

table_manager:
  # 启用表的保留期删除功能
  retention_deletes_enabled: true
  # 表的保留期为 28 天（672 小时）
  retention_period: 672h
```

- 安全组端口、防火墙端口放行：9095、3100

- 启动 Loki

```shell
./loki-linux-amd64 --config.file=./config/loki-config.yaml
```

### 2.2 安装 Grafana

- 下载地址：[Grafana]([https://grafana.com/grafana/download/11.1.3?platform=linux)
- 安装命令：

```shell
sudo yum install -y https://dl.grafana.com/enterprise/release/grafana-enterprise-11.1.3-1.x86_64.rpm
```

- 启动命令：

```
sudo systemctl start grafana-server
```

- 访问地址：ip 地址:3000，需要放行 3000 端口，账号和密码均为 admin

- 添加数据源（Loki）：连接——>添加新连接——>输入 ip 地址:3100

- 添加请求头：Header 为 X-Scope-OrgID ，Value 为 user1

## 3.SpringBoot 配置

- 引入依赖

```xml
<!--Loki 日志收集-->
<dependency>
    <groupId>com.github.loki4j</groupId>
    <artifactId>loki-logback-appender</artifactId>
    <version>1.4.1</version>
</dependency>

<!--Loki 日志发送http请求和响应工具-->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.13</version>
</dependency>
```

- resource 文件夹新增 logback-spring.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>

    <!-- 彩色控制台控制 -->
    <substitutionProperty name="log.pattern" value="%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} %clr(%5p) ${PID:-} %clr(---){faint} %clr(%-80.80logger{79}){cyan} %clr(:){faint} %m%n%wEx"/>
    <substitutionProperty name="log.pattern.no" value="%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} %clr(%5p) ${PID:-} %clr(---){faint} %clr(%-80.80logger{79}){cyan} %clr(:){faint} %m%n%wEx"/>
    <conversionRule conversionWord="clr" converterClass="org.springframework.boot.logging.logback.ColorConverter"/>
    <conversionRule conversionWord="wex" converterClass="org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter"/>
    <conversionRule conversionWord="wEx" converterClass="org.springframework.boot.logging.logback.ExtendedWhitespaceThrowableProxyConverter"/>

    <springProperty scope="context" name="LOG_FILE_DIR" source="logback.log-file-dir" defaultValue="log"/>

    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${log.pattern}</pattern>
        </encoder>
    </appender>

    <springProperty scope="context" name="url" source="loki.url" defaultValue="http://localhost:3100/loki/api/v1/push"/>
    <springProperty scope="context" name="env" source="loki.label.env" defaultValue="dev"/>
    <springProperty scope="context" name="jobName" source="loki.label.job-name" defaultValue="my-app"/>
    <springProperty scope="context" name="hostIp" source="loki.label.host-ip" defaultValue="localhost"/>
    <springProperty scope="context" name="orgId" source="loki.org-id" defaultValue="default-org"/>

    <appender name="LOKI" class="com.github.loki4j.logback.Loki4jAppender">
        <http class="com.github.loki4j.logback.ApacheHttpSender">
            <url>${url}</url>
            <tenantId>${orgId}</tenantId>
        </http>
        <format>
            <label>
                <pattern>application=${jobName},env=${env},host=${hostIp},level=%level</pattern>
            </label>
            <message>
                <pattern>
                    {"timestamp": "%d{yyyy-MM-dd HH:mm:ss.SSS}", "level": "%level", "logger": "%logger{36}", "thread": "%thread", "message": "%msg%n"}
                </pattern>
            </message>
            <sortByTime>true</sortByTime>
        </format>
    </appender>

    <!-- 使用异步方式将日志推送至Loki -->
    <appender name="ASYNC_LOKI" class="ch.qos.logback.classic.AsyncAppender">
        <!-- 队列大小设置，根据实际需要调整 -->
        <queueSize>512</queueSize>
        <!-- 丢弃策略，当队列满时采取的操作 -->
        <discardingThreshold>0</discardingThreshold>
        <neverBlock>true</neverBlock>
        <!-- 实际的Loki Appender -->
        <appender-ref ref="LOKI" />
    </appender>

    <appender name="fileInfoLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>DENY</onMatch>
            <onMismatch>ACCEPT</onMismatch>
        </filter>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${log.pattern.no}</pattern>
        </encoder>
        <!--滚动策略-->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--路径-->
            <fileNamePattern>${LOG_FILE_DIR}/info.%d.log</fileNamePattern>
            <!--保留30天日志-->
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <appender name="fileErrorLog" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>ERROR</level>
        </filter>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>${log.pattern.no}</pattern>
        </encoder>
        <!--滚动策略-->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!--路径-->
            <fileNamePattern>${LOG_FILE_DIR}/error.%d.log</fileNamePattern>
            <!--保留30天日志-->
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <root level="info">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="fileInfoLog" />
        <appender-ref ref="fileErrorLog" />
        <appender-ref ref="ASYNC_LOKI" />
    </root>

</configuration>
```

- yaml 配置

```yaml
# Loki 日志配置
loki:
  # Loki 服务的 URL，用于推送日志数据
  url: http://8.155.33.36:3100/loki/api/v1/push
  # 标签配置，用于标识日志来源的额外信息
  label:
    # 环境标签，标识当前运行的环境，例如开发环境
    env: test
    # 服务名称标签，标识日志来源的服务名称
    job-name: zetlight
    # 主机 IP 标签，标识日志来源的主机 IP 地址
    host-ip: 8.155.33.36
  # 组织 ID，用于多租户环境中标识日志所属的组织
  org-id: user1
```

## 4.查看日志

左侧导航栏：探索，可根据主机 host、环境 env、层级 level 等进行筛选

日志可视化：待总结
