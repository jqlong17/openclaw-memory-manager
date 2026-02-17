# OpenClaw Memory Manager - 项目方案

## 1. 项目概述

**项目名称**: OpenClaw Memory Manager
**定位**: 移动端友好的 OpenClaw 记忆管理系统
**目标用户**: OpenClaw 用户、AI 开发者

---

## 2. 核心功能

| 功能 | 说明 |
|------|------|
| 📖 读取记忆 | 自动扫描 OpenClaw 工作区的记忆文件 |
| 📝 编辑记忆 | Web 界面直接编辑 MEMORY.md、每日记忆等 |
| 🔍 搜索记忆 | 全文搜索所有记忆文件 |
| 📱 移动端适配 | 手机浏览器友好 |
| ⬇️ 一键安装 | 集成到 SkillHub (hub install) |

---

## 3. 支持的文件

| 文件 | 路径 | 说明 |
|------|------|------|
| MEMORY.md | workspace/ | 长期记忆 |
| memory/YYYY-MM-DD.md | workspace/memory/ | 每日记忆 |
| SOUL.md | workspace/ | AI 个性/灵魂 |
| USER.md | workspace/ | 用户信息 |
| IDENTITY.md | workspace/ | AI 身份 |
| HEARTBEAT.md | workspace/ | 心跳任务 |

---

## 4. 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户层 (Web UI)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │  记忆列表   │  │  记忆编辑   │  │   设置     │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
└─────────┼────────────────┼────────────────┼───────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API 层 (Next.js)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ GET /api/   │  │ PUT /api/   │  │ GET /api/   │           │
│  │ memories    │  │ memories    │  │ search      │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
└─────────┼────────────────┼────────────────┼───────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      文件系统层                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           OpenClaw Workspace                            │   │
│  │  MEMORY.md  │  memory/  │  SOUL.md  │  USER.md       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. 技术栈

| 组件 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js | 14 (App Router) |
| UI | React + Tailwind CSS | - |
| 移动端 | Tailwind CSS (响应式) | - |
| 文件操作 | Node.js fs | 内置 |
| 部署 | Vercel / 本地运行 | - |

---

## 6. 页面结构

```
/                    # 首页 - 记忆列表
├── /memories        # 记忆列表
│   ├── memory.md    # 长期记忆
│   ├── soul.md      # AI 灵魂
│   ├── user.md      # 用户信息
│   └── memory/      # 每日记忆
├── /edit/[file]     # 编辑页面
├── /search          # 搜索页面
└── /settings        # 设置
```

---

## 7. 核心 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/memories | 获取所有记忆文件 |
| GET | /api/memories/[file] | 获取单个文件 |
| PUT | /api/memories/[file] | 保存文件 |
| GET | /api/search?q=xxx | 搜索记忆 |

---

## 8. CLI 打包

```bash
# 打包成可执行文件
npm run build

# 生成 CLI 安装包
./dist/openclaw-memory-manager

# 用户安装
hub install openclaw-memory-manager

# 用户启动
openclaw-memory-manager
# 或
npx openclaw-memory-manager
```

---

## 9. 部署方式

### 方式 A: 本地运行
```bash
cd openclaw-memory-manager
npm run dev
# 访问 http://localhost:3000
```

### 方式 B: 一键安装
```bash
hub install openclaw-memory-manager
openclaw-memory-manager
```

---

## 10. 下一步

- [ ] 确认架构是否合理
- [ ] 开始代码开发
- [ ] 集成到 SkillHub
