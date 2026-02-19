'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface Session {
  id: string
  timestamp: string
  cwd: string
  messageCount: number
  preview: string
}

interface Message {
  type: string
  id: string
  timestamp: string
  message?: {
    role: string
    content: { type: string; text?: string }[]
  }
}

type SearchResult =
  | { type: 'memory'; file: string; path: string; content: string }
  | { type: 'chat'; sessionId: string; file: string; path: string; content: string }

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showDetail, setShowDetail] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | 'sessions'>('sessions')

  // 加载会话列表
  useEffect(() => {
    fetch('/api/chat-logs')
      .then(res => res.json())
      .then(data => {
        setSessions(data.sessions || [])
        setLoading(false)
      })
  }, [])

  // 从 URL 恢复选中的会话
  const sessionFromUrl = searchParams.get('session')
  useEffect(() => {
    if (sessionFromUrl && sessions.length > 0 && !selectedSession) {
      const exists = sessions.some(s => s.id === sessionFromUrl)
      if (exists) {
        setSelectedSession(sessionFromUrl)
        setShowDetail(true)
        setActiveTab('sessions')
      }
    }
  }, [sessionFromUrl, sessions, selectedSession])

  // 加载选中会话的消息
  useEffect(() => {
    if (selectedSession) {
      fetch(`/api/chat-logs?session=${selectedSession}`)
        .then(res => res.json())
        .then(data => {
          setMessages(data.messages || [])
        })
    }
  }, [selectedSession])

  // 搜索功能
  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    setSearched(true)
    setActiveTab('search')
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setSearchResults(data.results || [])
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

  const handleSelectSession = (id: string) => {
    setSelectedSession(id)
    setShowDetail(true)
    setActiveTab('sessions')
  }

  const handleBack = () => {
    setShowDetail(false)
    setSelectedSession(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col sm:flex-row overflow-hidden" style={{ height: 'calc(100vh - 7rem)' }}>
      {/* 左侧搜索和列表 - 移动端根据 showDetail 隐藏 */}
      <div className={`${showDetail ? 'hidden' : 'block'} sm:block w-full sm:w-96 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-hidden flex flex-col`} style={{ height: '100%' }}>
        {/* 搜索框 */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-3">🔍 搜索对话</h2>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索关键词..."
              className="w-full px-4 py-2.5 bg-white rounded-xl border border-gray-200 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                         focus:outline-none transition-all text-sm"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('')
                  setSearchResults([])
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
            className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium 
                       hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-colors"
          >
            {searching ? '搜索中...' : '搜索'}
          </button>
        </div>

        {/* Tab 切换 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'sessions' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            对话列表 ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'search' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            搜索结果 {searched && `(${searchResults.length})`}
          </button>
        </div>

        {/* 列表内容 */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'sessions' ? (
            // 对话列表
            <div className="p-3 space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedSession === session.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${
                      selectedSession === session.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatDate(session.timestamp)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedSession === session.id 
                        ? 'bg-blue-400 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {session.messageCount} 条
                    </span>
                  </div>
                  <p className={`text-sm line-clamp-2 ${
                    selectedSession === session.id ? 'text-white' : 'text-gray-700'
                  }`}>
                    {session.preview || '无预览内容'}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            // 搜索结果
            <div className="p-3 space-y-2">
              {!searched ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-sm">输入关键词搜索</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">😕</div>
                  <p className="text-sm">未找到相关内容</p>
                </div>
              ) : (
                searchResults.map((result, i) => {
                  const isChat = result.type === 'chat'
                  return (
                    <button
                      key={i}
                      onClick={() => isChat && handleSelectSession(result.sessionId)}
                      className="w-full text-left p-3 bg-white rounded-xl border border-gray-200 
                                 hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{isChat ? '💬' : '📄'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                              {isChat ? '对话' : '记忆'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {result.content}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* 右侧消息详情 - 移动端根据 showDetail 显示 */}
      <div className={`${showDetail ? 'block' : 'hidden'} sm:block flex-1 flex flex-col bg-white overflow-hidden`} style={{ height: '100%' }}>
        {selectedSession ? (
          <>
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="sm:hidden text-gray-500 hover:text-gray-700 p-2"
                >
                  ←
                </button>
                <div>
                  <h3 className="font-semibold text-gray-800">对话详情</h3>
                  <p className="text-xs text-gray-500">
                    {messages[0] && formatFullDate(messages[0].timestamp)}
                  </p>
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ overflowY: 'auto', maxHeight: '100%' }}>
              {messages
                .filter(m => m.type === 'message' && m.message)
                .map((msg, idx) => (
                  <div key={msg.id || idx} className="flex justify-start">
                    <div className="max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 text-gray-800 rounded-bl-md">
                      <div className="text-xs text-gray-500 mb-1">
                        {new Date(msg.timestamp).toLocaleString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">
                        {msg.message?.content?.map((c, i) => (
                          <span key={i}>{c.text || ''}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              
              {messages.filter(m => m.type === 'message' && m.message).length === 0 && (
                <div className="text-center text-gray-400 py-10">
                  暂无消息内容
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p>选择左侧对话查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">加载中...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
