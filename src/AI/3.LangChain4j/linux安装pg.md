---
title: Linux安装PostgreSQL
date: 2025/12/04

cover: https://img.haipeng-lin.cn/20251214223315.png
coverStyle:
  layout: left
  ratio: "16:9"
  width: 300
excerpt: "1.查看系统版本 2.查看 PG 数据库版本 因为 Alibaba Cloud Linux 3 默认仓库可能不包含最新版 PostgreSQL ，需手动添加官方仓库："
tags:
  - linux
  - PostgreSQL
---

## 查看系统版本

```sh
[root@~]# cat /etc/redhat-release
Alibaba Cloud Linux release 3 (Soaring Falcon)
```

## 查看 PG 数据库版本

```sh
psql --version
```

## 通过 yum 方式安装

### 添加 PG 官方仓库

因为 Alibaba Cloud Linux 3 默认仓库可能不包含最新版 PostgreSQL ，需手动添加官方仓库：

```sh
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
```

### 安装 PG

选择版本 15：

```sh
sudo dnf install -y postgresql15-server postgresql15-contrib
```

### 报错

有可能报错：

```sh
PostgreSQL common RPMs for RHEL / Rocky / AlmaLinux 3 - x86_64                                                                100  B/s | 146  B     00:01
Errors during downloading metadata for repository 'pgdg-common':
  - Status code: 404 for https://download.postgresql.org/pub/repos/yum/common/redhat/rhel-3-x86_64/repodata/repomd.xml (IP: 147.75.85.69)
Error: Failed to download metadata for repo 'pgdg-common': Cannot download repomd.xml: Cannot download repodata/repomd.xml: All mirrors were tried
```

表示 PostgreSQL 仓库 URL 中的 **$releasever 变量被解析为 3，而官方仓库仅支持 8**。
Alibaba Cloud Linux 3 基于 RHEL 8 的软件生态，但系统的 releasever 值（通过 rpm -E %rhel 查看）为 3，导致仓库路径错误。

#### 编辑 PG 仓库文件

```sh
sudo vim /etc/yum.repos.d/pgdg-redhat-all.repo
```

#### 将所有 $releasever 替换为 8

```sh
:%s/\$releasever/8/g
```

#### 重试

```sh
sudo dnf install -y postgresql15-server postgresql15-contrib
```

## 配置 PGSQL

### 配置远程访问权限

编辑 pg 配置文件：

```sh
sudo vim /var/lib/pgsql/15/data/postgresql.conf
```

配置以下参数，注意原默认端口为 5432

```sh
listen_addresses = '*'
port = 55432
```

### 配置客户端访问规则

修改 pg_hba.conf：

```sh
sudo vim /var/lib/pgsql/15/data/pg_hba.conf
```

添加一行：

```sh
host    all    all    0.0.0.0/0    md5
```

### 重启服务

```
sudo systemctl restart postgresql-15
```

### 配置环境变量

```sh
export PATH=$PATH:/usr/pgsql-15/bin/
```

## 验证安装

### 登录数据库

默认端口为 5432，如果没修改，则不用加 -p 参数

```sh
sudo -u postgres psql -p 55432
```

### 查看版本

```sh
SELECT version();
```

### 修改密码

输入 \password 后回车，再输入密码

```sh
\password postgres
```

### 开放端口

阿里云控制台开放**55432 端口**通行

Linux 开发**55432 端口**

```sh
firewall-cmd --zone=public --add-port=55432/tcp --permanent
```

重新加载防火墙

```sh
firewall-cmd --reload
```

查看已开放的端口

```sh
firewall-cmd --zone=public --list-ports
```

## 安装 pgvector 插件

### 安装 PostgreSQL15 开发工具包

开发工具包：

```sh
yum install -y postgresql15-devel
```

centos-release-scl-rh 包：

```sh
yum install -y centos-release-scl-rh
```

### 下载/编译/安装插件

下载：

```sh
cd /tmp
git clone --branch v0.5.1 https://github.com/pgvector/pgvector.git
```

编译&安装：

```sh
cd pgvector
make & make install
```

### 选择数据库安装拓展

登录数据库：

```sh
sudo -u postgres psql -p 55432
```

安装 vector 扩展：

```sh
CREATE EXTENSION vector;
```

创建测试表：

```sh
CREATE TABLE test (id bigserial PRIMARY KEY, embedding vector(3));
```

插入测试数据：

```sh
INSERT INTO test (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

按与给定向量相似度(L2 distance)排序，显示前 5 条：

```sh
SELECT * FROM test ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```
