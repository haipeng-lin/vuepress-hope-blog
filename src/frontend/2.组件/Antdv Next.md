---
title: Antdv Next
date: 2026-07-22
article: false
---

## 初识与准备

### 什么是 Antdv Next

Antdv Next 是专为 Vue 3 打造的、对标 Ant Design v6 的下一代 UI 组件库。它并非简单的 Ant Design Vue 升级版，而是一次从设计理念到 API 风格的全面重构。

**核心定位：**

- 面向 Vue 3 的原生开发体验
- 对标 Ant Design v6 的功能与设计
- 彻底"去 React 化"的 API 设计

**为什么选择它：**

- 告别"React 味儿"：不再需要用 Vue 的思维去适配 React 风格的 API
- 纯粹的 Vue 原生开发体验：插槽优先、Composition API 优先
- 更现代的设计体系：与 Ant Design v6 保持同步的设计语言

**与传统 Ant Design Vue 的核心区别：**

| 对比项     | Ant Design Vue              | Antdv Next               |
| ---------- | --------------------------- | ------------------------ |
| API 风格   | 借鉴 React 的 children 模型 | 插槽（Slots）优先        |
| 配置方式   | Props 堆叠                  | 统一的上下文参数模型     |
| 历史包袱   | 兼容 Vue 2 遗留设计         | 全新架构，无历史负担     |
| TypeScript | 支持但不够彻底              | 全面拥抱，类型推断完善   |
| CSS 方案   | CSS-in-JS / 传统 CSS        | zeroRuntime 零运行时方案 |

### 环境准备与快速上手

**安装依赖：**

```bash
npm install antdv-next
# 或使用 pnpm
pnpm add antdv-next
```

**极简接入：**

```vue
<template>
  <a-config-provider :theme="themeConfig">
    <App />
  </a-config-provider>
</template>

<script setup>
import { ConfigProvider } from "antdv-next";

const themeConfig = {
  token: {
    colorPrimary: "#1890ff",
  },
};
</script>
```

**样式系统解析：**

Antdv Next 支持 CSS-in-JS 与 zeroRuntime 两种模式：

1. **CSS-in-JS 模式**：动态主题能力，适合需要运行时换肤的场景
2. **zeroRuntime 模式**：编译时生成静态 CSS，性能更优，包体积更小

```vue
<!-- 基础组件使用 -->
<template>
  <a-button type="primary">Hello Antdv Next</a-button>
  <a-input v-model:value="value" placeholder="请输入" />
</template>

<script setup>
import { Button, Input } from "antdv-next";
import { ref } from "vue";

const value = ref("");
</script>
```

## 核心设计理念（重点）

### 彻底"去 React 化"的 API 设计

Antdv Next 最重要的设计哲学就是**为 Vue 开发者原生设计**，而不是照搬 React 生态的思路。

**插槽（Slots）优先：**

Antdv Next 的插槽语义更清晰，命名更符合 Vue 开发者习惯。例如 Table 的单元格插槽从 React 风格的 `render` 函数改为 Vue 风格的 `bodyCell` 插槽：

```vue
<!-- Antdv Next：简洁的插槽语法 -->
<a-table :columns="columns" :data-source="data">
  <template #bodyCell="{ column, record }">
    <span v-if="column.key === 'action'">
      <a-button size="small">编辑</a-button>
    </span>
  </template>
</a-table>
```

对比传统 Ant Design Vue（需要使用 `slots` 配置 + `render` 函数）：

```vue
<!-- 传统写法需要额外的配置对象 -->
<template>
  <a-table :columns="columns" :data-source="data" />
</template>
<script setup>
const columns = [
  {
    key: 'action',
    dataIndex: 'action',
    title: '操作',
    slots: { customRender: 'action' },
  },
]
</script>
```

**命名语义调整：**

| Ant Design Vue  | Antdv Next  | 说明                  |
| --------------- | ----------- | --------------------- |
| `rootClassName` | `rootClass` | 命名更简洁            |
| `bordered`      | `border`    | 更符合 Vue 开发者习惯 |
| `size`          | `size`      | 保持一致              |

**统一的上下文参数模型：**

Antdv Next 在处理复杂组件时，提供了更统一的参数传递方式：

```vue
<template>
  <a-table :columns="columns" :data-source="data">
    <template #bodyCell="{ column, record }">
      <span v-if="column.key === 'action'">
        <a-button size="small" @click="handleEdit(record)">编辑</a-button>
      </span>
    </template>
  </a-table>
</template>

<script setup>
// 渲染函数的参数结构清晰统一
const columns = [
  { key: "name", dataIndex: "name", title: "姓名" },
  { key: "action", title: "操作" },
];
</script>
```

