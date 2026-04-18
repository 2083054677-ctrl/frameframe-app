export const LABEL_COLORS: Record<string, string> = {
  hook: 'bg-orange-100 text-orange-600',
  feature: 'bg-blue-100 text-blue-600',
  benefit: 'bg-emerald-100 text-emerald-600',
  'social-proof': 'bg-amber-100 text-amber-600',
  cta: 'bg-rose-100 text-rose-600',
}

export const LABEL_TEXT: Record<string, string> = {
  hook: 'Hook', feature: '展示', benefit: '卖点', 'social-proof': '证言', cta: 'CTA',
}

export const LABEL_DESCRIPTIONS: Record<string, string> = {
  hook: 'Hook — 开场抓住注意力',
  feature: '展示 — 展示产品/场景',
  benefit: '卖点 — 突出核心优势',
  'social-proof': '证言 — 用户评价',
  cta: 'CTA — 引导行动',
}

export const SHOT_TYPES = ['close-up', 'medium', 'wide', 'detail', 'overhead', 'pov']
export const CAMERA_MOVES = ['static', 'pan-left', 'pan-right', 'zoom-in', 'zoom-out', 'tracking']
export const TRANSITIONS = ['cut', 'fade', 'dissolve']

export const STYLES = [
  { id: 'product-showcase', label: '产品展示', desc: '突出外观与细节' },
  { id: 'use-scene', label: '使用场景', desc: '真实场景演示' },
  { id: 'pain-point', label: '痛点解决', desc: '先戳痛点再给方案' },
]

export const DURATIONS = [
  { value: 4, label: '4s', desc: '超短' },
  { value: 8, label: '8s', desc: '标准' },
  { value: 15, label: '15s', desc: '完整' },
]

export const PLATFORMS = [
  { id: 'douyin', label: '抖音' },
  { id: 'xiaohongshu', label: '小红书' },
  { id: 'kuaishou', label: '快手' },
  { id: 'taobao', label: '淘宝主图' },
]
