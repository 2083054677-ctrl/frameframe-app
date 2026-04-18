import type { Project, Frame } from '../types'

const PROJECTS_KEY = 'frameframe-projects'

function readAll(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function listProjects(): Project[] {
  return readAll()
}

export function getProject(id: string): Project | null {
  return readAll().find(p => p.id === id) ?? null
}

export function saveProject(project: Project) {
  const all = readAll()
  const idx = all.findIndex(p => p.id === project.id)
  if (idx >= 0) {
    all[idx] = project
  } else {
    all.unshift(project)
  }
  writeAll(all)
}

export function deleteProject(id: string) {
  writeAll(readAll().filter(p => p.id !== id))
}

export function generateId(): string {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function createFrame(overrides?: Partial<Frame>): Frame {
  return {
    id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sortOrder: 0,
    duration: 2,
    shotType: 'medium',
    content: '',
    action: '',
    cameraMovement: 'static',
    screenText: null,
    voiceover: null,
    soundEffect: null,
    transition: 'cut',
    frameLabel: 'feature',
    imagePrompt: null,
    imageUrl: null,
    imageStatus: 'pending',
    videoClipUrl: null,
    videoStatus: 'pending',
    ...overrides,
  }
}
