/**
 * Image Generation API — 生成分镜参考图
 *
 * 兼容 OpenAI Images API 格式。
 * 可接入：OpenAI gpt-image-1 / DALL-E 3 / 任何兼容接口。
 */

import { getConfig } from './config'
import type { Frame } from '../types'

interface GenerateImageParams {
  frame: Frame
  productName: string
  style: string
}

export async function generateFrameImage(params: GenerateImageParams): Promise<string> {
  const config = getConfig().image

  if (!config.apiKey) {
    throw new Error('请先在设置中配置 Image API Key')
  }

  const shotTypeMap: Record<string, string> = {
    'close-up': '近景特写，主体占画面 70%+，浅景深虚化背景',
    'medium': '中景，人物膝盖以上或产品完整展示，环境可见',
    'wide': '全景，展示完整场景和环境氛围，主体占画面 30-40%',
    'detail': '微距细节特写，极浅景深，突出材质纹理和光影',
    'overhead': '俯拍鸟瞰，物品平铺或场景全貌，几何构图感',
    'pov': '第一人称主观视角，画面有手部或身体局部入镜',
  }

  const frameEmotionMap: Record<string, string> = {
    'hook': '画面要有视觉冲击力或悬念感，色彩饱和度高，对比强烈',
    'feature': '画面清晰明亮，重点突出，引导视线到产品细节',
    'benefit': '画面温暖舒适，传递满足感和幸福感，柔和光线',
    'social-proof': '画面真实自然，有生活气息，像手机随拍的质感',
    'cta': '画面干净有力，产品居中，背景简洁，品牌色突出',
  }

  const emotionGuide = frameEmotionMap[params.frame.frameLabel] || ''

  const prompt = `短视频广告分镜参考图，竖版 9:16 构图。

画面内容：${params.frame.content}
动作：${params.frame.action}
景别：${shotTypeMap[params.frame.shotType] || params.frame.shotType}
产品：${params.productName}
${emotionGuide}

摄影风格：真实商业摄影质感，自然光为主，色彩真实不过度饱和。
构图要求：主体清晰突出，背景不抢戏，画面有呼吸感。
${params.frame.screenText ? `画面中需要出现文字："${params.frame.screenText}"，文字清晰可读。` : '画面中不需要出现文字。'}`

  const res = await fetch(`${config.baseUrl}/images/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      prompt,
      n: 1,
      size: '1024x1792', // 9:16
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Image API 错误 (${res.status}): ${text}`)
  }

  const data = await res.json()

  // 兼容 url 和 b64_json 两种返回格式
  if (data.data[0].url) {
    return data.data[0].url
  }
  if (data.data[0].b64_json) {
    return `data:image/png;base64,${data.data[0].b64_json}`
  }

  throw new Error('Image API 返回格式异常')
}
