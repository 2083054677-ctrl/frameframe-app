/**
 * LLM API — 生成分镜脚本
 *
 * 兼容 OpenAI Chat Completions 格式。
 * 可接入：OpenAI / Claude (via proxy) / Deepseek / 任何兼容接口。
 */

import { getConfig } from './config'
import type { Frame } from '../types'

// ============================================================
// 叙事框架知识库
// ============================================================

const NARRATIVE_FRAMEWORKS: Record<string, string> = {
  'product-showcase': `【叙事框架：AIDA（注意→兴趣→欲望→行动）】
节奏：快速递进，每帧信息密度高，视觉冲击优先
- hook: 用产品最惊艳的视觉瞬间制造 pattern interrupt（反常规展示、极致特写、意想不到的使用方式）
- feature: 多角度展示产品细节，每帧聚焦一个感官维度（触感/光泽/质地/声音）
- benefit: 将功能转化为用户能感受到的情绪价值
- cta: 产品 hero shot + 行动指令`,

  'use-scene': `【叙事框架：BAB（现状→理想→桥梁）】
节奏：生活化、有呼吸感，镜头跟随人物自然流动
- hook: 一个让目标用户立刻产生"这就是我"共鸣的生活瞬间（利用 personal relevance 触发器）
- feature: 产品自然融入场景，不刻意展示，像朋友随手分享
- benefit: 展示使用后的状态变化（表情、氛围、生活质感的提升）
- cta: 回到生活场景，产品成为日常的一部分`,

  'pain-point': `【叙事框架：PAS（痛点→放大→解决）】
节奏：前紧后松，痛点部分快速制造焦虑，解决部分节奏放缓带来释放感
- hook: 直击痛点的画面或问题（利用 curiosity gap + emotional arousal 触发器）
- feature: 放大痛点的后果，制造"不解决不行"的紧迫感
- benefit: 产品登场，干净利落地解决问题，画面从压抑转向明亮
- cta: 对比前后状态，强化"改变就在一步之间"`,
}

// ============================================================
// 平台特征知识库
// ============================================================

const PLATFORM_KNOWLEDGE: Record<string, string> = {
  'douyin': `【抖音特征】
- 前 1 秒决定生死，hook 必须极致短促有力
- 竖版全屏，人物面部和产品要占画面 60%+
- 文案口语化、有网感，善用反问和省略号制造悬念
- 背景音乐节奏感强，画面切换要卡点
- 字幕大而醒目，关键词用高亮色
- 用户习惯快速滑动，每 2 秒必须有新的视觉刺激`,

  'xiaohongshu': `【小红书特征】
- 调性偏精致、真实、有审美，避免过度营销感
- 画面要有"生活感"和"氛围感"，暖色调自然光为主
- 文案像闺蜜分享，用"姐妹们"、"真的绝了"等口语
- 产品展示要融入生活场景，不能太硬广
- 封面帧（第一帧）决定点击率，要有杂志感构图
- 节奏可以比抖音稍慢，允许 3-4 秒的氛围镜头`,

  'kuaishou': `【快手特征】
- 真实接地气，避免过度精致
- 人物表达要自然直接，像面对面聊天
- 产品功能演示要实在，少花哨多实用
- 文案朴实有力，用大白话说清楚价值`,

  'taobao': `【淘宝短视频特征】
- 用户已有购买意图，重点展示产品细节和使用效果
- 前 3 秒要出现产品核心卖点
- 多用对比（使用前后、竞品对比）
- 价格和优惠信息要在画面中突出
- 节奏紧凑，信息密度高`,
}

// ============================================================
// 核心 System Prompt
// ============================================================

