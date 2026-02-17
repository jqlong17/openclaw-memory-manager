import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const WORKSPACE_PATH = '/Users/ruska/.openclaw/workspace'

function searchInFile(filePath: string, query: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lowerContent = content.toLowerCase()
    const lowerQuery = query.toLowerCase()
    
    if (lowerContent.includes(lowerQuery)) {
      // 找到匹配的行
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const results: Array<{ file: string; path: string; content: string }> = []

  // 搜索主目录
  const mainFiles = fs.readdirSync(WORKSPACE_PATH)
    .filter(f => f.endsWith('.md'))

  for (const file of mainFiles) {
    const filePath = path.join(WORKSPACE_PATH, file)
    const match = searchInFile(filePath, query)
    if (match) {
      results.push({
        file,
        path: filePath,
        content: match
      })
    }
  }

  // 搜索 memory 目录
  const memoryDir = path.join(WORKSPACE_PATH, 'memory')
  if (fs.existsSync(memoryDir)) {
    const memoryFiles = fs.readdirSync(memoryDir)
      .filter(f => f.endsWith('.md'))

    for (const file of memoryFiles) {
      const filePath = path.join(memoryDir, file)
      const match = searchInFile(filePath, query)
      if (match) {
        results.push({
          file,
          path: filePath,
          content: match
        })
      }
    }
  }

  return NextResponse.json({ results })
}
