'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface MemoryFile {
  name: string
  path: string
  type: 'memory' | 'daily' | 'config'
  lastModified?: string
}

function HomeContent() {
  const searchParams = useSearchParams()
  const initialFile = searchParams.get('file')
  
  const [files, setFiles] = useState<MemoryFile[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(initialFile)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  // 加载文件列表
  useEffect(() => {
    fetch('/api/memories')
      .then(res => res.json())
      .then(data => {
        setFiles(data.files || [])
        setLoading(false)
      })
  }, [])

  // 加载选中文件内容
  useEffect(() => {
    if (selectedFile) {
      setLoading(true)
      fetch(`/api/memories?path=${encodeURIComponent(selectedFile)}`)
        .then(res => res.json())
        .then(data => {
          setContent(data.content || '')
          setWordCount(data.content?.length || 0)
          setLoading(false)
        })
    }
  }, [selectedFile])

  const handleSave = async () => {
    if (!selectedFile) return
    setSaving(true)
    try {
      const res = await fetch('/api/memories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFile, content })
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e) {
      alert('保存失败')
    }
    setSaving(false)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'memory': return '🧠'
      case 'daily': return '📝'
      case 'config': return '⚙️'
      default: return '📄'
    }
  }

  const getDesc = (name: string) => {
    if (name === 'MEMORY.md') return '长期记忆'
    if (name === 'SOUL.md') return 'AI 灵魂'
    if (name === 'USER.md') return '用户信息'
    if (name === 'IDENTITY.md') return 'AI 身份'
    if (name === 'HEARTBEAT.md') return '心跳任务'
    return '每日记忆'
  }

  const selectedFileName = selectedFile ? selectedFile.split('/').pop() || '' : ''

  return (
    <div className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
      {/* 移动端：保持原有布局 */}
      <div className="sm:hidden h-full">
        {!selectedFile ? (
          // 移动端列表页
          <FileList 
            files={files} 
            onSelect={setSelectedFile}
            getIcon={getIcon}
            getDesc={getDesc}
          />
        ) : (
          // 移动端编辑页
          <Editor
            fileName={selectedFileName}
            content={content}
            setContent={setContent}
            wordCount={wordCount}
            setWordCount={setWordCount}
            onSave={handleSave}
            saving={saving}
            saved={saved}
            onBack={() => setSelectedFile(null)}
          />
        )}
      </div>

      {/* 桌面端：左右分栏 */}
      <div className="hidden sm:flex h-full">
        {/* 左侧文件列表 */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">记忆文件</h2>
            <FileList 
              files={files} 
              selectedFile={selectedFile}
              onSelect={setSelectedFile}
              getIcon={getIcon}
              getDesc={getDesc}
              compact
            />
          </div>
        </div>

        {/* 右侧编辑区 */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedFile ? (
            <Editor
              fileName={selectedFileName}
              content={content}
              setContent={setContent}
              wordCount={wordCount}
              setWordCount={setWordCount}
              onSave={handleSave}
              saving={saving}
              saved={saved}
              fullWidth
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <p>选择左侧文件开始编辑</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 文件列表组件
function FileList({ 
  files, 
  selectedFile,
  onSelect, 
  getIcon, 
  getDesc,
  compact 
}: { 
  files: MemoryFile[]
  selectedFile?: string | null
  onSelect: (path: string) => void
  getIcon: (type: string) => string
  getDesc: (name: string) => string
  compact?: boolean
}) {
  return (
    <div className="space-y-2">
      {files.map((file) => (
        <button
          key={file.path}
          onClick={() => onSelect(file.path)}
          className={`w-full text-left p-3 rounded-xl transition-all ${
            selectedFile === file.path
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{getIcon(file.type)}</span>
            <div className="flex-1 min-w-0">
              <div className={`font-medium truncate ${
                selectedFile === file.path ? 'text-white' : 'text-gray-800'
              }`}>
                {file.name}
              </div>
              {!compact && (
                <div className={`text-sm truncate ${
                  selectedFile === file.path ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {getDesc(file.name)}
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

// 编辑器组件
function Editor({
  fileName,
  content,
  setContent,
  wordCount,
  setWordCount,
  onSave,
  saving,
  saved,
  onBack,
  fullWidth
}: {
  fileName: string | null
  content: string
  setContent: (c: string) => void
  wordCount: number
  setWordCount: (n: number) => void
  onSave: () => void
  saving: boolean
  saved: boolean
  onBack?: () => void
  fullWidth?: boolean
}) {
  return (
    <div className="flex flex-col h-full">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
          )}
          <h2 className="text-lg font-bold text-gray-800">{fileName}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{wordCount} 字符</span>
          <button
            onClick={onSave}
            disabled={saving}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              saved 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } disabled:opacity-50`}
          >
            {saving ? '保存中...' : saved ? '✓ 已保存' : '保存'}
          </button>
        </div>
      </div>

      {/* 编辑器 */}
      <div className="flex-1 p-4">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setWordCount(e.target.value.length)
          }}
          className="w-full h-full p-4 bg-gray-50 rounded-xl border border-gray-200 
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none 
                     resize-none editor-textarea text-sm leading-relaxed"
          placeholder="开始编辑..."
          spellCheck={false}
        />
      </div>
    </div>
  )
}

// 主组件导出
export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-pulse text-gray-500">加载中...</div></div>}>
      <HomeContent />
    </Suspense>
  )
}
