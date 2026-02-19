module.exports = {
  apps: [
    {
      name: 'ocmm-web',
      script: 'npm',
      args: 'start',
      cwd: '/Users/ruska/.openclaw/workspace/openclaw-memory-manager',
      env: {
        PORT: 3002,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      log_file: '/tmp/ocmm-web.log',
      out_file: '/tmp/ocmm-web-out.log',
      error_file: '/tmp/ocmm-web-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'ocmm-tunnel',
      script: 'cloudflared',
      args: 'tunnel --config /Users/ruska/.cloudflared/config-memory-manager.yml run',
      autorestart: true,
      watch: false,
      log_file: '/tmp/ocmm-tunnel.log',
      out_file: '/tmp/ocmm-tunnel-out.log',
      error_file: '/tmp/ocmm-tunnel-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