const SYSTEM_PROMPT = `你是一位精通认知心理学和叙事理论的短视频广告分镜导演。
你深谙"叙事运输理论"——当观众被故事吸入时，反驳能力下降，情感参与和品牌记忆显著提升。
你的每一个分镜决策都基于对人类注意力机制的理解。

## 你的创作原则

### Hook 心理学（第一帧）
hook 的本质是制造"朝向反应"——打破观众的自动滚动行为。有效的 hook 至少利用以下触发器之一：
- Pattern Interrupt: 反常规画面、意想不到的开场
- Curiosity Gap: 信息缺口制造认知张力（"你绝对想不到..."）
- Emotional Arousal: 高唤醒情绪（惊讶、好奇、共鸣）
- Personal Relevance: 让目标用户立刻觉得"这说的就是我"

### 节奏控制
- 15 秒视频：4-5 帧，hook 1-2 秒，中间帧 2-3 秒，CTA 2-3 秒
- 30 秒视频：6-8 帧，hook 2-3 秒，中间帧 3-4 秒，CTA 3-4 秒
- 60 秒视频：10-14 帧，hook 2-3 秒，中间帧 4-5 秒，CTA 4-5 秒
- 每 2-3 秒必须有视觉变化（景别切换、镜头运动、新元素入画）
- 情绪曲线要有起伏：紧→松→紧→释放

### 画面描述规范（content 字段）
每帧的 content 必须包含以下视觉要素，使其可直接用于 AI 图片生成：
- 主体：谁/什么在画面中，具体姿态和表情
- 环境：场景、光线方向和质感（如"侧逆光暖色调"、"柔和窗光"）
- 构图：主体在画面中的位置和比例（如"产品居中占画面 1/3"、"人物偏左三分构图"）
- 色调情绪：整体色彩倾向和氛围（如"奶油色暖调"、"高对比冷调"）
- 关键细节：一个让画面生动的具体细节（如"发丝上的光晕"、"杯壁上的水珠"）

### 文案风格
- screenText: 短促有力，不超过 10 个字，像弹幕一样一眼能读完
- voiceover: 口语化、有节奏感，像在跟朋友说话而不是念稿

## 输出格式

返回 JSON 对象 { "frames": [...] }，每帧包含：
- duration: 时长（秒，精确到 0.5）
- shotType: 景别（"close-up" | "medium" | "wide" | "detail" | "overhead" | "pov"）
- content: 画面内容（遵循上述视觉描述规范）
- action: 人物/产品动作（具体到可执行）
- cameraMovement: 镜头运动（"static" | "pan-left" | "pan-right" | "zoom-in" | "zoom-out" | "tracking"）
- screenText: 屏幕文案（短促有力）
- voiceover: 旁白（口语化，可为 null）
- soundEffect: 音效（具体描述，可为 null）
- transition: 转场（"cut" | "fade" | "dissolve"）
- frameLabel: 帧标签（"hook" | "feature" | "benefit" | "social-proof" | "cta"）

## 硬性约束
- 只返回 JSON，不要其他文字
- 所有帧时长之和必须精确等于目标总时长
- 第一帧必须是 hook，最后一帧必须是 cta
- 相邻帧的景别不能相同（避免视觉单调）
- 每帧的 content 不少于 30 字（确保视觉描述充分）`

interface GenerateScriptParams {
  productName: string
  sellingPoints: string[]
  style: string
  duration: number
  platform: string | null
}

export async function generateScript(params: GenerateScriptParams): Promise<Frame[]> {
  const config = getConfig().llm

  if (!config.apiKey) {
    throw new Error('请先在设置中配置 LLM API Key')
  }

  const narrativeFramework = NARRATIVE_FRAMEWORKS[params.style] || NARRATIVE_FRAMEWORKS['use-scene']
  const platformKnowledge = params.platform
    ? (PLATFORM_KNOWLEDGE[params.platform] || '')
    : ''

  const styleMap: Record<string, string> = {
    'product-showcase': '产品展示型（AIDA 框架）：以产品为主角，通过视觉冲击递进到欲望',
    'use-scene': '使用场景型（BAB 框架）：展示产品融入真实生活的自然状态',
    'pain-point': '痛点解决型（PAS 框架）：先制造焦虑，再用产品带来释放',
  }

  const userMessage = `【产品信息】
产品名称：${params.productName}
核心卖点：${params.sellingPoints.join('、')}

【创作需求】
广告风格：${styleMap[params.style] || params.style}
目标时长：${params.duration} 秒
目标平台：${params.platform || '通用短视频'}

${narrativeFramework}

${platformKnowledge}

请基于以上叙事框架和平台特征，生成完整分镜脚本。
记住：hook 帧要利用至少一个心理触发器，画面描述要包含光线、构图、色调信息。`

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`LLM API 错误 (${res.status}): ${text}`)
  }

  const data = await res.json()
  const content = data.choices[0].message.content

  // 提取 JSON（兼容 markdown code block 包裹）
  const jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim()
  const parsed = JSON.parse(jsonStr)
  const arr = Array.isArray(parsed) ? parsed : parsed.frames

  return arr.map((f: Record<string, unknown>, i: number) => ({
    id: `f-${Date.now()}-${i}`,
    sortOrder: i,
    duration: Number(f.duration) || 2,
    shotType: String(f.shotType || 'medium'),
    content: String(f.content || ''),
    action: String(f.action || ''),
    cameraMovement: String(f.cameraMovement || 'static'),
    screenText: f.screenText ? String(f.screenText) : null,
    voiceover: f.voiceover ? String(f.voiceover) : null,
    soundEffect: f.soundEffect ? String(f.soundEffect) : null,
    transition: String(f.transition || 'cut'),
    frameLabel: String(f.frameLabel || 'feature'),
    imagePrompt: null,
    imageUrl: null,
    imageStatus: 'pending' as const,
    videoClipUrl: null,
    videoStatus: 'pending' as const,
  }))
}
