---
title: MongoDB
date: 2025/06/01
---

## 介绍

MongoDB 是一个开源、高性能的文档型数据库

文档型数据库：将数据存储为 JSON 和其他数据序列化格式的文档，而不是像 SQL 关系型数据库那样的列和行

- [MongoDB 官网](https://www.mongodb.com/zh-cn)
- [MongoDB 中文使用文档](https://docs.mongoing.com/)
- [MongoDB 的 菜鸟教程](https://www.runoob.com/mongodb/mongodb-tutorial.html)

数据库设计需要考虑的三高：

- 高存储：海量数据的高效率存储
- 高并发：数据库高并发读写
- 高可用：对数据库的高可用性

## 安装 MongoDB

需求：mac 安装 MongoDB 社区版本 4.4
前提条件：已安装 brew 工具

- 查看 mongodb-community 所有版本的命令：

  ```cmd
  brew search mongodb-community
  ```

- 安装命令：

  ```cmd
  brew install mongodb-community@4.4
  ```

### 问题一：安装报错

实测安装过程中，报错：报 Error: No available formula with the name ‘mongodb’
原因：MongoDB 不再是开源的了，并且已经从 Homebrew 中移除。所以，在它闭源之前的那些 brew 安装方法都会报错了。
解决：需要先执行以下命令

```cmd
 brew tap mongodb/brew
```

再执行安装命令

```cmd
brew install mongodb-community@4.4
```

- 运行命令：

  ```cmd
  brew services start mongodb-community@4.4
  ```

- 停止命令：

  ```cmd
  brew services stop mongodb-community@4.4
  ```

- 将 MongoDB（即 mongod 进程）作为后台进程手动运行：

  ```cmd
  mongod --config /usr/local/etc/mongod.conf --fork
  ```

### 问题二：连接 mongo 失败

- 连接 mongo

```cmd
mongo
```

解决方案：https://blog.csdn.net/CaptainDrake/article/details/136480977，过程可总结为 查看并复制 mongodb 的安装目录 ——> 复制 bin 所在路径到 ~/.zshrc 文件，并命名为 path 路径

查看 mongo 版本：

```cmd
mongo -version
```

## 基本概念&数据类型

### 基本概念

以下为各个 SQL 术语和 MongoDB 术语之间的对应关系

| SQL 术语    | MongoDB 术语 |
| ----------- | ------------ |
| Database    | Database     |
| Table       | Collection   |
| Row         | Document     |
| Column      | fieId        |
| Index       | Index        |
| Table joins | 不支持       |

#### 数据库

MongoDB 的默认数据库为 "db" ，数据存储在 data 目录中

> 数据库命名规范：

- 不能是空字符串（"")
- 不得含有' '（空格)、.、$、/、\和\0 (空字符)
- 应全部小写
- 最多 64 字节

> 相关命令：

- show dbs：显示所有数据列表
- db：查看当前数据库、集合

- use 数据库名：使用指定数据库，若数据库不存在则创建
- db.dropDatabase()：删除数据库

#### 集合

集合，本质上是 一组文档，类似于关系数据库管理系统中的表格

> 集合命名规范：

- 集合名不能是空字符串""
- 集合名不能含有\0 字符（空字符)，\0 表示集合名的结尾
- 集合名不能以"system."开头，这是为系统集合保留的前缀
- 用户创建的集合名字不能含有保留字符，如#、$、%、^、&、\_、{、}、～、\

> 操作集合 API 如下：

- 查看集合：show collections 或 show tables
- 创建集合：createCollection 方法

name：集合名称；options：可选参数

```cmd
db.createCollection(name, options)
```

以下为一些可选参数示例：
暂时无法在飞书文档外展示此内容

- 更新合集名：renameCollection 方法

renameCollection：要重命名的集合的完全限定名称，需要包含数据库名

to：目标集合的完全限定名称（包括数据库名）

dropTarget（可选）：布尔值。如果目标集合已经存在，是否删除目标集合。默认值为 false。

