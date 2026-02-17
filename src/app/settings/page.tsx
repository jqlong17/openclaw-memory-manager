export default function SettingsPage() {
  return (
    <div>
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">设置</h2>
        <p className="text-sm text-gray-500">系统信息和配置</p>
      </div>

      {/* 设置卡片 */}
      <div className="space-y-4">
        {/* 工作区信息 */}
        <div className="card p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📁</span>
            <h3 className="font-semibold text-gray-800">工作区</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-sm text-gray-500">路径</span>
              <span className="text-sm font-mono text-gray-700 break-all">
                /Users/ruska/.openclaw/workspace
              </span>
            </div>
          </div>
        </div>

        {/* 版本信息 */}
        <div className="card p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">ℹ️</span>
            <h3 className="font-semibold text-gray-800">版本</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">版本号</span>
              <span className="text-sm font-medium text-gray-700">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">名称</span>
              <span className="text-sm font-medium text-gray-700">OpenClaw Memory Manager</span>
            </div>
          </div>
        </div>

        {/* 关于 */}
        <div className="card p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h3 className="font-semibold text-gray-800">关于</h3>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            移动端友好的 OpenClaw 记忆管理系统。帮助你在任何设备上查看和编辑 OpenClaw 的记忆文件。
          </p>
        </div>
      </div>

      {/* 底部版权 */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          OpenClaw Memory Manager © 2026
        </p>
      </div>
    </div>
  )
}