### 拥抱 Vue 3 生态

**全面拥抱 Composition API 与 TypeScript：**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import type { TableProps, TableColumn } from "antdv-next";

interface DataItem {
  id: number;
  name: string;
  age: number;
}

const data = ref<DataItem[]>([]);

const columns: TableColumn<DataItem>[] = [
  { key: "name", dataIndex: "name", title: "姓名" },
  { key: "age", dataIndex: "age", title: "年龄" },
];
</script>
```

**浅响应式模型在复杂组件中的应用：**

Table 等复杂组件内部使用 `shallowRef` 优化性能，但在使用时需要注意：

```vue
<script setup>
import { shallowRef } from "vue";

// ✅ 正确：用于大型数据结构
const tableData = shallowRef([]);

// ❌ 错误：深层响应式开销大
const tableData = ref([]);
</script>
```

**注意事项：**

- 避免在表格数据内部嵌套 Vue 响应式对象
- 筛选/排序操作后需要手动触发更新
- 虚拟列表场景下数据量过大会影响滚动性能

## 常用组件实战与亮点

### 基础组件

#### Button：水波纹效果的全局配置与使用

```vue
<template>
  <a-button type="primary" @click="handleClick"> 主要按钮 </a-button>
  <a-button danger>危险按钮</a-button>
  <a-button :loading="loading" @click="handleLoading"> 加载中 </a-button>
</template>

<script setup>
import { Button } from "antdv-next";
import { ref } from "vue";

const loading = ref(false);

const handleClick = () => {
  console.log("按钮点击");
};

const handleLoading = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};
</script>
```

**水波纹效果配置：**

```vue
<a-config-provider
  :theme="{
    token: {
      // 配置全局水波纹颜色
      waveColor: '#1890ff',
    },
  }"
>
  <App />
</a-config-provider>
```

#### Input：四种输入形态变体及聚焦边框效果

```vue
<template>
  <!-- 基础输入框 -->
  <a-input v-model:value="input1" placeholder="基础输入框" />

  <!-- 前缀/后缀输入框 -->
  <a-input v-model:value="input2" placeholder="带图标的输入框">
    <template #prefix>
      <SearchOutlined />
    </template>
    <template #suffix>
      <ClearOutlined @click="input2 = ''" />
    </template>
  </a-input>

  <!-- 搜索框 -->
  <a-input-search
    v-model:value="input3"
    placeholder="搜索"
    @search="onSearch"
  />

  <!-- 文本域 -->
  <a-textarea v-model:value="textarea" placeholder="多行文本输入" :rows="4" />
</template>

<script setup>
import { ref } from "vue";
import { Input } from "antdv-next";

const input1 = ref("");
const input2 = ref("");
const input3 = ref("");
const textarea = ref("");

const onSearch = (value: string) => {
  console.log("搜索:", value);
};
</script>
```

**聚焦边框效果：**

```vue
<a-input v-model:value="value" :focus="true" class="custom-focus-input" />

<style>
.custom-focus-input {
  --antd-wave-shadow-color: #1890ff;
}
</style>
```

### 数据录入与展示

#### Form（表单）：复杂表单布局与滚动体验

```vue
<template>
  <a-form ref="formRef" :model="formState" :rules="rules" layout="inline">
    <!-- 一行展示多个组件 -->
    <a-row :gutter="16">
      <a-col :span="8">
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email" />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="formState.phone" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Form, Input, Row, Col } from "antdv-next";

const formRef = ref();
const formState = reactive({
  name: "",
  email: "",
  phone: "",
});

const rules = {
  name: [{ required: true, message: "请输入姓名" }],
  email: [
    { required: true, message: "请输入邮箱" },
    { type: "email", message: "请输入正确的邮箱格式" },
  ],
  phone: [{ required: true, message: "请输入手机号" }],
};

// 滚动到错误字段
const scrollToError = async () => {
  try {
    await formRef.value.validate();
  } catch (error) {
    // 表单验证失败，自动滚动到第一个错误字段
    formRef.value.scrollToField(error.fields[0].name);
  }
};
</script>
```

#### Table（表格）：列的响应式、虚拟列表

```vue
<template>
  <!-- 基础表格 -->
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="pagination"
    :scroll="{ x: 1200 }"
    @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a-badge :status="record.online ? 'success' : 'default'" />
        {{ record.name }}
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button type="link" size="small" @click="handleEdit(record)">
          编辑
        </a-button>
        <a-popconfirm title="确定删除？" @confirm="handleDelete(record)">
          <a-button type="link" size="small" danger>删除</a-button>
        </a-popconfirm>
      </template>
    </template>
  </a-table>

  <!-- 虚拟列表表格（大数据场景） -->
  <a-table
    :columns="columns"
    :data-source="largeData"
    :virtual="true"
    :scroll="{ y: 400 }"
  />
