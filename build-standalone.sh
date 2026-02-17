#!/bin/bash

# OpenClaw Memory Manager 独立安装包制作脚本
# 生成一个自包含的安装脚本

set -e

PROJECT_DIR="/Users/ruska/.openclaw/workspace/openclaw-memory-manager"
OUTPUT_DIR="$PROJECT_DIR/dist"
VERSION="1.0.0"

echo "📦 制作安装包..."

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 创建独立安装脚本
cat > "$OUTPUT_DIR/install-standalone.sh" << 'INSTALLER_EOF'
#!/bin/bash
# OpenClaw Memory Manager vVERSION_PLACEHOLDER 独立安装包
# 生成方式: ./build-standalone.sh

set -e

INSTALL_DIR="${HOME}/.openclaw-memory-manager"
PORT="${OCMM_PORT:-3002}"

echo "🧠 OpenClaw Memory Manager 安装器"
echo "================================"
echo ""

# 检查依赖
check_dep() {
    if ! command -v "$1" &> /dev/null; then
        echo "❌ 需要安装 $1"
        exit 1
    fi
    echo "✅ $1"
}

echo "📋 检查依赖..."
check_dep node
check_dep npm
echo ""

# 清理旧版本
if [ -d "$INSTALL_DIR" ]; then
    echo "🔄 备份旧版本..."
    mv "$INSTALL_DIR" "$INSTALL_DIR.backup.$(date +%Y%m%d%H%M%S)"
fi

# 创建目录
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

echo "📥 解压项目文件..."
# 从脚本中提取 tar 包（base64 编码）
BASE64_DATA_START=$(grep -n "^__BASE64_DATA__$" "$0" | head -1 | cut -d: -f1)
tail -n +$((BASE64_DATA_START + 1)) "$0" | base64 -d | tar -xz
echo "✅ 解压完成"
echo ""

# 安装依赖
echo "📦 安装依赖..."
npm install --production 2>&1 | tail -3
echo "✅ 完成"
echo ""

# 构建
echo "🔨 构建..."
npm run build 2>&1 | tail -3
echo "✅ 完成"
echo ""

# 创建启动脚本
cat > "$INSTALL_DIR/start.sh" << 'STARTEOF'
#!/bin/bash
cd "$(dirname "$0")"
PORT="${OCMM_PORT:-3002}"
HOST="${OCMM_HOST:-0.0.0.0}"
echo "🧠 启动 Memory Manager..."
echo "📍 http://localhost:$PORT"
npm start -- -p "$PORT" -H "$HOST"
STARTEOF
chmod +x "$INSTALL_DIR/start.sh"

# 创建快捷命令
cat > "$INSTALL_DIR/ocmm" << 'OCMMEOF'
#!/bin/bash
cd "$HOME/.openclaw-memory-manager"
case "${1:-}" in
    start) ./start.sh ;;
    stop) pkill -f "next start" 2>/dev/null && echo "🛑 已停止" || echo "未运行" ;;
    status) pgrep -f "next start" >/dev/null && echo "✅ 运行中" || echo "⏹️ 未运行" ;;
    *) echo "用法: ocmm {start|stop|status}" ;;
esac
OCMMEOF
chmod +x "$INSTALL_DIR/ocmm"

# 添加到 PATH
for rc in "$HOME/.zshrc" "$HOME/.bashrc" "$HOME/.bash_profile"; do
    if [ -f "$rc" ] && ! grep -q "ocmm" "$rc" 2>/dev/null; then
        echo "export PATH=\"$INSTALL_DIR:\$PATH\"" >> "$rc"
        echo "✅ 已添加到 $(basename $rc)"
        break
    fi
done

echo ""
echo "🎉 安装完成！"
echo "运行: ocmm start"
echo "访问: http://localhost:$PORT"
echo ""
exit 0

__BASE64_DATA__
INSTALLER_EOF

# 打包项目（排除 node_modules 和 .next）
echo "📦 打包项目..."
cd "$PROJECT_DIR"
tar -czf /tmp/ocmm.tar.gz \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.git' \
    .

# 转换为 base64
echo "🔤 编码中..."
BASE64_DATA=$(base64 /tmp/ocmm.tar.gz)

# 将 base64 数据追加到安装脚本
echo "$BASE64_DATA" >> "$OUTPUT_DIR/install-standalone.sh"

# 设置可执行权限
chmod +x "$OUTPUT_DIR/install-standalone.sh"

# 计算文件大小
SIZE=$(du -h "$OUTPUT_DIR/install-standalone.sh" | cut -f1)

echo ""
echo "✅ 安装包已生成！"
echo ""
echo "📁 文件: $OUTPUT_DIR/install-standalone.sh"
echo "📊 大小: $SIZE"
echo ""
echo "使用方法:"
echo "  ./install-standalone.sh"
echo ""
echo "或者通过 curl:"
echo "  curl -sSL https://your-domain.com/install-standalone.sh | bash"
echo ""
