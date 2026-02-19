'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface DailyMemory {
  date: string
  fileName: string
  path: string
  content: string
  preview: string
}

interface CalendarDay {
  date: string
  day: number
  month: number
  year: number
  hasMemory: boolean
  isToday: boolean
  isCurrentMonth: boolean
}

function DailyMemoryContent() {
  const searchParams = useSearchParams()
  const [memories, setMemories] = useState<DailyMemory[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<DailyMemory | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [showDetail, setShowDetail] = useState(false)

  // 加载每日记忆文件
  useEffect(() => {
    fetch('/api/memories?type=daily')
      .then(res => res.json())
      .then(data => {
        setMemories(data.memories || [])
        setLoading(false)
      })
  }, [])

  // 从 URL 恢复选中的日期
  useEffect(() => {
    const dateFromUrl = searchParams.get('date')
    if (dateFromUrl && memories.length > 0) {
      const memory = memories.find(m => m.date === dateFromUrl)
      if (memory) {
        setSelectedDate(dateFromUrl)
        setSelectedMemory(memory)
        setShowDetail(true)
      }
    }
  }, [searchParams, memories])

  // 生成日历数据
  const generateCalendar = (): CalendarDay[] => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const today = new Date()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days: CalendarDay[] = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      const currentYear = current.getFullYear()
      const currentMonthStr = String(current.getMonth() + 1).padStart(2, '0')
      const currentDay = String(current.getDate()).padStart(2, '0')
      const dateStr = `${currentYear}-${currentMonthStr}-${currentDay}`
      const hasMemory = memories.some(m => m.date === dateStr)
      
      days.push({
        date: dateStr,
        day: current.getDate(),
        month: current.getMonth(),
        year: current.getFullYear(),
        hasMemory,
        isToday: current.toDateString() === today.toDateString(),
        isCurrentMonth: current.getMonth() === month
      })
      
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const handleSelectDate = (date: string) => {
    setSelectedDate(date)
    const memory = memories.find(m => m.date === date)
    setSelectedMemory(memory || null)
    setShowDetail(true)
  }

  const handleBack = () => {
    setShowDetail(false)
    setSelectedDate(null)
    setSelectedMemory(null)
  }

  const changeMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1))
  }

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                      '七月', '八月', '九月', '十月', '十一月', '十二月']
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const calendar = generateCalendar()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col sm:flex-row overflow-hidden" style={{ height: 'calc(100vh - 7rem)' }}>
      {/* 左侧日历 - 移动端根据 showDetail 隐藏 */}
      <div className={`${showDetail ? 'hidden' : 'block'} sm:block w-full sm:w-96 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto`} style={{ height: '100%' }}>
        <div className="p-4">
          {/* 月份导航 */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ←
            </button>
            <h2 className="text-lg font-bold text-gray-800">
              {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
            </h2>
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              →
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* 日历网格 */}
          <div className="grid grid-cols-7 gap-1">
            {calendar.map((day, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDate(day.date)}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                  transition-all relative
                  ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                  ${day.isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                  ${selectedDate === day.date ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}
                  ${day.hasMemory && selectedDate !== day.date ? 'font-semibold' : ''}
                `}
              >
                <span>{day.day}</span>
                {day.hasMemory && (
                  <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                    selectedDate === day.date ? 'bg-white' : 'bg-blue-500'
                  }`} />
                )}
              </button>
            ))}
          </div>

          {/* 图例 */}
          <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>有记忆</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded ring-2 ring-blue-500 bg-blue-50" />
              <span>今天</span>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧内容详情 - 移动端根据 showDetail 显示 */}
      <div className={`${showDetail ? 'block' : 'hidden'} sm:block flex-1 flex flex-col bg-white overflow-hidden`} style={{ height: '100%' }}>
        {selectedDate ? (
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
                  <h3 className="font-semibold text-gray-800">
                    {selectedDate}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedMemory ? '有记忆内容' : '无记忆'}
                  </p>
                </div>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-4" style={{ overflowY: 'auto', maxHeight: '100%' }}>
              {selectedMemory ? (
                <div className="prose prose-sm max-w-none" style={{ minHeight: 'min-content' }}>
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {selectedMemory.content}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="text-6xl mb-4">📅</div>
                  <p>这一天没有记忆记录</p>
                  <p className="text-sm mt-2">选择其他日期查看</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">📅</div>
              <p>选择左侧日期查看记忆</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DailyMemoryPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-pulse text-gray-500">加载中...</div>
      </div>
    }>
      <DailyMemoryContent />
    </Suspense>
  )
}
