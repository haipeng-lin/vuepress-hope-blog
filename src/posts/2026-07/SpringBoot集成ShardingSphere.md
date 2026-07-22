---
title: SpringBoot集成ShardingSphere
date: 2026-07-04
category: SpringBoot
tag:
  - 分库分表
  - 消息中间件
---

## 前言

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

## sharding-config.yml

```yml title=""
mode:
  type: Standalone
  repository:
    type: JDBC
dataSources:
  master:
    dataSourceClassName: com.alibaba.druid.pool.DruidDataSource
    driverClassName: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/order?useSSL=false&serverTimezone=GMT%2B8
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

修改 DruidConfig

```java title="DruidConfig.java"
@Bean(name = "shardingDataSource")
public DataSource shardingDataSource() throws IOException, SQLException {
    // 读取 your-sharding-config.yml (包含分表规则)
    File yamlFile = new ClassPathResource("sharding-config.yml").getFile();
    return YamlShardingSphereDataSourceFactory.createDataSource(yamlFile);
}

@Bean(name = "dynamicDataSource")
@Primary
public DynamicDataSource dataSource(
    @Qualifier("masterDataSource") DataSource masterDataSource,
    @Qualifier("shardingDataSource") DataSource shardingDataSource) { // 显式注入 shardingDataSource

    Map<Object, Object> targetDataSources = new HashMap<>();
    targetDataSources.put(DataSourceType.MASTER.name(), masterDataSource);
    targetDataSources.put(DataSourceType.SLAVE.name(), masterDataSource); // 如果有 slave 逻辑，请按需修改
    targetDataSources.put(DataSourceType.SHARDING.name(), shardingDataSource); // 存入 Sharding 数据源

    return new DynamicDataSource(masterDataSource, targetDataSources);
}
```
