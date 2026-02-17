import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const WORKSPACE_PATH = process.env.OCMM_WORKSPACE_PATH || process.env.HOME + '/.openclaw/workspace'
const SESSIONS_PATH = process.env.OCMM_SESSIONS_PATH || process.env.HOME + '/.openclaw/agents/main/sessions'

export type SearchResult =
  | { type: 'memory'; file: string; path: string; content: string }
  | { type: 'chat'; sessionId: string; file: string; path: string; content: string }

function searchInFile(filePath: string, query: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lowerContent = content.toLowerCase()
    const lowerQuery = query.toLowerCase()

    if (lowerContent.includes(lowerQuery)) {
      const lines = content.split('\n')
      const matchingLines = lines
        .filter(line => line.toLowerCase().includes(lowerQuery))
        .slice(0, 3)
        .map(line => line.trim())
        .filter(line => line.length > 0)

      return matchingLines.join(' | ')
    }
    return null
  } catch {
    return null
  }
}

function searchInSessionJsonl(filePath: string, query: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.trim().split('\n').filter(Boolean)
    const lowerQuery = query.toLowerCase()
    const snippets: string[] = []

    for (const line of lines) {
      const row = JSON.parse(line)
      if (row.type !== 'message' || !row.message?.content) continue

      const text = (row.message.content as { type: string; text?: string }[])
        .map((c: { type: string; text?: string }) => c.text || '')
        .join('')
      if (!text || !text.toLowerCase().includes(lowerQuery)) continue

      const trimmed = text.trim().slice(0, 120)
      snippets.push(trimmed + (text.length > 120 ? '…' : ''))
      if (snippets.length >= 3) break
    }

    return snippets.length > 0 ? snippets.join(' | ') : null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results: SearchResult[] = []

  // 搜索主目录 .md
  try {
    const mainFiles = fs.readdirSync(WORKSPACE_PATH).filter(f => f.endsWith('.md'))
    for (const file of mainFiles) {
      const filePath = path.join(WORKSPACE_PATH, file)
      const match = searchInFile(filePath, query)
      if (match) {
        results.push({ type: 'memory', file, path: filePath, content: match })
      }
    }
  } catch {
    // 工作区不存在时忽略
  }

  // 搜索 memory 目录
  const memoryDir = path.join(WORKSPACE_PATH, 'memory')
  if (fs.existsSync(memoryDir)) {
    const memoryFiles = fs.readdirSync(memoryDir).filter(f => f.endsWith('.md'))
    for (const file of memoryFiles) {
      const filePath = path.join(memoryDir, file)
      const match = searchInFile(filePath, query)
      if (match) {
        results.push({ type: 'memory', file, path: filePath, content: match })
      }
    }
  }

  // 搜索对话日志（sessions/*.jsonl）
  if (fs.existsSync(SESSIONS_PATH)) {
    const sessionFiles = fs.readdirSync(SESSIONS_PATH).filter(f => f.endsWith('.jsonl'))
    for (const file of sessionFiles) {
      const filePath = path.join(SESSIONS_PATH, file)
      const match = searchInSessionJsonl(filePath, query)
      if (match) {
        const sessionId = file.replace(/\.jsonl$/, '')
        results.push({
          type: 'chat',
          sessionId,
          file,
          path: filePath,
          content: match
        })
      }
    }
  }

  return NextResponse.json({ results })
}
