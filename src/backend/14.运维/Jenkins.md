---
title: Jenkins
date: 2026-08-05
article: false
---

# Jenkins 学习笔记

## Jenkins 基础与核心概念

### CI/CD 理念

**持续集成（Continuous Integration，CI）**

- 开发者将代码频繁合并到主干分支
- 每次合并自动触发构建与测试
- 快速发现集成错误，减少集成风险
- 核心价值：**自动化验证代码质量**

**持续交付（Continuous Delivery，CD）**

- 代码在每个阶段都通过自动化测试
- 手动控制何时将代码部署到生产环境
- 确保软件始终处于可发布状态

**持续部署（Continuous Deployment，CD）**

- 代码变更自动部署到生产环境
- 无需人工干预，完全自动化
- 要求：完善的自动化测试体系

**Jenkins 在软件开发生命周期中的角色**

```
代码编写 → 代码提交 → CI构建 → 自动测试 → 质量分析 → 部署到测试环境 → 部署到生产环境
                          ↑
                    Jenkins 自动化调度
```

### Jenkins 简介与架构

**主从架构（Master/Agent）**

```
                    ┌─────────────┐
                    │   Master    │
                    │  (调度节点)  │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
      ┌────┴────┐    ┌────┴────┐    ┌────┴────┐
      │ Agent  │    │ Agent  │    │ Agent  │
      │ (节点1) │    │ (节点2) │    │ (节点3) │
      └────────┘    └────────┘    └────────┘
```

- **Master（主节点）**：负责 Jenkins 管理、任务调度、视图构建、插件管理
- **Agent（从节点）**：负责执行具体的构建任务，可以是物理机、虚拟机或容器

### 环境搭建与部署

**Docker 快速部署**

```bash
# 创建数据持久化目录
mkdir -p /data/jenkins_home

# 启动 Jenkins 容器
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v /data/jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

# 查看初始管理员密码
docker logs jenkins 2>&1 | grep -A 5 "Please memorize the password"
```

**基础配置步骤**

1. **解锁 Jenkins**：访问 `http://localhost:8080`，输入初始管理员密码
2. **安装推荐插件**：选择"安装推荐插件"
3. **配置管理员用户**：设置用户名、密码、邮箱
4. **配置国内插件镜像源**

```
管理 Jenkins → 插件管理 → 高级设置 → 升级站点
URL: https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```

## 核心功能与基础实战

### 插件与凭据管理

**常用插件推荐**

| 插件名称          | 用途               |
| ----------------- | ------------------ |
| Git               | 代码拉取与分支管理 |
| Maven Integration | Maven 项目构建支持 |
| Pipeline          | 流水线脚本支持     |
| Docker Pipeline   | Docker 容器构建    |
| Publish Over SSH  | 远程服务器部署     |
| Blue Ocean        | 可视化流水线界面   |
| SonarQube Scanner | 代码质量扫描       |
| Email Extension   | 邮件通知增强       |

**凭据管理**

```
路径：Manage Jenkins → Credentials → Stores scoped to Jenkins → Global credentials
```

支持的凭据类型：

- **用户名/密码**：Git 账号、云服务器登录
- **SSH Username with private key**：Git SSH 密钥、服务器 SSH 免密登录
- **Secret file**：敏感文件，如证书
- **Secret text**：API Token、密钥字符串

### 自由风格项目（Freestyle Job）

**创建第一个构建任务**

1. 新建任务 → 输入任务名称 → 选择"自由风格项目"
2. 配置源码管理：选择 Git，填入仓库地址，选择凭据
3. 配置构建触发器

```
构建触发器 → SCM轮询 → H/5 * * * * (每5分钟检查一次代码变更)
或
构建触发器 → 触发远程构建 → 生成认证令牌
```

4. 添加构建步骤

```bash
# Shell 构建脚本示例
echo "========== 开始构建 =========="
mvn clean package -DskipTests
echo "========== 构建完成 =========="
```

**全局工具配置**

```
路径：Manage Jenkins → Global Tool Configuration
```

配置项：

