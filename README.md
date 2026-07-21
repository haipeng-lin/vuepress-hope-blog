# VuePress Hope Blog

## 预览地址

[博客](https://blog.haipeng-lin.cn/)

本站基于 VuePress + vuepress-theme-hope 主题构建，进行了个性化定制：

- 简洁美观的 UI 设计
- 深色/浅色模式切换
- 集成 Twikoo 评论系统
- 集成 Umami 站点统计

## 使用教程

`shell

# 克隆代码

git clone git@github.com:haipeng-lin/vuepress-hope-blog.git

# 安装依赖

npm install

# 运行

npm docs:dev

# 部署

npm docs:build
`

## 目录结构

`src/
├── .vuepress/ # VuePress 配置
│ ├── config.ts # 主配置文件
│ ├── theme.ts # 主题配置
├── AI/ # AI 相关文章
├── backend/ # 后端
├── note/ # 笔记
├── more/ # 更多
└── README.md # 首页
