#!/bin/bash

# OpenClaw Memory Manager - 停止脚本

echo "🛑 停止 OpenClaw Memory Manager..."

# 停止本地服务
echo "  停止本地服务..."
pkill -f "next start" 2> /dev/null || true

# 停止 Cloudflare Tunnel
echo "  停止 Cloudflare Tunnel..."
pkill -f "cloudflared.*memory-manager" 2> /dev/null || true

echo "✓ 服务已停止"
