---
title: Cananl
date: 2024/10/16
article: false
---

## 1.Canal 简介

### 1.1 历史背景

早期阿里巴巴在杭州和美国部署机房，存在跨机房同步的业务需求，最初的实现是基于业务触发的方式 ，不是很方便， 2010 年，逐步使用数据库日志解析方式取代，这由此衍生出了大量的数据库增量订阅和消费操作。在这种背景下 Canal 就出来了。

2014 年左右，天猫双十一首次引入，用于解决大型促销活动 MySQL 数据库的高并发读写问题。后来，在阿里内部得到了广泛应用和推广，并于 2017 年正式开源。

### 1.2 定义

Canal 组件是一个基于 MySQL 数据库增量日志解析，提供增量数据订阅和消费，支持将增量数据投递到下游消费者（如 Kafka、RocketMQ 等）或者存储（如 Elasticsearch、HBase 等）的组件。

大白话： Canal 感知到 MySQL 数据变动，然后解析变动数据，将变动数据发送到 MQ 或者同步到其他数据库，等待进一步业务逻辑处理。

## 2.Cananl 工作原理

cannal 的工作原理是基于 MySQL 主从复制原理产生的

### 2.1 MySQL 主从复制原理

1. MySQL master（MySQL 主节点） 将数据变更写入二进制日志( binary log，其中记录叫做二进制日志事件 binary log events，可以通过 show binlog events 进行查看)
2. MySQL slave（MySQL 从节点） 将 master 的 binary log events 拷贝到它的中继日志(relay log)
3. MySQL slave（MySQL 主节点） 重做 relay log 中事件，将数据变更反映它自己的数据

> **二进制日志文件，bin log 介绍：**
>
> 1. 记录了所有的 DDL 和 DML 语句，以事件形式记录
> 2. MySQL 默认情况下是不开启 Binlog，因为记录 Binlog 日志需要消耗时间，官方给出的数据是有 1%的性能损耗
>    1. MySQL 主从集群部署时，需要将在 Master 端开启 Binlog，方便将数据同步到 Slaves 中
>    2. 数据恢复了，通过使用 MySQL Binlog 工具来使恢复数据

Binlog 的分类（三种）：

MySQL Binlog 的格式有三种，分别是 STATEMENT,MIXED,ROW。在配置文件中可以选择配置 binlog_format= **statement**|**mixed**|**row**。

| 分类          | 介绍                                                                                                                                                              | 优点                                                                          | 缺点                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **STATEMENT** | 语句级别，==记录每一次执行写操作的语句==，相对于 ROW 模式节省了空间，但是可能产生数据不一致如 update tt set create_date=now()，由于执行时间不同产生饿得数据就不同 | 节省空间                                                                      | 可能造成数据不一致                                                                               |
| ROW           | 行级，记录每次操作后==每行记录的变化==。假如一个 update 的 sql 执行结果是 1 万行 statement 只存一条，如果是 row 的话会把这个 1 万行的结果存这。                   | 持数据的绝对一致性。因为不管 sql 是什么，引用了什么函数，他只记录执行后的效果 | 占用较大空间                                                                                     |
| MIXED         | 是==对 statement 的升级==，如当函数中包含 UUID() 时，包含 AUTO_INCREMENT 字段的表被更新时，执行 INSERT DELAYED 语句时，用 UDF 时，会按照 ROW 的方式进行处理       | 节省空间，同时兼顾了一定的一致性                                              | 还有些极个别情况依旧会造成不一致，另外 statement 和 mixed 对于需要对 binlog 的监控的情况都不方便 |

### 2.2 Canal 工作原理

1. canal 模拟 MySQL slave 的交互协议，伪装自己为 MySQL slave ，向 MySQL master 发送 dump 协议
2. MySQL master 收到 dump 请求，开始推送 binary log 给 slave (即 canal )
3. canal 解析 binary log 对象(原始为 byte 流)

## 3.Canal 服务端搭建

下载地址：https://github.com/alibaba/canal/releases

![image-20241016224735597](https://cdn.jsdelivr.net/gh/haipeng-lin/blog-img/202503171805467.png)

### 3.1 canal.propertise 配置

```yml
canal.port = 11111
# tcp, kafka, rocketMQ, rabbitMQ, pulsarMQ
canal.serverMode = tcp

canal.destinations = knowledge
```

canal.port：默认端口 11111

canal.serverMode：服务模式，tcp 表示输出到客户端，xxMQ 输出到各类消息中间件

canal.destinations：canal 能可以收集多个 MySQL 数据库数据，每个 MySQL 数据库都有独立的配置文件控制。

- 具体配置规则： conf/目录下，使用文件夹放置，**文件夹名代表一个 MySQL 实例**。canal.destinations 用于配置需要监控数据的数据库。如果是多个，使用,隔开

### 3.2 instance 实例配置

```yml
canal.instance.mysql.slaveId=20

# position info
canal.instance.master.address=127.0.0.1:3306

# username/password
canal.instance.dbUsername=root
canal.instance.dbPassword=admin
```

canal.instance.mysql.slaveId：使用 canal 从阶段 id

canal.instance.master.address：数据库 ip 端口

canal.instance.dbUsername：连接 mysql 账号

canal.instance.dbPassword：连接 mysql 密码

### 3.3 启动服务端

点击 bin 目录下的 startup.bat 文件，即可启动 Canal 服务端

## 4.Canal 客户端搭建

### 4.1 引入 Canal 和 RabbitMQ 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

待写
