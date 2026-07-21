---
title: RocketMQ
date: 2025/01/25
article: false
---

## 1.RocketMQ 特点

&emsp;&emsp;阿里开源的一款消息中间件，纯 Java 开发，具有**高吞吐量、高可用性**、适合**大规模分布式系统**应用的特点，性能强劲(零拷贝技术)，支持海量堆积，支持指定次数和时间间隔的失败，消息重发,支持 consumer 端 tag 过滤、延迟消息等，在阿里内部进行大规模使用，适合在**电商，互联网金融**等领域使用

## 2.RocketMQ 架构设计

### 2.1 技术架构

RocketMQ 架构主要由四部分组成，可在 2.2 部署架构见 RocketMQ 集群部署图

- **Producer：消息生产者**，可集群部署。会先和 NameServer 集群中的随机一台建立长连接，得知当前要发送的 Topic 存在哪台 Broker Master 上，然后再与其建立长连接，定时向 Broker 发送心跳。同时支持多种负载平衡模式发送消息。
- **Consumer：消息消费者**，可以集群部署。会先和 NameServer 集群中的随机一台建立长连接，得知当前要消息的 Topic 存在哪台 Broker Master、Slave 上，然后它们建立长连接，定时向 Broker 发送心跳。同时支持集群消费和广播消费消息。
- **Broker：主要负责消息的存储、查询消费**，支持主从部署，一个 Master 可以对应多个 Slave。Master 支持读写，Slave 只支持读。Broker 会向集群中的每一台 NameServer 注册自己的路由信息。定期 30s 向 NameServer 上报 Topic 路由信息。
- **NameServer：是 Topic 路由注册中心**，支持 Broker 的动态注册和发现，保存 Topic 和 Borker 之间的关系。也是集群部署，但是各 NameServer 之间不会互相通信， 各 NameServer 都有完整的路由信息，即无状态。

RocketMQ 的 Broker、Topic、Queue 的对应关系：

- 一个 Topic 主题可以存储于多个 Broker 中
- 一个 Topic 主题由多个 Queue 队列组成。每个 Topic 分片等分的 Queue 的数量可以不同，由用户在创建 Topic 时指定；

<img src="https://cdn.jsdelivr.net/gh/haipeng-lin/blog-img/202503202151079.png" alt="RocketMQ的Broker组织图.drawio" style="zoom:33%;" />

### 2.2 部署架构

RocketMQ 的 Broker 有三种部署方式：

- 单台 Master 部署；
- 多台 Master 部署；
- 多 Master 多 Slave 部署，又可分为以下两种模式（同步方式：同步复制和异步复制（指的一组 master 和 slave 之间数据的同步）
  - 多 master 多 slave **异步**复制模式
  - 多 master 多 slave **同步**复制模式

基础的 Rocket 高可用，主要采用第 3 种部署方式，如图所示