- JDK：指定 JDK 安装路径或自动安装
- Maven：指定 Maven 版本和 settings.xml
- Node.js：指定 Node 版本和包管理器

### 日志与排查

**查看构建日志**

- **控制台输出**：任务页面 → 左侧"控制台输出"
- **系统日志**：`Manage Jenkins → System Log`

**常见构建失败排查**

```bash
# 权限不足
chmod +x /path/to/script

# 环境变量问题
echo $PATH
env | grep -E "JAVA|MVN|GIT"

# 磁盘空间不足
df -h
```

## 进阶核心：Pipeline（流水线）

### Pipeline 基础概念

**Jenkinsfile 的作用**

- 将流水线定义为代码，纳入版本控制
- 支持代码审查、版本回滚
- 声明式语法更易读和维护

**声明式 vs 脚本式 Pipeline**

| 特性     | 声明式           | 脚本式          |
| -------- | ---------------- | --------------- |
| 语法     | 简洁的声明式语法 | Groovy 脚本语法 |
| 学习曲线 | 平缓             | 较陡            |
| 灵活性   | 受限             | 高度灵活        |
| 建议     | **首选**         | 复杂场景使用    |

### 核心语法与指令

**基础结构**

```groovy
pipeline {
    agent any                    // 执行节点

    options {                   // 全局选项
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    parameters {                // 参数化构建
        string(name: 'BRANCH', defaultValue: 'main', description: '分支名称')
        choice(name: 'ENV', choices: ['dev', 'test', 'prod'], description: '部署环境')
    }

    environment {              // 环境变量
        APP_NAME = 'my-app'
    }

    stages {                   // 阶段列表
        stage('Checkout') {    // 代码拉取
            steps {
                echo '正在拉取代码...'
                git branch: params.BRANCH,
                    credentialsId: 'git-cred',
                    url: 'https://github.com/example/repo.git'
            }
        }

        stage('Build') {       // 构建阶段
            steps {
                echo '正在构建...'
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Test') {        // 测试阶段
            steps {
                echo '正在测试...'
                sh 'mvn test'
            }
            post {             // 构建后动作
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Deploy') {      // 部署阶段
            when {             // 条件执行
                expression { params.ENV == 'prod' }
            }
            steps {
                echo '正在部署到生产环境...'
                sh 'bash deploy.sh'
            }
        }
    }

    post {                     // 最终状态处理
        always {
            echo '构建完成'
        }
        success {
            echo '构建成功！'
        }
        failure {
            echo '构建失败！'
        }
    }
}
```

**environment：定义环境变量**

```groovy
environment {
    JAVA_HOME = tool name: 'JDK17'
    PATH = "${JAVA_HOME}/bin:${PATH}"
}
```

**tools：自动安装构建工具**

```groovy
tools {
    maven 'Maven3.9'
    jdk 'JDK17'
}
```

**when：条件执行**

```groovy
when {
    allOf {                    // 所有条件满足
        branch 'main'
        expression { env.BUILD_NUMBER.toInteger() > 10 }
    }
}
// 或
when {
    anyOf {                    // 任一条件满足
        branch 'main'
        branch 'develop'
    }
}
```

**parallel：并行执行**

```groovy
stage('并行测试') {
    parallel {
        stage('单元测试') {
            steps {
                sh 'mvn test'
            }
        }
        stage('集成测试') {
            steps {
                sh 'mvn verify -P integration'
            }
        }
        stage('UI测试') {
            steps {
                sh 'playwright test'
            }
        }
    }
}
```

**input：人工审批**

```groovy
stage('人工审批') {
    steps {
        input message: '确认部署到生产环境?',
              ok: '确认部署',
              submitter: 'admin,dev-lead'
    }
}
```

**post：构建后动作**

```groovy
post {
    always {                   // 总是执行
        deleteDir()            // 清理工作空间
    }
    success {                 // 构建成功时
        echo '✅ 构建成功'
    }
    failure {                  // 构建失败时
        echo '❌ 构建失败'
    }
    changed {                  // 构建状态改变时
        echo '构建状态与上次不同'
    }
    unstable {                 // 不稳定状态
        echo '构建不稳定'
    }
}
```