</template>

<script setup>
import { ref, reactive } from "vue";
import { Table, Badge, Button, Popconfirm } from "antdv-next";

// 列的响应式配置
const columns = reactive([
  { key: "name", dataIndex: "name", title: "姓名", width: 150, ellipsis: true },
  { key: "age", dataIndex: "age", title: "年龄", width: 100 },
  { key: "address", dataIndex: "address", title: "地址", responsive: ["lg"] }, // 小屏幕隐藏
  { key: "action", title: "操作", width: 180, fixed: "right" },
]);

const data = ref([
  { id: 1, name: "张三", age: 18, address: "北京市朝阳区" },
  { id: 2, name: "李四", age: 20, address: "上海市浦东新区" },
]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 100,
});

// 模拟大数据
const largeData = ref(
  Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 18 + (i % 50),
    address: `地址${i + 1}`,
  }))
);

const handleTableChange = (pag: any, filters: any, sorter: any) => {
  console.log("分页变化:", pag);
  console.log("筛选:", filters);
  console.log("排序:", sorter);
};

const handleEdit = (record: any) => {
  console.log("编辑:", record);
};

const handleDelete = (record: any) => {
  console.log("删除:", record);
};
</script>
```

### 特色/新增组件

#### Waterfall（瀑布流）

```vue
<template>
  <a-waterfall :data="imageList" :column="3" :gutter="16" :height="400">
    <template #item="{ item }">
      <div class="waterfall-item">
        <img :src="item.src" :alt="item.title" />
        <p>{{ item.title }}</p>
      </div>
    </template>
  </a-waterfall>
</template>

<script setup>
import { ref } from "vue";
import { Waterfall } from "antdv-next";

const imageList = ref([
  { id: 1, src: "https://picsum.photos/300/400", title: "图片1" },
  { id: 2, src: "https://picsum.photos/300/300", title: "图片2" },
  { id: 3, src: "https://picsum.photos/300/500", title: "图片3" },
]);
</script>

<style scoped>
.waterfall-item {
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.waterfall-item img {
  width: 100%;
  display: block;
}

.waterfall-item p {
  padding: 12px;
  margin: 0;
  text-align: center;
}
</style>
```

#### Tabs（标签页）：支持拖拽排序

```vue
<template>
  <a-tabs
    v-model:active-key="activeKey"
    :draggable="true"
    @dragend="handleDragEnd"
  >
    <a-tab-pane key="1" title="标签一"> 内容一 </a-tab-pane>
    <a-tab-pane key="2" title="标签二"> 内容二 </a-tab-pane>
    <a-tab-pane key="3" title="标签三"> 内容三 </a-tab-pane>
  </a-tabs>
</template>

<script setup>
import { ref } from "vue";
import { Tabs } from "antdv-next";

const activeKey = ref("1");

const handleDragEnd = (fromIndex: number, toIndex: number) => {
  console.log(`从 ${fromIndex} 拖拽到 ${toIndex}`);
  // 实现自定义排序逻辑
};
</script>
```

#### Tour（漫游导航）

```vue
<template>
  <div class="tour-demo">
    <a-button ref="btn1" type="primary" @click="handleNext">
      开始引导
    </a-button>
    <a-button ref="btn2">第二步按钮</a-button>
    <a-input ref="input" placeholder="第三步输入框" />

    <a-tour v-model:open="tourOpen" :steps="steps" @finish="handleTourFinish" />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Tour, Button, Input } from "antdv-next";

const btn1 = ref();
const btn2 = ref();
const input = ref();
const tourOpen = ref(false);

const steps = reactive([
  {
    title: "欢迎使用",
    description: "这是系统的引导教程",
    target: () => btn1.value,
  },
  {
    title: "快捷操作",
    description: "这里可以进行快捷操作",
    target: () => btn2.value,
  },
  {
    title: "输入信息",
    description: "在这里输入您的信息",
    target: () => input.value,
  },
]);

const handleNext = () => {
  tourOpen.value = true;
};

