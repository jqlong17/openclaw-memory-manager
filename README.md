# OpenClaw Memory Manager

移动端友好的 OpenClaw 记忆文件管理工具

## 快速安装

### 方式一：curl 一键安装（推荐）

```bash
curl -sSL https://raw.githubusercontent.com/jqlong17/openclaw-memory-manager/main/install.sh | bash
```

安装完成后：
```bash
ocmm start    # 启动服务
ocmm stop     # 停止服务
ocmm status   # 查看状态
ocmm update   # 更新版本
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

## 使用

启动后访问：
- 本地：`http://localhost:3002`
- 局域网：`http://你的IP:3002`

## 功能

- 📱 移动端自适应
- 💻 桌面端左右分栏
- 📝 实时编辑记忆文件
- 🔍 全文搜索
- 💾 自动保存

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `OCMM_PORT` | 服务端口 | 3002 |
| `OCMM_HOST` | 绑定地址 | 0.0.0.0 |

## 系统要求

- Node.js ≥ 18
- npm ≥ 9
- macOS / Linux / Windows

## License

MIT