### Pipeline 实战演练

**标准 CI/CD 流水线**

```groovy
pipeline {
    agent { label 'docker' }

    environment {
        REGISTRY = 'registry.example.com'
        IMAGE_NAME = 'myapp'
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT[0..7]}"
    }

    stages {
        stage('代码拉取') {
            steps {
                git credentialsId: 'git-cred',
                    url: 'https://github.com/example/project.git',
                    branch: 'main'
            }
        }

        stage('构建') {
            steps {
                script {
                    def gradleHome = tool name: 'Gradle7'
                    sh """
                        export PATH=${gradleHome}/bin:$PATH
                        gradle clean build -x test
                    """
                }
            }
        }

        stage('单元测试') {
            steps {
                script {
                    def gradleHome = tool name: 'Gradle7'
                    sh """
                        export PATH=${gradleHome}/bin:$PATH
                        gradle test
                    """
                }
            }
            post {
                always {
                    junit 'build/test-results/**/*.xml'
                    cobertura coberturaReportFile: 'build/reports/cobertura/coverage.xml'
                }
            }
        }

        stage('构建 Docker 镜像') {
            steps {
                script {
                    appImage = docker.build("${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('推送镜像') {
            steps {
                script {
                    docker.withRegistry('https://' + REGISTRY, 'docker-hub-cred') {
                        appImage.push()
                        appImage.push('latest')
                    }
                }
            }
        }

        stage('部署到测试环境') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'test-server',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'deploy/test/**',
                                    remoteDirectory: '/opt/myapp',
                                    execCommand: 'bash /opt/myapp/deploy.sh test'
                                )
                            ]
                        )
                    ]
                )
            }
        }

        stage('集成测试') {
            steps {
                sh """
                    curl -f http://test.example.com/health || exit 1
                """
            }
        }

        stage('部署到生产环境') {
            when {
                branch 'main'
            }
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'prod-server',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: 'deploy/prod/**',
                                    remoteDirectory: '/opt/myapp',
                                    execCommand: 'bash /opt/myapp/deploy.sh prod'
                                )
                            ]
                        )
                    ]
                )
            }
        }
    }

    post {
        always {
            emailext(
                subject: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${currentBuild.result ?: 'SUCCESS'}",
                body: """
                    构建状态: ${currentBuild.result ?: 'SUCCESS'}
                    构建编号: ${env.BUILD_NUMBER}
                    构建链接: ${env.BUILD_URL}
                """,
                to: 'dev-team@example.com'
            )
        }
    }
}
```

**集成 SonarQube 代码质量分析**

```groovy
pipeline {
    agent any

    tools {
        maven 'Maven3.9'
        sonarScanner 'SonarQubeScanner'
    }

    stages {
        stage('代码分析') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        mvn sonar:sonar \
                            -Dsonar.projectKey=my-project \
                            -Dsonar.host.url=http://sonarqube:9000 \
                            -Dsonar.login=your-token
                    '''
                }
            }
        }

        stage('质量 gate 检查') {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }
    }
}
```

## 自动化部署与高级集成

### 自动化部署实践

**远程部署架构**

```
Jenkins Master
      │
      │ SSH/WEBHOOK
      ↓
┌─────────────┐    SCP/SSH     ┌──────────────┐
│  构建服务器  │ ────────────→ │  目标服务器   │
│  (Artifact) │               │  (应用服务)   │
└─────────────┘               └──────────────┘
```

**Publish Over SSH 配置**

```groovy
sshPublisher(
    publishers: [
        sshPublisherDesc(
            configName: 'prod-server',
            transfers: [
                sshTransfer(
                    sourceFiles: 'target/*.jar',
                    removePrefix: 'target',
                    remoteDirectory: '/opt/app',
                    execCommand: '/opt/app/restart.sh'
                )
            ],
            usePromotionTimestamp: false,
            failOnMissing: true,
            alwaysPublishFromMaster: false,
            configurationNode: 'master'
        )
    ]
)
```

**重启脚本示例**

