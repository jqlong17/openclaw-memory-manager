'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function EditContent() {
  const searchParams = useSearchParams()
  const filePath = searchParams.get('file')
  
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    if (filePath) {
      fetch(`/api/memories?path=${encodeURIComponent(filePath)}`)
        .then(res => {
          if (!res.ok) throw new Error('加载失败')
          return res.json()
        })
        .then(data => {
          setContent(data.content || '')
          setWordCount(data.content?.length || 0)
          setLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [filePath])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/memories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, content })
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        throw new Error('保存失败')
      }
    } catch (e) {
      setError('保存失败，请重试')
    }
    setSaving(false)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setWordCount(e.target.value.length)
    setError('')
  }

  const fileName = filePath ? filePath.split('/').pop() : ''

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error && !content) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 sm:pb-0">
      {/* 顶部工具栏 */}
      <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* 文件名 */}
          <div className="flex items-center gap-2 min-w-0">
            <a 
              href="/" 
              className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              ←
            </a>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {fileName}
            </h2>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
              {wordCount} 字符
            </span>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                saved 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed touch-target`}
            >
              {saving ? '保存中...' : saved ? '✓ 已保存' : '保存'}
            </button>
          </div>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* 编辑器 */}
      <div className="relative">
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full min-h-[60vh] sm:min-h-[70vh] p-4 bg-white rounded-xl border border-gray-200 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none 
                     resize-none editor-textarea text-sm sm:text-base"
          placeholder="开始编辑..."
          spellCheck={false}
        />
      </div>

      {/* 底部信息栏 - 移动端 */}
      <div className="sm:hidden mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{wordCount} 字符</span>
        <span>{new Date().toLocaleDateString('zh-CN')}</span>
      </div>
    </div>
  )
}

export default function EditPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-gray-500">加载中...</div>
      </div>
    }>
      <EditContent />
    </Suspense>
  )
}
