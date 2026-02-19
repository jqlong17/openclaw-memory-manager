#!/bin/bash

# OpenClaw Memory Manager - 本地启动脚本（带隧道）
# 此脚本读取 .env.local 中的配置，保护隐私

set -e

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 读取本地配置
if [ -f .env.local ]; then
    echo "✓ 加载本地配置..."
    export $(cat .env.local | grep -v '^#' | xargs)
else
    echo "✗ 未找到 .env.local 文件，使用默认配置"
    echo "  提示：创建 .env.local 文件可配置自定义域名"
fi

# 设置默认值
DOMAIN=${DOMAIN:-"localhost:3002"}
PORT=${PORT:-3002}

echo ""
echo "🧠 OpenClaw Memory Manager"
echo "=========================="
echo ""

# 检查服务是否已在运行
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "⚠️  端口 $PORT 已被占用，尝试复用现有服务..."
else
    echo "🚀 启动服务..."
    PORT=$PORT npm start > /dev/null 2>&1 &
    
    # 等待服务启动
    echo "⏳ 等待服务启动..."
    for i in {1..10}; do
        if curl -s http://localhost:$PORT > /dev/null 2>&1; then
            echo "✓ 服务已启动 (http://localhost:$PORT)"
            break
        fi
        sleep 1
    done
fi

echo ""
echo "📱 访问地址："
echo "  本地: http://localhost:$PORT"

# 如果有配置隧道，启动隧道
if [ -n "$TUNNEL_ID" ]; then
    echo ""
    echo "🌐 启动 Cloudflare Tunnel..."
    echo "  域名: https://$DOMAIN"
    echo ""
    
    # 检查配置文件是否存在
    CONFIG_FILE="$HOME/.cloudflared/config-memory-manager.yml"
    if [ -f "$CONFIG_FILE" ]; then
        # 使用 nohup 后台运行隧道，避免随会话结束而终止
        nohup cloudflared tunnel --config "$CONFIG_FILE" run > /tmp/ocmm-tunnel.log 2>&1 &
        TUNNEL_PID=$!
        echo "✓ 隧道已后台启动 (PID: $TUNNEL_PID)"
        echo "  日志: /tmp/ocmm-tunnel.log"
        
        # 等待隧道连接
        echo "⏳ 等待隧道连接..."
        for i in {1..10}; do
            if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null | grep -q "200"; then
                echo "✓ 隧道连接成功!"
                echo ""
                echo "🎉 服务已启动:"
                echo "  本地: http://localhost:$PORT"
                echo "  公网: https://$DOMAIN"
                echo ""
                echo "💡 提示: 使用 'ocmm stop' 或 'pkill -f cloudflared.*memory-manager' 停止服务"
                break
            fi
            sleep 1
        done
    else
        echo "⚠️  未找到隧道配置文件: $CONFIG_FILE"
        echo "   使用默认方式启动..."
        cloudflared tunnel run "$TUNNEL_ID"
    fi
else
    echo ""
    echo "💡 提示：配置 TUNNEL_ID 可启用公网访问"
    echo ""
    # 保持脚本运行
    wait
fi
