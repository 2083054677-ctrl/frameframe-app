import type { Frame, Project } from '../types'

export const MOCK_FRAMES: Frame[] = [
  {
    id: 'f1', sortOrder: 0, duration: 2, shotType: 'close-up',
    content: '女生大口咬汉堡，表情满足', action: '咬汉堡，微笑',
    cameraMovement: 'zoom-in', screenText: '开吃啦！', voiceover: '今天的快乐从麦当劳开始',
    soundEffect: '轻快背景音乐', transition: 'cut', frameLabel: 'hook',
    imagePrompt: null, imageUrl: null, imageStatus: 'done',
    videoClipUrl: null, videoStatus: 'pending',
  },
  {
    id: 'f2', sortOrder: 1, duration: 2.5, shotType: 'detail',
    content: '薯条蘸浓郁芝士酱，拉丝效果', action: '手拿薯条蘸酱',
    cameraMovement: 'static', screenText: '薯条蘸酱，一口满足！', voiceover: null,
    soundEffect: '食物音效', transition: 'cut', frameLabel: 'feature',
    imagePrompt: null, imageUrl: null, imageStatus: 'done',
    videoClipUrl: null, videoStatus: 'pending',
  },
  {
    id: 'f3', sortOrder: 2, duration: 2.5, shotType: 'medium',
    content: '女生手持迷你包，开心展示', action: '举起包，对镜头微笑',
    cameraMovement: 'pan-right', screenText: '我的吃播好搭子就是它！', voiceover: null,
    soundEffect: null, transition: 'cut', frameLabel: 'feature',
    imagePrompt: null, imageUrl: null, imageStatus: 'done',
    videoClipUrl: null, videoStatus: 'pending',
  },
  {
    id: 'f4', sortOrder: 3, duration: 3, shotType: 'detail',
    content: '迷你包特写，搭配汉堡薯条同框', action: '产品静态展示',
    cameraMovement: 'tracking', screenText: '吃播搭子上线！超能装又好看！', voiceover: '轻便小巧，大容量空间',
    soundEffect: null, transition: 'dissolve', frameLabel: 'benefit',
    imagePrompt: null, imageUrl: null, imageStatus: 'done',
    videoClipUrl: null, videoStatus: 'pending',
  },
  {
    id: 'f5', sortOrder: 4, duration: 2.5, shotType: 'medium',
    content: '女生吃薯条，手持迷你包', action: '边吃边展示',
    cameraMovement: 'static', screenText: '麦当劳限定快乐！限时优惠 立减10元！', voiceover: null,
    soundEffect: '欢快音乐', transition: 'cut', frameLabel: 'benefit',
    imagePrompt: null, imageUrl: null, imageStatus: 'done',
    videoClipUrl: null, videoStatus: 'pending',
  },
  {
    id: 'f6', sortOrder: 5, duration: 2.5, shotType: 'wide',
    content: '迷你包 C 位，旁边汉堡薯条麦旋风', action: '产品 hero shot',
    cameraMovement: 'zoom-out', screenText: '美味随行 快乐加倍', voiceover: '点击下方 立即拥有同款！',
    soundEffect: '品牌音效', transition: 'fade', frameLabel: 'cta',
    imagePrompt: null, imageUrl: null, imageStatus: 'done',
    videoClipUrl: null, videoStatus: 'pending',
  },
]

export const MOCK_PROJECT: Project = {
  id: 'demo',
  name: '麦当劳迷你包',
  sellingPoints: ['轻便小巧', '大容量空间', '可爱爱心挂饰', '多种背法'],
  style: 'use-scene',
  duration: 15,
  platform: 'douyin',
  status: 'images_ready',
  frames: MOCK_FRAMES,
}
