#!/bin/bash

# OpenClaw Memory Manager 一键安装脚本
# 使用方法: curl -sSL https://your-domain.com/install.sh | bash

set -e

REPO_URL="https://github.com/jqlong17/openclaw-memory-manager"
INSTALL_DIR="$HOME/.openclaw-memory-manager"
PORT="${OCMM_PORT:-3002}"

echo "🧠 OpenClaw Memory Manager 安装器"
echo "================================"
echo ""

# 检查依赖
check_dependency() {
    if ! command -v "$1" &> /dev/null; then
        echo "❌ 未找到 $1，请先安装"
        return 1
    fi
    echo "✅ $1 已安装"
}

echo "📋 检查依赖..."
check_dependency node || exit 1
check_dependency npm || exit 1
check_dependency git || exit 1
echo ""

# 如果已存在，先备份
if [ -d "$INSTALL_DIR" ]; then
    echo "🔄 发现已有安装，备份中..."
    mv "$INSTALL_DIR" "$INSTALL_DIR.backup.$(date +%Y%m%d%H%M%S)"
fi

# 克隆仓库
echo "📥 下载项目..."
git clone --depth 1 "$REPO_URL" "$INSTALL_DIR" 2>/dev/null || {
    echo "⚠️  GitHub 访问失败，尝试使用镜像..."
    # 可以添加镜像地址
    exit 1
}
echo "✅ 下载完成"
echo ""

# 安装依赖
echo "📦 安装依赖..."
cd "$INSTALL_DIR"
npm install --production 2>&1 | tail -5
echo "✅ 依赖安装完成"
echo ""

# 构建项目
echo "🔨 构建项目..."
npm run build 2>&1 | tail -3
echo "✅ 构建完成"
echo ""

# 创建启动脚本
cat > "$INSTALL_DIR/start.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
PORT="${OCMM_PORT:-3002}"
HOST="${OCMM_HOST:-0.0.0.0}"

echo "🧠 启动 OpenClaw Memory Manager..."
echo "📍 访问地址:"
echo "   本地: http://localhost:$PORT"
echo "   局域网: http://$(hostname -I | awk '{print $1}' 2>/dev/null || echo '你的IP'):$PORT"
echo ""

# 启动服务（后台）
npm start -- -p "$PORT" -H "$HOST" &
SERVER_PID=$!

# 等待服务启动
sleep 3

# 自动打开浏览器
LOCAL_URL="http://localhost:$PORT"
if command -v open >/dev/null 2>&1; then
    open "$LOCAL_URL"  # macOS
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$LOCAL_URL"  # Linux
elif command -v start >/dev/null 2>&1; then
    start "$LOCAL_URL"  # Windows
fi

# 等待服务结束
wait $SERVER_PID
EOF

chmod +x "$INSTALL_DIR/start.sh"

# 创建快捷命令
cat > "$INSTALL_DIR/ocmm" << 'EOF'
#!/bin/bash
INSTALL_DIR="$HOME/.openclaw-memory-manager"
PORT="${OCMM_PORT:-3002}"

open_browser() {
    LOCAL_URL="http://localhost:$PORT"
    if command -v open >/dev/null 2>&1; then
        open "$LOCAL_URL"
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$LOCAL_URL"
    elif command -v start >/dev/null 2>&1; then
        start "$LOCAL_URL"
    fi
}

case "${1:-}" in
    start)
        "$INSTALL_DIR/start.sh"
        ;;
    stop)
        pkill -f "next start" 2>/dev/null && echo "🛑 已停止" || echo "未运行"
        ;;
    status)
        if pgrep -f "next start" > /dev/null; then
            echo "✅ 运行中"
            echo "📍 http://localhost:${OCMM_PORT:-3002}"
        else
            echo "⏹️  未运行"
        fi
        ;;
    open)
        open_browser
        ;;
    update)
        cd "$INSTALL_DIR"
        git pull
        npm install
        npm run build
        echo "✅ 更新完成"
        ;;
    *)
        echo "OpenClaw Memory Manager 管理脚本"
        echo ""
        echo "用法: ocmm [命令]"
        echo ""
        echo "命令:"
        echo "  start    启动服务（自动打开浏览器）"
        echo "  stop     停止服务"
        echo "  status   查看状态"
        echo "  open     打开浏览器"
        echo "  update   更新到最新版"
        echo ""
        echo "环境变量:"
        echo "  OCMM_PORT  端口号 (默认: 3002)"
        echo "  OCMM_HOST  绑定地址 (默认: 0.0.0.0)"
        ;;
esac
EOF

chmod +x "$INSTALL_DIR/ocmm"

# 添加到 PATH
SHELL_RC=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_RC="$HOME/.bashrc"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_RC="$HOME/.bash_profile"
fi

if [ -n "$SHELL_RC" ]; then
    if ! grep -q "ocmm" "$SHELL_RC" 2>/dev/null; then
        echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$SHELL_RC"
        echo "✅ 已添加到 PATH ($SHELL_RC)"
    fi
fi

echo ""
echo "🎉 安装完成！"
echo ""
echo "使用方法:"
echo "  1. 重新打开终端，或运行: source $SHELL_RC"
echo "  2. 启动: ocmm start"
echo "  3. 停止: ocmm stop"
echo "  4. 状态: ocmm status"
echo ""
echo "访问地址:"
echo "  本地: http://localhost:$PORT"
echo "  局域网: http://$(node -e "const os=require('os');const nets=os.networkInterfaces();for(const n in nets)for(const net of nets[n])if(net.family==='IPv4'&&!net.internal){console.log(net.address);process.exit(0)}"):$PORT"
echo ""
echo "工作区路径: $INSTALL_DIR"
echo ""

# 询问是否立即启动
read -p "是否立即启动? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    "$INSTALL_DIR/start.sh"
fi
