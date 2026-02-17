import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 从环境变量获取路径，默认使用当前工作目录
const SESSIONS_PATH = process.env.OCMM_SESSIONS_PATH || process.env.HOME + '/.openclaw/agents/main/sessions'

interface SessionInfo {
  id: string
  timestamp: string
  cwd: string
  messageCount: number
  preview: string
}

// GET /api/chat-logs - 列出所有对话会话
// GET /api/chat-logs?session=xxx - 读取单个会话详情
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session')

  // 读取单个会话详情
  if (sessionId) {
    const filePath = path.join(SESSIONS_PATH, `${sessionId}.jsonl`)
    
    try {
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.trim().split('\n').filter(Boolean)
      const messages = lines.map(line => JSON.parse(line))

      return NextResponse.json({ sessionId, messages })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to read session' }, { status: 500 })
    }
  }

  // 列出所有会话
  try {
    const files = fs.readdirSync(SESSIONS_PATH)
      .filter(f => f.endsWith('.jsonl'))
      .sort()
      .reverse()

    const sessions: SessionInfo[] = []

    for (const file of files.slice(0, 50)) { // 只取最近50个
      const filePath = path.join(SESSIONS_PATH, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.trim().split('\n').filter(Boolean)
      
      if (lines.length === 0) continue

      const firstLine = JSON.parse(lines[0])
      const messages = lines
        .map(l => JSON.parse(l))
        .filter(l => l.type === 'message')
      
      // 获取第一条用户消息或助手消息作为预览
      let preview = ''
      for (const msg of messages) {
        if (msg.message?.content?.[0]?.text) {
          preview = msg.message.content[0].text.slice(0, 100)
          break
        }
      }

      sessions.push({
        id: firstLine.id || file.replace('.jsonl', ''),
        timestamp: firstLine.timestamp,
        cwd: firstLine.cwd,
        messageCount: messages.length,
        preview
      })
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read sessions' }, { status: 500 })
  }
}