```cmd
db.adminCommand({
  renameCollection: "sourceDb.sourceCollection",
  to: "targetDb.targetCollection",
  dropTarget:  boolean
})
```

举例：将 test 数据库中的 oldCollection 重命名为 newCollection

```cmd
db.adminCommand({
  renameCollection: "test.oldCollection",
  to: "test.newCollection"
});
```

删除集合：drop() 方法
db.collection.drop()

#### 文档

文档，MongoDB 核心概念，是一个有序的键值对集合
文档中的键是字符串，不能有重复的键名，文档中的值可以是多种不同的数据类型，可以是一个完整的内嵌文档
文档的键名命名规范：

键不能含有\0 (空字符)。这个字符用来表示键的结尾。

和$有特别的意义，只有在特定环境下才能使用。

以下划线"\_"开头的键是保留的(不是严格要求的)。

### 数据类型

<!-- | 数据类型           | 描述                          | 举例                             |
| ------------------ | ----------------------------- | -------------------------------- |
| String             | 字符串                        | { "x" : "foot"}                  |
| Integer            | 整型数值                      | { "x" : 1}                       |
| Boolean            | 布尔值                        | { "x" : true }                   |
| Double             | 双精度浮点值                  | --                               |
| Array              | 数组                          | 将数组或列表或多个值存储为一个键 |
| Object ID          | 对象id                        | --                               |
| Object             | 内嵌文档                      | { "x" : { "y" : "foot" }}        |
| Date               | 日期时间。用UNIX 时间格式存储 | --                               |
| Timestamp          | 记录文档修改或添加的具体时间  | --                               |
| Binary Data        | 二进制数据                    | --                               |
| Regular expression | 正则表达式类型                | { "x" : /foot/i}                 |
| Code               | 代码类型                      | { "x" : function(){/*..*/}}      | -->

## 基本语句

### 插入文档

常用方法如下：

| 方法         | 用途               | 是否弃用 |
| ------------ | ------------------ | -------- |
| insertOne()  | 插入单个文档       | 否       |
| insertMany() | 插入多个文档       | 否       |
| insert()     | 插入单个或多个文档 | 是       |
| save()       | 插入或更新文档     | 是       |

#### insertOne()

- 用法：

document：要插入的单个文档

options（可选）：一个可选参数对象

```cmd
db.collection.insertOne(document, options)
```

- 举例：

  ```cmd
  db.userCollection.insertOne({
    name: "Alice",
    age: 25,
    city: "New York"
  });
  ```

#### insertMany()

- 用法：

documents：要插入的文档数组

options（可选）：一个可选参数对象

```cmd
db.collection.insertMany(documents, options)
```

- 举例：

```cmd
db.userCollection.insertMany([
  { name: "Bob", age: 30, city: "Los Angeles" },
  { name: "Charlie", age: 35, city: "Chicago" }
]);
```

批量插入的性能优化：使用 insertMany() 并启用 ordered: false 选项，表示无序插入，即使某个文档插入失败，也不会影响其他文档的插入

```cmd
db.users.insertMany([
{ name: "Henry", age: 60 },
{ name: "Ivy", age: 65 }
], { ordered: false });
```

### 查询文档

常用的查询方法有 find() 、findOne() 方法

#### find()

- 用法：查询所有文档
- 语法：

query：用于查找文档的查询条件。默认为 {}，即匹配所有文档。

projection（可选）：指定返回结果中包含或排除的字段。

```cmd
db.collection.find(query, projection)
```

- 举例：

查找所有文档

```cmd
db.myCollection.find();
```

查找年龄大于 25 的文档

```cmd
db.myCollection.find({ age: { $gt: 25 } });
```

#### findOne()

- 用法：查找集合中的单个文档
- 语法：

query：用于查找文档的查询条件。默认为 {}，即匹配所有文档。

projection（可选）：指定返回结果中包含或排除的字段。

db.collection.findOne(query, projection)

- 举例：

查找单个文档：

```cmd
db.myCollection.findOne({ name: "Alice" });
```