```bash
#!/bin/bash
# restart.sh
APP_NAME="myapp"
APP_DIR="/opt/app"
JAR_FILE="$APP_DIR/myapp.jar"
PID_FILE="/var/run/myapp.pid"

# 停止旧进程
if [ -f $PID_FILE ]; then
    kill $(cat $PID_FILE) || true
    rm $PID_FILE
fi

# 启动新进程
nohup java -jar $JAR_FILE --spring.profiles.active=prod > /var/log/myapp.log 2>&1 &
echo $! > $PID_FILE

echo "应用启动完成，PID: $(cat $PID_FILE)"
```

**Docker 容器化部署**

```groovy
stage('部署到 K8s') {
    steps {
        script {
            withCredentials([file(credentialsId: 'k8s-config', variable: 'KUBECONFIG')]) {
                sh """
                    kubectl set image deployment/${APP_NAME} \
                        ${APP_NAME}=${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} \
                        --namespace=production

                    kubectl rollout status deployment/${APP_NAME} \
                        --namespace=production
                """
            }
        }
    }
}
```

### 分布式构建

**添加从节点**

1. `Manage Jenkins → Manage Nodes → New Node`
2. 配置节点信息
   - 名称：agent-1
   - 执行器数量：2
   - 远程工作目录：`/home/jenkins/agent`
   - 标签：`docker-builder`
   - 启动方式：Launch agent agents via SSH

**SSH 启动从节点配置**

```
启动方式：Launch agent agents via SSH
主机：192.168.1.100
凭据：选择 SSH 凭据
主机密钥验证：Known hosts file
```

**Jenkins Agent 连接方式对比**

| 方式           | 优点           | 缺点          |
| -------------- | -------------- | ------------- |
| SSH            | 配置简单、安全 | 需要 SSH 服务 |
| Java Web Start | 不需要 SSH     | 需要配置 Java |
| 容器           | 环境隔离、灵活 | 资源开销      |

### 消息通知与反馈

**邮件通知配置**

```groovy
post {
    failure {
        mail to: 'dev@example.com',
             subject: "构建失败: ${env.JOB_NAME}",
             body: "构建 ${env.BUILD_NUMBER} 失败，请检查: ${env.BUILD_URL}"
    }
}
```

**Email Extension 插件增强配置**

```groovy
emailext(
    subject: '🎯 Jenkins 构建报告 - ${JOB_NAME} #${BUILD_NUMBER}',
    body: '''
        <h2>构建信息</h2>
        <table>
            <tr><td>项目名称</td><td>${JOB_NAME}</td></tr>
            <tr><td>构建编号</td><td>${BUILD_NUMBER}</td></tr>
            <tr><td>构建状态</td><td>${BUILD_STATUS}</td></tr>
            <tr><td>触发方式</td><td>${BUILD_TRIGGER}</td></tr>
            <tr><td>构建耗时</td><td>${BUILD_DURATION}</td></tr>
        </table>
        <h2>构建日志</h2>
        <pre>${BUILD_LOG, maxLines=50}</pre>
        <a href="${BUILD_URL}">点击查看详情</a>
    ''',
    mimeType: 'text/html',
    to: 'dev-team@example.com'
)
```

**Slack 通知**

```groovy
post {
    success {
        slackSend(
            channel: '#devops',
            color: 'good',
            message: "✅ 构建成功: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        )
    }
    failure {
        slackSend(
            channel: '#devops',
            color: 'danger',
            message: "❌ 构建失败: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n<${env.BUILD_URL}|查看详情>"
        )
    }
}
```

## 最佳实践

### Jenkinsfile 组织建议

1. **拆分公共流水线**：使用共享库（Shared Library）
2. **参数化构建**：适应不同环境、不同分支
3. **优雅的错误处理**：善用 try-catch 和 post 部分
4. **日志输出规范**：清晰标识阶段和步骤

### 安全建议

- 凭据加密存储，不在日志中暴露
- 定期更新 Jenkins 和插件版本
- 使用矩阵权限控制用户访问
- 构建节点隔离，不赋予 Master 过多权限

### 性能优化

- 合理设置执行器数量
- 配置构建记录保留策略
- 使用增量构建减少工作量
- 为不同任务配置专属 Agent 节点
