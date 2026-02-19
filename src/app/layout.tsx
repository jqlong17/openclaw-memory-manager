import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'OpenClaw Memory Manager',
  description: '移动端友好的 OpenClaw 记忆管理系统',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {/* 顶部导航 */}
        <header className="bg-white shadow-sm sticky top-0 z-50 h-14 sm:h-16 flex items-center">
          <div className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-2xl flex-shrink-0" aria-hidden>🧠</span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                Memory Manager
              </h1>
            </div>
            <nav className="hidden sm:flex items-center gap-6 flex-shrink-0 sm:ml-4">
              <a href="/" className="text-sm text-gray-600 hover:text-blue-500 whitespace-nowrap">首页</a>
              <a href="/chat-logs" className="text-sm text-gray-600 hover:text-blue-500 whitespace-nowrap">对话日志</a>
              <a href="/search" className="text-sm text-gray-600 hover:text-blue-500 whitespace-nowrap">搜索</a>
              <a href="/settings" className="text-sm text-gray-600 hover:text-blue-500 whitespace-nowrap">设置</a>
            </nav>
          </div>
        </header>

        {/* 主内容 */}
        <main className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
          {children}
        </main>

        {/* 移动端底部导航 */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
          <div className="flex justify-around items-center h-16">
            <a href="/" className="flex flex-col items-center justify-center w-full h-full text-gray-600">
              <span className="text-xl">📋</span>
              <span className="text-xs">记忆</span>
            </a>
            <a href="/chat-logs" className="flex flex-col items-center justify-center w-full h-full text-gray-600">
              <span className="text-xl">💬</span>
              <span className="text-xs">对话</span>
            </a>
            <a href="/search" className="flex flex-col items-center justify-center w-full h-full text-gray-600">
              <span className="text-xl">🔍</span>
              <span className="text-xs">搜索</span>
            </a>
            <a href="/settings" className="flex flex-col items-center justify-center w-full h-full text-gray-600">
              <span className="text-xl">⚙️</span>
              <span className="text-xs">设置</span>
            </a>
          </div>
        </nav>
      </body>
    </html>
  )
}
