'use client'

import { useState, useEffect } from 'react'

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

export default function ChatLogsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    fetch('/api/chat-logs')
      .then(res => res.json())
      .then(data => {
        setSessions(data.sessions || [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (selectedSession) {
      fetch(`/api/chat-logs?session=${selectedSession}`)
        .then(res => res.json())
        .then(data => {
          setMessages(data.messages || [])
        })
    }
  }, [selectedSession])

  const handleSelectSession = (id: string) => {
    setSelectedSession(id)
    setShowDetail(true)
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
      minute: '2-digit',
      second: '2-digit'
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
    <div className="h-full flex flex-col sm:flex-row">
      {/* 左侧会话列表 - 移动端根据 showDetail 隐藏 */}
      <div className={`${showDetail ? 'hidden' : 'block'} sm:block w-full sm:w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto`}>
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💬 对话日志</h2>
          
          <div className="space-y-2">
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
                
                <p className={`text-xs mt-1 truncate ${
                  selectedSession === session.id ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {session.cwd}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧消息详情 - 移动端根据 showDetail 显示 */}
      <div className={`${showDetail ? 'block' : 'hidden'} sm:block flex-1 flex flex-col bg-white overflow-hidden`}>
        {selectedSession ? (
          <>
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="sm:hidden text-gray-500 hover:text-gray-700"
                >
                  ← 返回
                </button>
                <div>
                  <h3 className="font-semibold text-gray-800">会话详情</h3>
                  <p className="text-xs text-gray-500">
                    {messages[0] && formatFullDate(messages[0].timestamp)}
                  </p>
                </div>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .filter(m => m.type === 'message' && m.message)
                .map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className="flex justify-start"
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 text-gray-800 rounded-bl-md`}
                    >
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
              <p>选择左侧会话查看详情</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
