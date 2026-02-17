export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="w-full max-w-2xl sm:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 标题 */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-bold text-gray-800">⚙️ 设置</h2>
          <p className="text-sm text-gray-500 mt-1">系统信息和配置</p>
        </div>

        {/* Discord CTA - 桌面端保持醒目、全宽 */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-indigo-600 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden text-white">
            <div className="p-5 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    💬
                  </div>
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl">加入 Discord 社区</h3>
                    <p className="text-sm text-indigo-200">与其他 OpenClaw 用户一起交流</p>
                  </div>
                </div>
                <p className="text-sm text-indigo-100 leading-relaxed sm:mt-2">
                  获取最新动态、分享使用经验、提出建议或参与讨论。欢迎加入我们的 Discord 服务器！
                </p>
              </div>
              <a
                href="https://discord.gg/HpY684EF"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex-shrink-0 w-full sm:w-auto"
              >
                <span>立即加入</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* 设置卡片 - 桌面端两列网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* 工作区 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="p-4 sm:p-5 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  📁
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">工作区</h3>
                  <p className="text-sm text-gray-500 truncate">OpenClaw 工作目录</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <code className="text-sm text-gray-700 break-all block">
                  {process.env.OCMM_WORKSPACE_PATH || '~/.openclaw/workspace'}
                </code>
              </div>
            </div>
          </div>

          {/* 版本信息 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="p-4 sm:p-5 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  ℹ️
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">版本信息</h3>
                  <p className="text-sm text-gray-500">当前版本和名称</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">版本号</span>
                  <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-full shrink-0">
                    v1.0.0
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 py-2">
                  <span className="text-sm text-gray-600 shrink-0">名称</span>
                  <span className="text-sm font-medium text-gray-800 text-right truncate">
                    OpenClaw Memory Manager
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 关于 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="p-4 sm:p-5 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  🧠
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">关于</h3>
                  <p className="text-sm text-gray-500">功能介绍</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                移动端友好的 OpenClaw 记忆管理系统。帮助你在任何设备上查看和编辑 OpenClaw 的记忆文件，包括 MEMORY.md、每日记忆、对话日志等。
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl sm:text-2xl mb-1">📋</div>
                  <div className="text-xs text-gray-600">记忆管理</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl sm:text-2xl mb-1">💬</div>
                  <div className="text-xs text-gray-600">对话日志</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl sm:text-2xl mb-1">🔍</div>
                  <div className="text-xs text-gray-600">全文搜索</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-xl sm:text-2xl mb-1">📱</div>
                  <div className="text-xs text-gray-600">移动端适配</div>
                </div>
              </div>
            </div>
          </div>

          {/* 快捷命令 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="p-4 sm:p-5 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  ⌨️
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">快捷命令</h3>
                  <p className="text-sm text-gray-500">终端命令参考</p>
                </div>
              </div>
              <div className="space-y-0">
                <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100">
                  <code className="text-sm bg-gray-100 px-2.5 py-1 rounded font-medium">ocmm start</code>
                  <span className="text-sm text-gray-600">启动服务</span>
                </div>
                <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100">
                  <code className="text-sm bg-gray-100 px-2.5 py-1 rounded font-medium">ocmm stop</code>
                  <span className="text-sm text-gray-600">停止服务</span>
                </div>
                <div className="flex items-center justify-between gap-3 py-2.5">
                  <code className="text-sm bg-gray-100 px-2.5 py-1 rounded font-medium">ocmm update</code>
                  <span className="text-sm text-gray-600">更新版本</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            OpenClaw Memory Manager © 2026
          </p>
        </div>
      </div>
    </div>
  )
}