查找单个文档，并只返回指定字段：

```cmd
db.myCollection.findOne(
    { name: "Alice" },
    { name: 1, age: 1, _id: 0 }
);
```

#### 查询条件

待补充

### 更新文档

常用方法如下：

<!-- | 方法               | 用途                                                 |
| ------------------ | ---------------------------------------------------- |
| updateOne()        | 更新匹配过滤器的单个文档                             |
| updateMany()       | 更新匹配过滤器的所有文档                             |
| replaceOne()       | 替换匹配过滤器的单个文档，新的文档将完全替换旧的文档 |
| findOneAndUpdate() | 查找并更新单个文档                                   | -->

#### updateOne()

- 用法：

filter：用于查找文档的查询条件。

update：指定更新操作的文档或更新操作符。

options：可选参数对象，如 upsert、arrayFilters 等。

```cmd
db.collection.updateOne(filter, update, options)
```

- 举例：

  ```cmd
  db.myCollection.updateOne(
    { name: "Alice" },                // 过滤条件
    { $set: { age: 26 } },            // 更新操作
    { upsert: false }                 // 可选参数
  );
  ```

#### updateMany()

filter：用于查找文档的查询条件。

update：指定更新操作的文档或更新操作符。

options：可选参数对象，如 upsert、arrayFilters 等。

```cmd
db.collection.updateMany(filter, update, options)
```

### 删除文档

常用的删除文档方法包括 deleteOne()、deleteMany() 以及 findOneAndDelete()

#### deleteOne()

- 用法：删除匹配过滤器的单个文档

filter：用于查找要删除的文档的查询条件

options（可选）：一个可选参数对象

```cmd
db.collection.deleteOne(filter, options)
```

- 举例：

  ```cmd
  db.myCollection.deleteOne({ name: "Alice" });
  ```

#### deleteMany()

- 用法：删除匹配过滤器的所有文档
- 写法同 deleteOne()

#### findOneAndDelete()

- 用法：查找并删除单个文档，可以选择返回删除的文档

- 语法：

  ```cmd
  db.collection.findOneAndDelete(filter, options)
  ```

## 索引

### 介绍

索引支持在 MongoDB 中高效执行查询，类比于图书馆中的书架编号，书本的编号。

但是过多的索引也不行，从时间角度上考虑，对于写入读取率高的集合，由于每次插入操作都必须同时更新所有索引，耗时多；从空间角度上考虑，索引也是一种数据结构，过多的索引会占据过多的空间资源

- 底层使用 [B-tree](https://en.wikipedia.org/wiki/B-tree) 数据结构

### 创建/删除索引

- 创建索引：db.collection.createIndex

```
db.<collection>.createIndex(
   { <field>: <value> },
   { name: "<indexName>" }
)
```

- 默认的索引名称

如果在创建索引时未指定名称，系统会用下划线将每个索引键字段和值连接起来，从而生成新索引的名称：

| Index                                  | 默认名称                     |
| -------------------------------------- | ---------------------------- |
| `{ score : 1 }`                        | `score_1`                    |
| `{ category : 1, locale : "2dsphere"}` | `category_1_locale_2dsphere` |

例子：

```
db.collection.createIndex( { name: 1 } )
```

- 查看索引

```
db.collection.getIndexes()
```

- 删除索引

```shell
// 删除指定的索引
db.collection.dropIndex( "indexName" )

// 删除所有索引
db.collection.dropIndexes()
```

## 事务

### 4.0 和 4.2 版本的事务

- 在 4.0 版本中，MongoDB 支持副本集上的多文档事务；
- 在 4.2 版本中，MongoDB 引入了分布式事务，增加了对分片集群上多文档事务的支持，并合并了对副本集上多文档事务的现有支持，事务可以跨多个操作、集合、数据库、文档和分片使用

### 事务的隔离级别

MongoDB 中的 WiredTiger 存储引擎是目前使用最广泛的，WiredTiger 存储引擎支持 read-uncommitted 、read-committed 和 snapshot 3 种事务隔离级别，MongoDB 启动时默认选择 snapshot 隔离；

- **Read-Uncommited（RU）**：
  - 读未提交，一个事务还没提交时，它的变更就能被别的事务看到
  - 实现原理：将事务对象中的 snap_object.snap_array 置为空即可，那么在读取 MVCC list 中的版本值时，总是读取到 MVCC list 链表头上的第一个版本数据，这样就总是能读取到最新的数据了
- **Read-Committed（RC）**：
  - 一个事务提交之后，它的变更才能被其他的事务看到
  - 实现原理：在事务在每次执行之前，都对系统机型一次快照，然后在这个事务快照中读取最新提交的数据
- **Snapshot**：
  - 快照隔离方式，对应 MySQL 的可重复读
  - 实现原理：一个事务开始时，就生成一个快照，并且只会进行一次快照，这样事务看到的值提交版本，这个值在整个事务过程中看到的都是一样

### 在 Go 的应用

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/streadway/amqp"
	"go.uber.org/zap"
	"github.com/go-kratos/kratos/v2"
	"github.com/go-kratos/kratos/v2/log"
)

