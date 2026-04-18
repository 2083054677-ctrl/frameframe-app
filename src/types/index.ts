export interface Frame {
  id: string
  sortOrder: number
  duration: number
  shotType: string
  content: string
  action: string
  cameraMovement: string
  screenText: string | null
  voiceover: string | null
  soundEffect: string | null
  transition: string
  frameLabel: string
  imagePrompt: string | null
  imageUrl: string | null
  imageStatus: 'pending' | 'generating' | 'done' | 'failed'
  videoClipUrl: string | null
  videoStatus: 'pending' | 'generating' | 'done' | 'failed'
}

export interface Project {
  id: string
  name: string
  sellingPoints: string[]
  style: string
  duration: number
  platform: string | null
  status: string
  frames: Frame[]
}