![img](https://cdn.jsdelivr.net/gh/haipeng-lin/blog-img/202503202151471.jpeg)

### 2.3 工作流程

结合部署架构图，描述集群工作流程：

1. 启动 NameServer，NameServer 起来后监听端口，等待 Broker、Producer、Consumer 连上来，相当于一个路由控制中心。
2. Broker 启动，跟所有的 NameServer 保持长连接，定时发送心跳包。心跳包中包含当前 Broker 信息(IP+端口等)以及存储所有 Topic 信息。注册成功后，NameServer 集群中就有 Topic 跟 Broker 的映射关系。
3. 收发消息前，先**创建 Topic（主题名字，一个 Topic 由若干 Queue 组成）**，创建 Topic 时需要**指定该 Topic 要存储在哪些 Broker**上，也可以在发送消息时自动创建 Topic。
4. Producer 发送消息，启动时先跟 NameServer 集群中的其中一台建立长连接，并**从 NameServer 中获取当前发送的 Topic 存在哪些 Broker 上**，轮询从队列列表中选择一个队列，然后与队列所在的 Broker 建立长连接从而向 Broker 发消息。
5. Consumer 跟 Producer 类似，跟其中一台 NameServer 建立长连接，获取**当前订阅 Topic 存在哪些 Broker 上**，然后直接跟 Broker 建立连接通道，开始消费消息。

## 3.RocketMQ 支持高可用

可分为 NameServer 高可用、BrokerServer 高可用、Producer 高可用、Consumer 高可用

### 3.1 NameServer 高可用

&emsp;&emsp;由于 NameServer 节点是**无状态**的，且各个节点直接的**数据是一致**的，故存在多个 NameServer 节点的情况下，部分 NameServer 不可用也可以保证 MQ 服务正常运行

### 3.2 BrokerServer 高可用

&emsp;&emsp;RocketMQ 是通过 **Master 和 Slave 的配合**达到 BrokerServer 模块的高可用性的

一个 Master 可以配置多个 Slave，同时也支持配置多个 Master-Slave 组。

### 3.3 Producer 高可用

​ 在创建 Topic 的时候，把**Topic 的多个 Message Queue 创建在多个 Broker 组上**（相同 Broker 名称，不同 brokerId 的机器组成一个 Broker 组）

​ 这样当一个 Broker 组的 Master 不可用后，其他组的 Master 仍然可用，Producer 仍然可以发送消息。

### 3.4 Consumer 高可用

&emsp;&emsp;Consumer 的高可用是依赖于 Master-Slave 配置的，由于 Master 能够支持读写消息，Slave 支持读消息，当 Master 不可用或繁忙时， Consumer 会被自动切换到从 Slave 读取(自动切换，无需配置)。

&emsp;&emsp;故当 Master 的机器故障后，消息仍可从 Slave 中被消费

## 4.五种消息类型

1. **普通消息：** 普通消息也称为并发消息，和传统的队列相比，并发消息没有顺序， 但是生产消费都是并行进行的，单机性能可达十万级别的 TPS。
2. **分区有序消息：** 与 Kafka 中的分区类似，把一个 Topic 消息分为多个分区“保 存”和消费，在一个分区内的消息就是传统的队列，遵循 FIFO（先进先出）原则。
3. **全局有序消息：** 如果把一个 Topic 的分区数设置为 1，那么该 Topic 中的消息 就是单分区，所有消息都遵循 FIFO（先进先出）的原则。
4. **延迟消息：** 消息发送后，消费者要在一定时间后，或者指定某个时间点才可以消 费。在没有延迟消息时，基本的做法是基于定时计划任务调度，定时发送消息。在 RocketMQ 中只需要在发送消息时设置延迟级别即可实现。
5. **事务消息：** 主要涉及分布式事务，即需要保证在多个操作同时成功或者同时失败 时，消费者才能消费消息。RocketMQ 通过发送 Half 消息、处理本地事务、提交 （Commit）消息或者回滚（Rollback）消息优雅地实现分布式事务

## 5.安装 RocketMQ

见环境配置总结篇的 RocketMQ

## 6.SpringBoot 整合 RocketMQ

### 6.1 xml 配置

在 pom.xml 引入依赖

```xml
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-spring-boot-starter</artifactId>
    <version>2.0.4</version>
 </dependency>
```

### 6.2 yml 配置

```yml
rocketmq:
  name-server: 192.168.1.224:9876 # 访问地址
  producer:
    group: Pro_Group # 必须指定group
    send-message-timeout: 3000 # 消息发送超时时长，默认3s
    retry-times-when-send-failed: 3 # 同步发送消息失败重试次数，默认2
    retry-times-when-send-async-failed: 3 # 异步发送消息失败重试次数，默认2
```

### 6.3 编写生产者

```java
@Slf4j
@Component
public class MQProducerService {

	@Value("${rocketmq.producer.send-message-timeout}")
    private Integer messageTimeOut;

	// 建议正常规模项目统一用一个TOPIC
    private static final String topic = "RLT_TEST_TOPIC";

	// 直接注入使用，用于发送消息到broker服务器
    @Autowired
    private RocketMQTemplate rocketMQTemplate;

}
```

> 普通发送

```java
/**
* 普通发送（主题Topic+Message消息）
*/
public void send(User user) {
	rocketMQTemplate.convertAndSend(topic, user);
//  rocketMQTemplate.send(topic, MessageBuilder.withPayload(user).build()); // 等价于上面一行
}
```

> 发送同步消息

```java
/**
* 发送同步消息（阻塞当前线程，等待broker响应发送结果，这样不太容易丢失消息）
* （msgBody也可以是对象，sendResult为返回的发送结果）
*/
public SendResult sendMsg(String msgBody) {
    SendResult sendResult = rocketMQTemplate.syncSend(topic, MessageBuilder.withPayload(msgBody).build());
    log.info("【sendMsg】sendResult={}", JSON.toJSONString(sendResult));
    return sendResult;
}
```

> 发送异步消息

```java
/**
  * 发送异步消息（通过线程池执行发送到broker的消息任务，执行完后回调：在SendCallback中可处理相关成功失败时的逻辑）
  * （适合对响应时间敏感的业务场景）
*/
public void sendAsyncMsg(String msgBody) {
    rocketMQTemplate.asyncSend(topic, MessageBuilder.withPayload(msgBody).build(), new SendCallback() {
        @Override
        public void onSuccess(SendResult sendResult) {
            // 处理消息发送成功逻辑
        }
        @Override
        public void onException(Throwable throwable) {
            // 处理消息发送异常逻辑
        }
    });
}
```

> 发送延时消息

```java
/**
* 发送延时消息（上面的发送同步消息，delayLevel的值就为0，因为不延时）
* 在start版本中 延时消息一共分为18个等级分别为：1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h
*/
public void sendDelayMsg(String msgBody, int delayLevel) {
    rocketMQTemplate.syncSend(topic, MessageBuilder.withPayload(msgBody).build(), messageTimeOut, delayLevel);
}
```

> 发送单向消息

```java
/**
  * 发送单向消息（只负责发送消息，不等待应答，不关心发送结果，如日志）
*/
public void sendOneWayMsg(String msgBody) {
    rocketMQTemplate.sendOneWay(topic, MessageBuilder.withPayload(msgBody).build());
}
```

> 发送带标签消息

```java
/**
  * 发送带tag的消息，直接在topic后面加上":tag"
*/
public SendResult sendTagMsg(String msgBody) {
    return rocketMQTemplate.syncSend(topic + ":tag2", MessageBuilder.withPayload(msgBody).build());
}
```

### 6.4 编写消费者

```java
@Slf4j
@Component
public class MQConsumerService {

    // topic需要和生产者的topic一致，consumerGroup属性是必须指定的，内容可以随意
    // selectorExpression的意思指的就是tag，默认为“*”，不设置的话会监听所有消息
    @Service
    @RocketMQMessageListener(topic = "RLT_TEST_TOPIC", selectorExpression = "tag1", consumerGroup = "Con_Group_One")
    public class ConsumerSend implements RocketMQListener<User> {
        // 监听到消息就会执行此方法
        @Override
        public void onMessage(User user) {
            log.info("监听到消息：user={}", JSON.toJSONString(user));
        }
    }

    // 注意：这个ConsumerSend2和上面ConsumerSend在没有添加tag做区分时，不能共存，
    // 不然生产者发送一条消息，这两个都会去消费，如果类型不同会有一个报错，所以实际运用中最好加上tag，写这只是让你看知道就行
    @Service
    @RocketMQMessageListener(topic = "RLT_TEST_TOPIC", consumerGroup = "Con_Group_Two")
    public class ConsumerSend2 implements RocketMQListener<String> {
        @Override
        public void onMessage(String str) {
            log.info("监听到消息：str={}", str);
        }
    }

	// MessageExt：是一个消息接收通配符，不管发送的是String还是对象，都可接收，当然也可以像上面明确指定类型（我建议还是指定类型较方便）
    @Service
    @RocketMQMessageListener(topic = "RLT_TEST_TOPIC", selectorExpression = "tag2", consumerGroup = "Con_Group_Three")
    public class Consumer implements RocketMQListener<MessageExt> {
        @Override
        public void onMessage(MessageExt messageExt) {
            byte[] body = messageExt.getBody();
            String msg = new String(body);
            log.info("监听到消息：msg={}", msg);
        }
    }

}
```

### 6.5 测试

```java
@RestController
@RequestMapping("/rocketmq")
public class RocketMQController {

    @Autowired
    private MQProducerService mqProducerService;

    @GetMapping("/send")
    public void send() {
        User user = User.getUser();
        mqProducerService.send(user);
    }

    @GetMapping("/sendTag")
    public Result<SendResult> sendTag() {
        SendResult sendResult = mqProducerService.sendTagMsg("带有tag的字符消息");
        return Result.success(sendResult);
    }

}
```
