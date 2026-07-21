---
title: SpringBoot集成RabbitMQ
date: 2026/01/01
category: SpringBoot
---

## 环境配置

见 Docker 篇

## SpringBoot 集成

### xml 配置

```xml title="pom.xml"
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

### yml 配置

```yml title="application.yml"
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: admin
    password: admin123
```

### RabbitMQ 配置类

```java
@Configuration
public class RabbitMQConfig {
    // 交换机名称
    public static final String EXCHANGE_NAME = "order_exchange";
    // 队列名称
    public static final String QUEUE_NAME = "order_queue";

    /**
     * 声明主题交换机（Topic Exchange）
     * 特点：按路由键模式匹配消息，支持通配符（*匹配一个词，#匹配多个词）
     */
    @Bean
    public Exchange orderExchange() {
        // durable(true)：交换机持久化（服务重启后不丢失）
        return ExchangeBuilder.topicExchange(EXCHANGE_NAME).durable(true).build();
    }

    /**
     * 声明持久化队列
     */
    @Bean
    public Queue orderQueue() {
        // durable(true)：队列持久化（服务重启后队列仍存在）
        return QueueBuilder.durable(QUEUE_NAME).build();
    }

    /**
     * 绑定交换机与队列
     * 路由键规则：order.#（匹配以order.开头的所有路由键，如order.new、order.pay等）
     */
    @Bean
    public Binding orderBinding(Queue queue, Exchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with("order.#").noargs();
    }
}
```

### RabbitMQ 消费

```java
@Slf4j
@Component
public class OrderMQListener {

    /**
     * 监听order_queue队列的消息
     *
     * @param msg     消息内容（自动转换为String类型）
     * @param message 消息完整对象（包含属性、路由键等元数据）
     */
    // @RabbitListener：指定监听的队列
    // @RabbitHandler：标记消息处理方法，支持根据消息类型重载
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)  // 绑定监听的队列
    @RabbitHandler  // 处理消息的具体方法
    public void handleOrderMessage(String msg, Message message) {
        // 获取消息投递标签（用于手动确认消息）
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        // 打印消息详情
        log.info("===== 接收到RabbitMQ消息 =====");
        log.info("消息标签：{}", deliveryTag);
        log.info("消息内容：{}", msg);
        log.info("消息元数据：{}", message.getMessageProperties());
    }
}
```

### 测试

```java
@SpringBootTest
class RabbitMQTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * 发送消息测试
     */
    @Test
    void sendMessage() {
        // 参数1：交换机名称（从配置类引用，避免硬编码）
        // 参数2：路由键（需符合绑定规则order.#）
        // 参数3：消息内容（支持String、对象等类型）
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                "order.new",
                "新订单来啦1"
        );
        System.out.println("消息发送成功");
    }
}
```