type Config struct {
	AMQPURL    string
	MongoDBURL string
}

type RabbitMQConsumer struct {
	amqpConn *amqp.Connection
}

type MongoService struct {
	client *mongo.Client
}

func (r *RabbitMQConsumer) ConnectAMQP() error {
	conn, err := amqp.Dial(r.amqpConn)
	if err != nil {
		return err
	}
	defer conn.Close()
	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	// Declare a queue to receive messages
	queue, err := ch.QueueDeclare(
		"your_queue", // name
		false,        // durable
		false,        // delete when unused
		false,        // exclusive
		false,        // no-wait
		nil,          // arguments
	)
	if err != nil {
		return err
	}

	msgs, err := ch.Consume(
		queue.Name, // queue
		"",         // consumer
		false,      // auto-ack
		false,      // exclusive
		false,      // no-local
		false,      // no-wait
		nil,        // args
	)
	if err != nil {
		return err
	}
}
```

- `client.StartSession()` 用于启动一个 MongoDB 事务会话。
- `session.StartTransaction()` 启动事务。

```go
func (r *RabbitMQConsumer) startMongoTransaction() (*mongo.Session, error) {
	// 建立一个事务会话
	session, err := r.mongoService.client.StartSession()
	if err != nil {
		return nil, err
	}

	//
	err = session.StartTransaction()
	if err != nil {
		return nil, err
	}

	return session, nil
}
```

- 在 `handleMongoMessage()` 中，我们检查消息是否已经处理过，并确保操作幂等。如果消息已经处理过，就跳过当前操作。

```go
func (r *RabbitMQConsumer) handleMongoMessage(session *mongo.Session, message []byte) error {
	// Connect to MongoDB and insert or update data
	collection := r.mongoService.client.Database("your_database").Collection("your_collection")

	// Check if the message has been already processed
	var result struct {
		MessageID string `bson:"message_id"`
	}
	err := collection.FindOne(context.Background(), bson.M{"message_id": message}).Decode(&result)
	if err == nil {
		// 已经有数据了
		return nil
	}
	// 插入数据
	_, err = collection.InsertOne(
		context.Background(),
		bson.M{"message_id": message, "status": "processed"},
	)
	if err != nil {
		return err
	}

	return nil
}
```

- 消费消息流程：

```go
func (r *RabbitMQConsumer) processMessage(msg amqp.Delivery) error {
	fmt.Printf("Received message: %s\n", msg.Body)
	// 开启事务
	session, err := r.startMongoTransaction()
	if err != nil {
		return err
	}
	defer session.EndSession(context.Background())
	// 处理消息
	err = r.handleMongoMessage(session, msg.Body)
	if err != nil {
		return err
	}
	// 提交事务，使用 `session.CommitTransaction()` 提交事务，确保数据库操作的原子性。
	err = session.CommitTransaction(context.Background())
	if err != nil {
		return err
	}
	return nil
}
```

-->
