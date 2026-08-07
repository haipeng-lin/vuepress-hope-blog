---
title: K8s
date: 2026-08-06
article: false
---

## K8s 概述

K8s 的全称是 Kubernetes ，是一个可移植、可扩展的开源平台，用于管理容器化的工作负载和服务，方便进行声明式配置和自动化

**核心特性：**

- 服务发现和负载均衡：可以使用 DNS 名称或自己的 IP 地址来暴露容器。 如果进入容器的流量很大， Kubernetes 可以负载均衡并分配网络流量，从而使部署稳定
- 自动部署和回滚：部署或者回滚项目
- 存储编排：允许自动挂载选择的存储系统，例如本地存储、公共云提供商等
- 自我修复

**核心架构：**

K8s 是属于`Master-Worker架构`，即有 Master 节点负责核心的调度、管理和运维，Worker 节点则执行用户的程序。在 K8s 中，主节点一般被称为`Master Node` ，而从节点则被称为`Worker Node` 或者 Node

Master Node 组件：

- `kube-apiserver`。请求入口服务，API Server 负责接收 K8s 所有请求并根据用户的具体请求，去通知其他组件干活
- `Scheduler`。所有 Worker Node 的调度器，当用户要部署服务时，Scheduler 会选择最合适的 Worker Node 来部署
- `Controller Manager`。所有 Worker Node 的监控器，Controller Manager 有很多具体的 Controller，Node Controller、Service Controller、Volume Controller 等。Controller 负责监控和调整在 Worker Node 上部署的服务的状态，比如用户要求 A 服务部署 2 个副本，那么当其中一个服务挂了的时候，Controller 会马上调整，让 Scheduler 再选择一个 Worker Node 重新部署服务
- `etcd`。存储服务，存储了 `K8s 的关键配置和用户配置`，K8s 中仅 API Server 才具备读写权限，其他组件必须通过 API Server 的接口才能读写数据

Worker Node 组件：

- `Kubelet`。Worker Node 的监视器，以及与 Master Node 的通讯器。Kubelet 是 Master Node
  安插在 Worker Node 上的"眼线"，它会定期向 Master Node 汇报自己 Node 上运行的服务的状态，并接受来自 Master Node 的指示采取调整措施。负责控制所有容器的启动停止，保证节点工作正常
- `Kube-Proxy`。K8s 的网络代理。Kube-Proxy 负责 Node 在 K8s 的网络通讯、以及对外部网络流量的负载均衡
- `Container Runtime。Worker Node 的运行环境`。即安装了容器化所需的[ 软件](https://jishuzhan.net/article/1883916347792953345#)环境确保容器化程序能够跑起来，比如 Docker Engine 运行环境

## K8s 安装

### Mac

待写

## K8s 基础命令

### Namespace

命名空间，用于实现集群内的资源隔离

- **查看所有命名空间**：`kubectl get namespaces` 或 `kubectl get ns`
- **创建命名空间**：`kubectl create namespace <命名空间名>`
- **查看命名空间详情**：`kubectl describe ns <命名空间名>`
- **删除命名空间**：`kubectl delete ns <命名空间名>`
- **切换当前默认命名空间**：`kubectl config set-context --current --namespace=<命名空间名>`
- **查看当前所在命名空间**：`kubectl config view --minify`

### Pod

最小计算单元，K8s 中最小的部署和调度单位

- **查看 Pod 列表**：`kubectl get pods` _(加 `-o wide` 可查看 Pod IP 和所在节点)_
- **查看当前命名空间所有资源**：`kubectl get all` _(包含 Pod、Service 等)_
- **快速运行一个测试 Pod**：`kubectl run <Pod名> --image=<镜像名>`
- **通过 YAML 部署 Pod**：`kubectl apply -f <pod.yaml>`
- **查看 Pod 详细状态与事件**：`kubectl describe pod <Pod名>` _(排查 Pending/CrashLoopBackOff 等异常的核心命令)_
- **查看 Pod 运行日志**：`kubectl logs <Pod名>` _(加 `-f` 实时追踪，加 `-c <容器名>` 指定多容器 Pod 中的某个容器)_
- **进入 Pod 容器内部**：`kubectl exec -it <Pod名> -- /bin/bash`
- **删除 Pod**：`kubectl delete pod <Pod名>`

### Deployment

部署控制器，负责管理 Pod 的副本数、滚动更新和自愈

- **查看 Deployment 列表**：`kubectl get deployments` 或 `kubectl get deploy`
- **快速创建 Deployment**：`kubectl create deployment <名称> --image=<镜像名>`
- **手动扩缩容**：`kubectl scale deployment <名称> --replicas=<副本数>`
- **滚动更新镜像**：`kubectl set image deployment/<名称> <容器名>=<新镜像>`
- **查看更新历史与状态**：`kubectl rollout history deployment/<名称>`
- **回滚到上一版本**：`kubectl rollout undo deployment/<名称>`
- **删除 Deployment**：`kubectl delete deployment <名称>`

### Service

服务发现与负载均衡，为 Pod 提供稳定的网络入口

- **查看 Service 列表**：`kubectl get services` 或 `kubectl get svc`
- **暴露 Deployment 为 Service**：`kubectl expose deployment <名称> --port=80 --target-port=80 --type=NodePort`
- **查看 Service 详情**：`kubectl describe svc <Service名>`
- **本地端口转发**：`kubectl port-forward svc/<Service名> <本地端口>:<Service端口>` _(将集群内服务映射到 Mac 本地进行浏览器调试)_
- **删除 Service**：`kubectl delete svc <Service名>`
