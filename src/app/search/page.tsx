'use client'

import { useState } from 'react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (e) {
      console.error(e)
    }
    setSearching(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="h-full flex flex-col sm:flex-row">
      {/* 左侧搜索区 */}
      <div className="w-full sm:w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🔍 搜索记忆</h2>
          <p className="text-sm text-gray-500 mb-6">在所有记忆文件中搜索关键词</p>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入关键词..."
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                           focus:outline-none transition-all"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('')
                    setResults([])
                    setSearched(false)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={handleSearch}
              disabled={searching || !query.trim()}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl font-medium 
                         hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-colors"
            >
              {searching ? '搜索中...' : '开始搜索'}
            </button>
          </div>

          {/* 搜索提示 */}
          {!searched && (
            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <p className="text-sm text-blue-800 font-medium">搜索提示</p>
                  <p className="text-sm text-blue-600 mt-1">输入关键词后按回车或点击搜索按钮</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 右侧结果区 */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-4 sm:p-6">
          {searched && results.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">找到 {results.length} 个结果</p>
            </div>
          )}

          <div className="space-y-3">
            {results.map((result, i) => (
              <a
                key={i}
                href={`/edit?file=${encodeURIComponent(result.path)}`}
                className="block p-4 bg-white border border-gray-200 rounded-xl 
                           hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 mb-1 truncate">
                      {result.file}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {result.content}
                    </p>
                  </div>
                  <span className="text-gray-400 flex-shrink-0">›</span>
                </div>
              </a>
            ))}
          </div>

          {/* 空状态 */}
          {searched && results.length === 0 && !searching && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">未找到相关内容</p>
              <p className="text-gray-400 text-sm mt-2">换个关键词试试</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
