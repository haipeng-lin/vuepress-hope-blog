---
title: SpringBoot集成ShardingSphere
date: 2026-07-04
category: SpringBoot
tag:
  - 分库分表
  - 消息中间件
---

## 前言

&emsp;&emsp;最近参与的项目中有一张业务表每天产生的数据量较大，一个月约近百万条数据，随着时间的推移，查询该表的数据速度会逐渐下降，慢慢地，查询 api 会超时，便有了数据按月分表的需求，`ShardingSphere`开始浮现在眼前。

&emsp;&emsp;刚开始尝试让 AI 写，但是结果写得不尽人意，比如先报 A 错误，修复好 A 错误，又报 B 错误，修复好了 B 错误，又又报 A 错误，便去官网找文档，原来对于 pom 引入的`shardingsphere-jdbc-core-spring-boot-starter`，开发作者已不再更新了，而网上的`SpringBoot`集成`ShardingSphere`资料，大多数`SpringBoot`的版本较低，为2.x.x，引入的 pom 也不同，直接按网上的教程走，大多报依赖错误，研究了一下，修改依赖为`shardingsphere-jdbc`和修改分表配置

&emsp;&emsp;下面就以 order 订单表为例记录下集成过程

链接：

- [ShardingSphere官网](https://shardingsphere.apache.org/document/current/cn/overview/)

环境：

- `SpringBoot`：3.x.x
- `ShardingSphere`：5.5.0
- `Druid` 数据源

## 引入依赖

```xml title="pom.xml"
<properties>
	<shardingsphere.version>5.5.0</shardingsphere.version>
</properties>

<dependency>
    <groupId>org.apache.shardingsphere</groupId>
    <artifactId>shardingsphere-jdbc</artifactId>
    <version>${shardingsphere.version}</version>
    <exclusions>
        <exclusion>
            <groupId>org.apache.shardingsphere</groupId>
            <artifactId>shardingsphere-test-util</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

## 配置 yml

```yml title="sharding-config.yml"
mode:
  type: Standalone
  repository:
    type: JDBC
dataSources:
  master:
    dataSourceClassName: com.alibaba.druid.pool.DruidDataSource
    driverClassName: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/数据库?useSSL=false&serverTimezone=GMT%2B8
    username: 用户名
    password: 密码

rules:
  - !SHARDING
    tables:
      zet_device_ageing:
        actualDataNodes: master.order_${['07','08']}
        tableStrategy:
          standard:
            shardingColumn: create_time
            shardingAlgorithmName: order_table_inline
     
    shardingAlgorithms:
      order_table_inline:
        type: INTERVAL
        props:
          datetime-pattern: "yyyy-MM-dd HH:mm:ss"
          datetime-interval-unit: "MONTHS"
          datetime-interval-amount: 1
          # 修改后缀格式，在 yyyy 和 MM 中间增加下划线
          sharding-suffix-pattern: "yyyy_MM"
          datetime-lower: "2025-01-01 00:00:00"
          datetime-upper: "2026-12-31 23:59:59"

# 展示真实 sql
props:
  sql-show: true

```

## 修改 Druid 数据源

```java title="DruidConfig.java"
@Bean(name = "shardingDataSource")
public DataSource shardingDataSource() throws IOException, SQLException {
    File yamlFile = new ClassPathResource("sharding-config.yml").getFile();
    return YamlShardingSphereDataSourceFactory.createDataSource(yamlFile);
}

@Bean(name = "dynamicDataSource")
@Primary
public DynamicDataSource dataSource(
    @Qualifier("masterDataSource") DataSource masterDataSource,
    @Qualifier("shardingDataSource") DataSource shardingDataSource) {

    Map<Object, Object> targetDataSources = new HashMap<>();
    targetDataSources.put(DataSourceType.MASTER.name(), masterDataSource);
    targetDataSources.put(DataSourceType.SLAVE.name(), masterDataSource);
    targetDataSources.put(DataSourceType.SHARDING.name(), shardingDataSource);

    return new DynamicDataSource(masterDataSource, targetDataSources);
}
```

## 使用

在需要分表的 mapper 接口上添加注解 @DataSource(SHAREDING) 即可

## 后记

&emsp;&emsp;集成新框架并不难，麻烦的是环境和框架版本的适配，后续集成新框架时，先明确当前环境配置，再提供给 AI 或到网上查精准资料后，让 AI 给出方案，不能傻乎乎地，宽泛地去实现，要精准提示词，精准明确需求。

&emsp;&emsp;后续研究下`ShardingSphere`的进阶功能：读写分离，数据迁移，数据加密