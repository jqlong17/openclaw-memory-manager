#!/bin/bash

# OpenClaw Memory Manager - PM2 管理脚本

COMMAND=${1:-status}

case "$COMMAND" in
  start)
    echo "🚀 启动 OpenClaw Memory Manager..."
    pm2 start ecosystem.config.js
    echo ""
    echo "✓ 服务已启动"
    echo "  本地: http://localhost:3002"
    echo "  公网: https://mm.ruska.cn"
    ;;
  stop)
    echo "🛑 停止 OpenClaw Memory Manager..."
    pm2 stop ecosystem.config.js
    echo "✓ 服务已停止"
    ;;
  restart)
    echo "🔄 重启 OpenClaw Memory Manager..."
    pm2 restart ecosystem.config.js
    echo "✓ 服务已重启"
    ;;
  status)
    pm2 status
    ;;
  logs)
    pm2 logs --lines 50
    ;;
  delete)
    echo "🗑️  删除 PM2 进程..."
    pm2 delete ecosystem.config.js
    echo "✓ 进程已删除"
    ;;
  *)
    echo "用法: ./pm2-manager.sh [start|stop|restart|status|logs|delete]"
    echo ""
    echo "命令:"
    echo "  start    - 启动服务"
    echo "  stop     - 停止服务"
    echo "  restart  - 重启服务"
    echo "  status   - 查看状态"
    echo "  logs     - 查看日志"
    echo "  delete   - 删除进程"
    ;;
esac
