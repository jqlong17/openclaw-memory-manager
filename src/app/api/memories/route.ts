import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 从环境变量获取路径，默认使用当前工作目录
const WORKSPACE_PATH = process.env.OCMM_WORKSPACE_PATH || process.env.HOME + '/.openclaw/workspace'

// GET /api/memories - 列出所有记忆文件
// GET /api/memories?path=xxx - 读取单个文件
// PUT /api/memories - 保存文件
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get('path')

  // 如果有 path 参数，读取单个文件
  if (filePath) {
    const fullPath = path.resolve(filePath)
    if (!fullPath.startsWith(WORKSPACE_PATH)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 })
    }

    try {
      if (!fs.existsSync(fullPath)) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 })
      }

      const content = fs.readFileSync(fullPath, 'utf-8')
      const stats = fs.statSync(fullPath)

      return NextResponse.json({
        content,
        lastModified: stats.mtime.toISOString(),
        name: path.basename(fullPath)
      })
    } catch (error) {
      return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
    }
  }

  // 否则列出所有文件
  try {
    const files: Array<{
      name: string
      path: string
      type: 'memory' | 'daily' | 'config'
      lastModified?: string
    }> = []

    // 主目录文件
    const mainFiles = ['MEMORY.md', 'SOUL.md', 'USER.md', 'IDENTITY.md', 'HEARTBEAT.md', 'AGENTS.md', 'TOOLS.md']
    
    for (const file of mainFiles) {
      const fPath = path.join(WORKSPACE_PATH, file)
      if (fs.existsSync(fPath)) {
        const stats = fs.statSync(fPath)
        files.push({
          name: file,
          path: fPath,
          type: file === 'MEMORY.md' ? 'memory' : 'config',
          lastModified: stats.mtime.toISOString()
        })
      }
    }

    // memory 目录
    const memoryDir = path.join(WORKSPACE_PATH, 'memory')
    if (fs.existsSync(memoryDir)) {
      const memoryFiles = fs.readdirSync(memoryDir)
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse()
      
      for (const file of memoryFiles) {
        const fPath = path.join(memoryDir, file)
        const stats = fs.statSync(fPath)
        files.push({
          name: file,
          path: fPath,
          type: 'daily',
          lastModified: stats.mtime.toISOString()
        })
      }
    }

    return NextResponse.json({ files })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read memories' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { path: filePath, content } = await request.json()

    if (!filePath || content === undefined) {
      return NextResponse.json({ error: 'Missing path or content' }, { status: 400 })
    }

    // 安全检查
    const fullPath = path.resolve(filePath)
    if (!fullPath.startsWith(WORKSPACE_PATH)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 })
    }

    fs.writeFileSync(fullPath, content, 'utf-8')

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
  }
}