const handleTourFinish = () => {
  console.log("引导完成");
};
</script>
```

#### Flow（流光组件）

```vue
<template>
  <a-flow class="flow-card">
    <div class="content">
      <h3>流光卡片</h3>
      <p>带有动态边框流光效果</p>
    </div>
  </a-flow>
</template>

<script setup>
import { Flow } from "antdv-next";
</script>

<style scoped>
.flow-card {
  width: 300px;
  padding: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.flow-card .content {
  position: relative;
  z-index: 1;
  color: #fff;
}
</style>
```

## 进阶与生态扩展

### 主题定制与原子类

#### Design Token 系统

Antdv Next 使用 Design Token（设计令牌）来管理主题配置：

```vue
<script setup>
const themeConfig = {
  token: {
    // 主题色
    colorPrimary: "#1890ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1890ff",

    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    fontSize: 14,

    // 间距
    borderRadius: 4,
    borderRadiusLG: 8,

    // 阴影
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
};
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <App />
  </a-config-provider>
</template>
```

#### AI 生成主题与主题编辑器

可以通过官方提供的主题编辑器直接生成主题配置：

1. 访问 Ant Design 官方主题编辑器
2. 可视化调整颜色、字体、间距等
3. 导出配置并应用到 Antdv Next

```js
// 导出的主题配置
const customTheme = {
  token: {
    colorPrimary: "#自定义颜色",
    // ...其他配置
  },
};
```

#### 原子类支持

Antdv Next 将 CSS 变量映射到原子类，方便统一全局风格：

```html
<!-- 使用原子类 -->
<div class="text-primary bg-success rounded-lg p-4">使用原子类快速样式</div>

<!-- 对应的 CSS 变量 -->
<style>
  .text-primary {
    color: var(--ant-primary-color);
  }
  .bg-success {
    background-color: var(--ant-success-color);
  }
  .rounded-lg {
    border-radius: var(--ant-border-radius-lg);
  }
  .p-4 {
    padding: var(--ant-spacing-4);
  }
</style>
```

### AI 辅助开发

#### llms.txt 文件

Antdv Next 官方提供 `llms.txt` 文件，包含完整的 API 文档和最佳实践，可以直接导入给 AI 助手使用：

```markdown
<!-- llms.txt 内容概要 -->

# Antdv Next API Documentation

## Button

- type: 'primary' | 'default' | 'dashed' | 'text' | 'link'
- size: 'lg' | 'md' | 'sm'
- loading: boolean
  ...

## Input

- v-model:value: string
- placeholder: string
- ...
```

**使用方式：**

1. 下载官方提供的 `llms.txt`
2. 在 AI 助手中导入作为上下文
3. 询问组件用法，AI 可以生成零幻觉的代码

### 周边生态与脚手架

#### antdv-next-admin

开箱即用的 Vue 3 中后台脚手架，开源地址：[antdv-next-admin](https://github.com/antdv-next/antdv-next-admin)

**功能特性：**

- 🎯 **权限控制**：基于 RBAC 的权限模型
- 🛤️ **动态路由**：支持前端和后端两种路由模式
- 📦 **Mock 联调**：本地接口数据模拟
- 🎨 **主题切换**：浅色/深色主题一键切换
- 📱 **响应式布局**：适配多端设备

#### antdv-next/x

面向 AI 产品的专属组件库

**包含组件：**

- 💬 **Chat（聊天界面）**：支持多轮对话、流式输出
- 🔄 **Streaming（流式输出）**：SSE/WebSocket 流式渲染
- 🤖 **Agent 任务流**：Agent 执行状态可视化
- 📝 **Markdown 渲染**：支持 GFM 规范
- 🎙️ **语音录制**：音频采集与处理

```vue
<template>
  <a-chat
    :messages="messages"
    :streaming="streaming"
    @send="handleSend"
    @stop="handleStop"
  />
</template>

<script setup>
import { Chat } from "antdv-next/x";

const messages = ref([]);
const streaming = ref(false);

const handleSend = async (content: string) => {
  // 发送消息
};

const handleStop = () => {
  // 停止生成
};
</script>
```

## 总结

Antdv Next 作为专为 Vue 3 打造的 UI 组件库，带来了：

1. **纯粹的 Vue 开发体验**：插槽优先、Composition API 优先
2. **现代化的设计体系**：与 Ant Design v6 同步的设计语言
3. **优秀的性能**：zeroRuntime 模式、虚拟列表
4. **丰富的周边生态**：admin 脚手架、AI 专属组件库

对于 Vue 3 项目来说，Antdv Next 是一个值得优先考虑的 UI 组件库选择。
