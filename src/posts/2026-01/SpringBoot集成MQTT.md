---
title: SpringBoot集成MQTT
date: 2026/01/01
category: SpringBoot
tag:
  - MQTT
  - 消息中间件
---

## 环境配置

### Docker

见 Docker 篇

## SpringBoot 集成

### xml 配置

```xml title="pom.xml"
<dependency>
    <groupId>org.springframework.integration</groupId>
    <artifactId>spring-integration-mqtt</artifactId>
</dependency>
```

### yml 配置

```yml title="application.yml"
mqtt:
  broker-url: tcp://127.0.0.1:1883
  username: zetlight
  password: zetlight20121211
  client-id: server
  timeout: 60
  keepalive: 60
```

### MqttConfig

作用：配置 MQTT 信息

```java
@Data
@Component
@ConfigurationProperties(prefix = "mqtt")
public class MqttConfig {

    /**
     * MQTT地址+端口
     */
    private String brokerUrl;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;

    /**
     * 客户端id
     */
    private String clientId;

    /**
     * 连接超时时间
     */
    private int timeout;

    /**
     * 心跳时间
     */
    private int keepalive;
}

```

### MqttConnection

作用：调用连接 MQTT 方法

```java
@Slf4j
@Component
public class MqttConnection {

    @Resource
    private MqttClient mqttClient;

    @Resource
    private MqttMsgCallBack mqttMsgCallBack;

    @PostConstruct
    public void create() {
        try {
            mqttClient.connect(mqttMsgCallBack);
            log.info("MQTT连接创建成功");
        } catch (MqttException exception) {
            log.error("MqttConnection创建失败:{} ", exception.toString());
        }
    }
}
```

### MqttClient

作用：连接 MQTT ，设置回调类，发送消息给 MQTT

```java
@Slf4j
@Component
public class MqttClient {

    @Autowired
    private MqttConfig mqttConfig;

    private MqttAsyncClient client;

    public void init(String broker, String clientId, MemoryPersistence persistence) {
        try {
            this.client = new MqttAsyncClient(broker, clientId, persistence);
        } catch (MqttException e) {
            //throw new RuntimeException(e);
            log.error("\n### [EmqxMqttClient - init]  error:", e);
        }
    }

    public MqttAsyncClient getClient(String broker, String clientId) {
        //  持久化
        MemoryPersistence persistence = new MemoryPersistence();
        this.init(broker, clientId, persistence);
        return this.client;
    }

    // 获取当前 client
    public MqttAsyncClient getClient() {
        if (this.client == null) {
            this.client = getClient(mqttConfig.getBrokerUrl(), mqttConfig.getClientId() + "-" + System.currentTimeMillis());
        }
        return this.client;
    }

    public void connect(MqttMsgCallBack callback) throws MqttException {
        MqttAsyncClient client = this.getClient();
        // 设置回调
        client.setCallback(callback);
        // 建立连接
        log.info("连接MQTT服务器: {}", mqttConfig.getBrokerUrl());
        IMqttToken token = client.connect(this.getOptions());
        token.waitForCompletion();
        log.info("连接MQTT服务器成功: {}", mqttConfig.getBrokerUrl());
        // 监听主题
        this.client.subscribe(mqttConfig.getDeviceStatusTopic(), 0);
        this.client.subscribe(mqttConfig.getClientConnectedTopic(), 0);
        this.client.subscribe(mqttConfig.getClientDisconnectedTopic(), 0);
        this.client.subscribe(mqttConfig.getClientSubscribedTopic(), 0);
        this.client.subscribe(mqttConfig.getClientUnsubscribedTopic(), 0);
        this.client.subscribe(mqttConfig.getDeviceTimeReqTopic(), 0);
    }


    /**
     * 发送消息
     *
     * @param qos      发送消息的次数
     * @param retained 是否保留消息
     * @param topic    主题
     * @param message  消息
     */
    public void publishMsg(int qos, boolean retained, String topic, Object message) {
        MqttMessage mqttMessage = new MqttMessage();
        mqttMessage.setQos(qos);
        mqttMessage.setRetained(retained);
        mqttMessage.setPayload(message.toString().getBytes());
        try {
            IMqttDeliveryToken token = this.client.publish(topic, mqttMessage);
            token.waitForCompletion();
            token.getResponse();
            if (token.isComplete()) {
                log.info("发送mqtt消息成功，topic: {}, content: {}", topic, message.toString());
            }
        } catch (Exception e) {
            log.error("发送mqtt消息失败，Exception: ", e);
            throw new CustomException(ResultCodeMsg.PUBLISH_DEVICE_ORDER_FAIL);
        }
    }

    public MqttConnectOptions getOptions() {
        // MQTT 连接选项
        MqttConnectOptions options = new MqttConnectOptions();
        // 设置认证信息
        options.setUserName(mqttConfig.getUsername());
        options.setPassword(mqttConfig.getPassword().toCharArray());
        // options.setPassword(SHA256Utils.getSHA256(password).toCharArray());
        // 设置是否清空session,这里如果设置为false表示服务器会保留客户端的连接记录，设置为true表示每次连接到服务器都以新的身份连接
        options.setCleanSession(true); // false用于接收离线消息,支持Qos1和Qos2
        // 设置超时时间
        options.setConnectionTimeout(mqttConfig.getTimeout());
        // 设置会话心跳时间
        options.setKeepAliveInterval(mqttConfig.getKeepalive());
        options.setMaxInflight(10000);
        options.setAutomaticReconnect(true); // 设置自动重连
        return options;
    }
}
```

### MqttMsgCallBack

作用：监听 MQTT 消息回调，如接收 MQTT 消息、确认消息发送成功等

```java
@Slf4j
@Component
public class MqttMsgCallBack implements MqttCallback {

    @Override
    public void connectionLost(Throwable throwable) {
        log.info("MQTT连接失败");
    }

    /*
     * 消息到达的回调
     */
    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        log.info("收到主题:{}，消息:{}", topic, message);
    }

    /**
     * 消息发布成功的回调
     */
    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        IMqttAsyncClient client = iMqttDeliveryToken.getClient();
        log.info("{}发布消息成功！", client.getClientId());
    }
}
```
