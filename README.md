# 🧠 OpenClaw Memory Manager

[![GitHub stars](https://img.shields.io/github/stars/jqlong17/openclaw-memory-manager?style=social)](https://github.com/jqlong17/openclaw-memory-manager)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> 移动端友好的 OpenClaw 记忆文件管理工具

在手机上轻松管理 OpenClaw 的记忆文件，随时随地查看和编辑。

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 📱 **移动端自适应** | 完美适配手机浏览器，触屏友好 |
| 💻 **桌面端分栏** | 左右分栏布局，高效编辑 |
| 📝 **记忆文件管理** | 编辑 MEMORY.md、SOUL.md、每日记忆等 |
| 💬 **对话日志查看** | 浏览历史对话记录 |
| 🔍 **全文搜索** | 快速搜索所有记忆文件 |
| 💾 **自动保存** | 实时保存，无需手动操作 |
| 🎨 **精美图标** | 每个文件类型都有独特的 emoji 图标 |

---

## 🚀 快速开始

### 一键安装（推荐）

```bash
curl -sSL https://raw.githubusercontent.com/jqlong17/openclaw-memory-manager/main/install.sh | bash
```

安装完成后：

```bash
ocmm start    # 启动服务（自动打开浏览器）
ocmm stop     # 停止服务
ocmm status   # 查看状态
ocmm update   # 更新到最新版
```

### 手动安装

```bash
# 1. 克隆仓库
git clone https://github.com/jqlong17/openclaw-memory-manager.git
cd openclaw-memory-manager

# 2. 安装依赖
npm install

# 3. 构建
npm run build

# 4. 启动
npm start
```

---

## 📖 使用指南

启动后访问：

- **本地访问**：`http://localhost:3002`
- **局域网访问**：`http://你的IP:3002`（手机同WiFi下可用）

### 支持的文件

| 文件 | 图标 | 说明 |
|------|------|------|
| `MEMORY.md` | 📚 | 长期记忆 |
| `SOUL.md` | 🧠 | AI 灵魂/个性 |
| `USER.md` | 👤 | 用户信息 |
| `IDENTITY.md` | 🪞 | AI 身份 |
| `HEARTBEAT.md` | 💓 | 心跳任务 |
| `AGENTS.md` | 🤖 | Agent 配置 |
| `TOOLS.md` | 🛠️ | 工具配置 |
| `memory/YYYY-MM-DD.md` | 📅 | 每日记忆 |

---

## 🖼️ 界面预览

### 移动端
- 底部导航栏，快速切换功能
- 卡片式布局，清晰易用
- 触摸友好的按钮和输入框

### 桌面端
- 左侧文件列表，右侧编辑区
- 响应式布局，自适应窗口大小
- 快捷键支持

---

## ⚙️ 配置

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `OCMM_PORT` | 服务端口 | `3002` |
| `OCMM_HOST` | 绑定地址 | `0.0.0.0` |

### 示例

```bash
# 使用自定义端口
OCMM_PORT=8080 ocmm start

# 仅本地访问
OCMM_HOST=127.0.0.1 ocmm start
```

---

## 💬 加入社区

欢迎加入我们的 Discord 社区，获取帮助、分享经验、提出建议：

👉 [**加入 Discord**](https://discord.gg/HpY684EF)

---

## 🛠️ 系统要求

- **Node.js** ≥ 18
- **npm** ≥ 9
- **操作系统**: macOS / Linux / Windows

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

## 📄 License

[MIT](LICENSE) © 2026 OpenClaw Memory Manager

---

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw) - 多平台 AI Agent 框架
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
