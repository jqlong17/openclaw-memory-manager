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
    <div>
      {/* 标题 */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">搜索记忆</h2>
        <p className="text-sm text-gray-500">在所有记忆文件中搜索关键词</p>
      </div>

      {/* 搜索框 */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入关键词..."
              className="input-field pr-10"
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
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
          >
            {searching ? '...' : '🔍'}
          </button>
        </div>
      </div>

      {/* 搜索结果 */}
      <div className="space-y-3">
        {results.map((result, i) => (
          <a
            key={i}
            href={`/edit?file=${encodeURIComponent(result.path)}`}
            className="card block p-4 sm:p-5 file-item"
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">📄</span>
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
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">未找到相关内容</p>
          <p className="text-gray-400 text-sm mt-2">换个关键词试试</p>
        </div>
      )}

      {/* 初始状态 */}
      {!searched && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500">输入关键词开始搜索</p>
        </div>
      )}
    </div>
  )
}
