# 🧠 OpenClaw Memory Manager

[![GitHub stars](https://img.shields.io/github/stars/jqlong17/openclaw-memory-manager?style=social)](https://github.com/jqlong17/openclaw-memory-manager)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> 移动端友好的 OpenClaw 记忆文件管理工具

在手机上轻松管理 OpenClaw 的记忆文件，随时随地查看和编辑。

---

## 📋 目录

- [功能特性](#-功能特性)
- [快速开始](#-快速开始)
- [界面导航](#-界面导航)
- [使用指南](#-使用指南)
- [公网访问](#-公网访问)
- [配置说明](#-配置说明)
- [常见问题](#-常见问题)
- [加入社区](#-加入社区)

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

## 🔒 本地配置（隐私保护）

为了保护你的域名等敏感信息，建议创建本地配置文件：

### 1. 创建 `.env.local` 文件

```bash
# 在项目根目录创建 .env.local 文件
touch .env.local
```

添加以下内容：

```bash
# 你的域名
DOMAIN=your-domain.com

# Cloudflare Tunnel ID（可选）
TUNNEL_ID=your-tunnel-id

# 服务端口（可选，默认 3002）
PORT=3002
```

⚠️ **注意**：`.env.local` 文件不会被上传到 GitHub（已在 .gitignore 中配置）。

### 2. 使用本地启动脚本

```bash
# 启动（自动读取 .env.local 配置）
./start-local.sh

# 停止
./stop-local.sh
```

### 3. 使用 PM2 管理（推荐用于长期运行）

PM2 可以确保服务稳定运行，自动重启崩溃的进程。

```bash
# 安装 PM2（如果尚未安装）
npm install -g pm2

# 启动服务
./pm2-manager.sh start

# 查看状态
./pm2-manager.sh status

# 查看日志
./pm2-manager.sh logs

# 重启服务
./pm2-manager.sh restart

# 停止服务
./pm2-manager.sh stop
```

**PM2 优势：**
- ✅ 进程崩溃自动重启
- ✅ 开机自启动
- ✅ 日志管理
- ✅ 内存监控

**设置开机自启：**
```bash
pm2 startup
pm2 save
```

---

## 🚀 快速开始

### 方式一：一键安装（推荐）

```bash
curl -sSL https://raw.githubusercontent.com/jqlong17/openclaw-memory-manager/main/install.sh | bash
```

安装完成后，使用以下命令：

```bash
ocmm start    # 启动服务（自动打开浏览器）
ocmm stop     # 停止服务
ocmm status   # 查看状态
ocmm update   # 更新到最新版
```

### 方式二：手动安装

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

### 方式三：本地开发

```bash
npm install
npm run dev    # 开发模式，支持热重载
```

---

## 🧭 界面导航

启动后，界面底部有 **4 个 Tab**：

| Tab | 图标 | 功能说明 |
|-----|------|---------|
| **记忆** | 📚 | 查看和编辑所有记忆文件 |
| **对话** | 💬 | 浏览历史对话记录 |
| **搜索** | 🔍 | 全文搜索记忆内容 |
| **设置** | ⚙️ | 配置选项和关于信息 |

### 支持的文件类型

| 文件 | 图标 | 说明 |
|------|------|------|
| `MEMORY.md` | 📚 | 长期记忆（重要经验、知识） |
| `SOUL.md` | 🧠 | AI 灵魂/个性设定 |
| `USER.md` | 👤 | 用户信息 |
| `IDENTITY.md` | 🪞 | AI 身份设定 |
| `HEARTBEAT.md` | 💓 | 心跳任务配置 |
| `AGENTS.md` | 🤖 | Agent 配置 |
| `TOOLS.md` | 🛠️ | 工具配置 |
| `memory/YYYY-MM-DD.md` | 📅 | 每日记忆日志 |

---

## 📖 使用指南

### 第一步：启动服务

```bash
ocmm start
```

服务默认运行在 `http://localhost:3002`

### 第二步：访问界面

- **电脑浏览器**：打开 http://localhost:3002
- **手机同 WiFi**：用浏览器访问 `http://<电脑IP>:3002`

### 第三步：浏览记忆文件

1. 点击底部 **"记忆"** Tab
2. 查看文件列表
3. 点击任意文件进入编辑

### 第四步：编辑记忆

1. 在编辑页面修改内容
2. 内容会自动保存（无需手动点击）
3. 返回列表查看其他文件

### 第五步：搜索内容

1. 点击底部 **"搜索"** Tab
2. 输入关键词
3. 查看所有匹配的记忆内容

### 第六步：查看对话历史

1. 点击底部 **"对话"** Tab
2. 浏览历史对话记录
3. 点击对话查看详情

---

## 🌐 公网访问

如果你想在手机流量或其他 WiFi 下也能访问，可以使用 Cloudflare Tunnel：

### 1. 安装 cloudflared

```bash
brew install cloudflared
```

### 2. 登录 Cloudflare

```bash
cloudflared tunnel login
```

### 3. 创建隧道

```bash
cloudflared tunnel create openclaw-memory-manager
```

### 4. 配置 DNS

将 `your-domain.com` 替换为你自己的域名：

```bash
cloudflared tunnel route dns openclaw-memory-manager your-domain.com
```

### 5. 创建配置文件

创建文件 `~/.cloudflared/config-memory-manager.yml`：

```yaml
tunnel: <你的隧道ID>
credentials-file: ~/.cloudflared/<隧道ID>.json
ingress:
  - hostname: your-domain.com
    service: http://localhost:3002
  - service: http_status:404
```

### 6. 启动隧道

```bash
cloudflared tunnel --config ~/.cloudflared/config-memory-manager.yml run
```

### 7. 手机访问

现在手机可以用流量访问：

```
https://your-domain.com
```

（将 `your-domain.com` 替换为你自己的域名）

⚠️ **安全提示**：公网访问时建议添加密码保护，避免他人访问你的记忆文件。

---

## ⚙️ 配置说明

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `OCMM_PORT` | 服务端口 | `3002` |
| `OCMM_HOST` | 绑定地址 | `0.0.0.0` |
| `OCMM_WORKSPACE_PATH` | OpenClaw 工作区路径 | `~/.openclaw/workspace` |
| `OCMM_SESSIONS_PATH` | 对话日志路径 | `~/.openclaw/agents/main/sessions` |

### 使用示例

```bash
# 使用自定义端口
OCMM_PORT=8080 ocmm start

# 仅本地访问（更安全）
OCMM_HOST=127.0.0.1 ocmm start

# 自定义工作区路径
OCMM_WORKSPACE_PATH=/custom/path ocmm start
```

---

## ❓ 常见问题

### Q: 安装后命令找不到？

A: 确保 `~/.local/bin` 在你的 PATH 中：

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### Q: 端口被占用？

A: 使用其他端口启动：

```bash
OCMM_PORT=3003 ocmm start
```

### Q: 手机无法访问？

A: 检查电脑和手机是否在同一 WiFi，或配置 Cloudflare Tunnel 实现公网访问。

### Q: 修改后没有保存？

A: 编辑内容后会自动保存，返回列表前请等待 1-2 秒。

### Q: 如何备份记忆文件？

A: 记忆文件就是普通的 Markdown 文件，可以直接复制 `~/.openclaw/workspace/` 目录进行备份。

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
