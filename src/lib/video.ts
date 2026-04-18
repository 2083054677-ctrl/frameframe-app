/**
 * Video Generation API — 豆包 Seedance 2.0
 *
 * 异步任务模式：提交生成任务 → 轮询状态 → 获取视频 URL
 * 端点：POST /contents/generations/tasks  (创建)
 *       GET  /contents/generations/tasks/:id (查询)
 */

import { getConfig } from './config'

interface VideoContentItem {
  type: 'text' | 'image_url' | 'video_url' | 'audio_url'
  text?: string
  image_url?: { url: string }
  video_url?: { url: string }
  audio_url?: { url: string }
  role?: string
}

export interface GenerateVideoParams {
  prompt: string
  imageUrl?: string
  ratio?: '16:9' | '9:16' | '1:1'
  duration?: number
}

interface TaskResponse {
  id: string
  status: 'running' | 'succeeded' | 'failed'
  content?: { video_url?: string }
  error?: { message: string }
}

export async function generateVideoClip(
  params: GenerateVideoParams,
  onProgress?: (status: string) => void,
): Promise<string> {
  const config = getConfig().video

  if (!config.apiKey || !config.baseUrl) {
    throw new Error('请先在设置中配置 Video API')
  }

  const content: VideoContentItem[] = [
    { type: 'text', text: params.prompt },
  ]

  if (params.imageUrl) {
    content.push({
      type: 'image_url',
      image_url: { url: params.imageUrl },
      role: 'reference_image',
    })
  }

  // Step 1: 提交生成任务
  onProgress?.('提交任务中...')
  const createRes = await fetch(`${config.baseUrl}/contents/generations/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      content,
      ratio: params.ratio || '9:16',
      duration: params.duration || 8,
      watermark: false,
    }),
  })

  if (!createRes.ok) {
    const text = await createRes.text()
    throw new Error(`Video API 创建任务失败 (${createRes.status}): ${text}`)
  }

  const task: TaskResponse = await createRes.json()
  const taskId = task.id
  if (!taskId) throw new Error('Video API 未返回 task id')

  // Step 2: 轮询任务状态，最多等 5 分钟
  onProgress?.('生成中...')
  const MAX_POLL = 60
  const POLL_INTERVAL = 5000

  for (let i = 0; i < MAX_POLL; i++) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL))

    const pollRes = await fetch(`${config.baseUrl}/contents/generations/tasks/${taskId}`, {
      headers: { 'Authorization': `Bearer ${config.apiKey}` },
    })

    if (!pollRes.ok) {
      const text = await pollRes.text()
      throw new Error(`Video API 查询失败 (${pollRes.status}): ${text}`)
    }

    const result: TaskResponse = await pollRes.json()

    if (result.status === 'succeeded') {
      const videoUrl = result.content?.video_url
      if (!videoUrl) throw new Error('任务完成但未返回视频 URL')
      return videoUrl
    }

    if (result.status === 'failed') {
      throw new Error(`视频生成失败: ${result.error?.message || '未知错误'}`)
    }

    onProgress?.(`生成中... (${i + 1}/${MAX_POLL})`)
  }

  throw new Error('视频生成超时，请稍后在任务列表中查看')
}
