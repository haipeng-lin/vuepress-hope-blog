---
title: Certbot工具配置ssl证书
date: 2025/12/04
category: 部署
---

## 环境信息

> **Alibaba Cloud Linux 3**

## 安装 Certbot

安装 epel-release

```sh
sudo yum install epel-release -y
```

可能会报错，报错信息如下：

原因：我们正在使用的系统已经安装了一个阿里云定制版的 EPEL 源配置包，而你现在试图安装标准的（原生）EPEL 源配置包，这两个包互相冲突，不能同时存在。

```sh
Last metadata expiration check: 6:19:57 ago on Mon 01 Dec 2025 09:28:37 AM CST.
Error:
 Problem: problem with installed package epel-aliyuncs-release-8-15.1.al8.noarch

  - package epel-aliyuncs-release-8-15.1.al8.noarch from @System conflicts with epel-release provided by epel-release-8-22.el8.noarch from epel
  - package epel-aliyuncs-release-8-15.1.al8.noarch from alinux3-updates conflicts with epel-release provided by epel-release-8-22.el8.noarch from epel
  - conflicting requests
    (try to add '--allowerasing' to command line to replace conflicting packages or '--skip-broken' to skip uninstallable packages or '--nobest' to use not only best candidate packages)
```

解决方案：将安装的阿里云版本替换成原版，替换成标准的 `epel-release`，添加 `--allowerasing` 参数

```sh
sudo yum install epel-release --allowerasing
```

安装 epel-release 成功之后，安装 certbot

```sh
yum install certbot -y
```

## 申请证书

申请的证书可分为两种：

- 主域名：如 haipeng-lin.cn
- 泛域名：如 \*.haipeng-lin.cn，适配 admin.haipeng-lin.cn、blog.haipeng-lin.cn 等等

申请命令如下：

- -email：指定邮箱
- -d：要申请证书的域名

```shell
certbot certonly \
--server https://acme-v02.api.letsencrypt.org/directory \
--manual --preferred-challenges dns \
--agree-tos \
--email haipeng_lin@163.com \
-d haipeng-lin.cn \
-d *.haipeng-lin.cn
```

到 服务器添加一条 DNS 域名解析记录：

添加完毕，回车，便会出现证书路径：

```shell
/etc/letsencrypt/live/haipeng-lin.cn/fullchain.pem;
/etc/letsencrypt/live/haipeng-lin.cn/privkey.pem;
```

## 续签证书

注意，该命令不是自动续签命令，仅仅是续签命令

```shell
certbot certonly --force-renewal --manual -d '*.haipeng-lin.cn' \
--preferred-challenges dns \
--server https://acme-v02.api.letsencrypt.org/directory
```

- certonly：只申请证书，而不部署证书
- --force-renewal：强制更新
- --manual：手动模式
- -d：域名
- `--preferred-challenges dns`: 指定验证所有权的方式为 DNS 挑战
- `--server https://acme-v02.api.letsencrypt.org/directory`: 指定使用 Let's Encrypt 的 ACME v2 API 地址

## 自动续期

在开始 “自动续期” 之前，我们需要删除之前手动安装的 ssl 证书

- 查询安装的证书

```shell
certbot certificates
```

- 删除证书

```shell
certbot delete --cert-name haipeng-lin.cn
```

下面演示 Cloudflare 自动部署 ssl 证书

### 安装插件

```shell
yum install python3-certbot-dns-cloudflare -y
```

### 获取 API 令牌

- 登录 Cloudflare 控制台
- 进入 **My Profile > API Tokens**
- 点击 **Create Token**，选择 **Edit Cloudflare DNS** 模板。

### 创建凭证文件

```shell
touch /etc/letsencrypt/cloudflare.ini
chmod 600 /etc/letsencrypt/cloudflare.ini
```

写入以下内容

```shell
dns_cloudflare_api_token = 你的凭证
```

### 申请命令

```shell
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  --dns-cloudflare-propagation-seconds 20 \
  --cert-name haipeng-lin.cn \
  -d "haipeng-lin.cn" \
  -d "*.haipeng-lin.cn" \
  --deploy-hook "nginx -s reload"
```

### 验证

```shell
certbot renew --dry-run
```

--dry-run：模拟续期（不产生真证书），用于测试配置是否正确

### 定期检查

使用 certbot 自带的定时工具实现

```shell
certbot -e
```

后加以下内容

```shell
0 3 * * * certbot renew -q
```

每天凌晨 3 点静默执行命令：certbot renet

- 如果证书还没到期（剩余时间 > 30 天）：不用申请证书
- 否则，后台静默完成 DNS 挑战、下载新证书、替换旧证书，并触发之前设置的 `deploy-hook`（重启 Nginx）

并检查

```shell
certbot -l
```
