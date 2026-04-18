import { useState, useCallback, useEffect } from 'react'
import { Plus, Trash2, Film, Download, Home, Clock, Settings, ImageIcon, Loader2, User, ChevronUp, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FrameDetailPanel from '../components/editor/FrameDetailPanel'
import { MOCK_PROJECT } from '../data/mock'
import { generateFrameImage } from '../lib/image'
import { isConfigured } from '../lib/config'
import type { Frame } from '../types'

const LABEL_COLORS: Record<string, string> = {
  hook: 'bg-orange-100 text-orange-600',
  feature: 'bg-blue-100 text-blue-600',
  benefit: 'bg-emerald-100 text-emerald-600',
  'social-proof': 'bg-amber-100 text-amber-600',
  cta: 'bg-rose-100 text-rose-600',
}
const LABEL_TEXT: Record<string, string> = {
  hook: 'Hook', feature: '展示', benefit: '卖点', 'social-proof': '证言', cta: 'CTA',
}

export default function Editor() {
  const navigate = useNavigate()
  const [frames, setFrames] = useState<Frame[]>(MOCK_PROJECT.frames)
  const [selectedId, setSelectedId] = useState<string>(frames[0]?.id || '')

  const selectedFrame = frames.find(f => f.id === selectedId)
  const selectedIndex = frames.findIndex(f => f.id === selectedId)
  const totalDuration = frames.reduce((sum, f) => sum + f.duration, 0)

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedId(prev => {
          const idx = frames.findIndex(f => f.id === prev)
          return idx > 0 ? frames[idx - 1].id : prev
        })
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedId(prev => {
          const idx = frames.findIndex(f => f.id === prev)
          return idx < frames.length - 1 ? frames[idx + 1].id : prev
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [frames])
  const updateFrame = useCallback((id: string, updates: Partial<Frame>) => {
    setFrames(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }, [])

  const regenerateImage = useCallback(async (id: string) => {
    const frame = frames.find(f => f.id === id)
    if (!frame) return

    if (!isConfigured('image')) {
      alert('请先在设置中配置 Image API Key')
      return
    }

    updateFrame(id, { imageStatus: 'generating', imageUrl: null })
    try {
      const url = await generateFrameImage({
        frame,
        productName: MOCK_PROJECT.name,
        style: MOCK_PROJECT.style || '商业摄影',
      })
      updateFrame(id, { imageStatus: 'done', imageUrl: url })
    } catch (err) {
      console.error('Image generation failed:', err)
      updateFrame(id, { imageStatus: 'failed' })
      alert(`生图失败: ${err instanceof Error ? err.message : '未知错误'}`)
    }
  }, [frames, updateFrame])

  const addFrame = () => {
    const nf: Frame = {
      id: `f${Date.now()}`, sortOrder: frames.length, duration: 2,
      shotType: 'medium', content: '新镜头', action: '',
      cameraMovement: 'static', screenText: null, voiceover: null,
      soundEffect: null, transition: 'cut', frameLabel: 'feature',
      imagePrompt: null, imageUrl: null, imageStatus: 'pending',
      videoClipUrl: null, videoStatus: 'pending',
    }
    setFrames(prev => [...prev, nf])
    setSelectedId(nf.id)
  }

  const deleteFrame = (id: string) => {
    if (frames.length <= 1) return
    setFrames(prev => {
      const idx = prev.findIndex(f => f.id === id)
      const next = prev.filter(f => f.id !== id)
      if (selectedId === id) {
        const newIdx = Math.min(idx, next.length - 1)
        setSelectedId(next[newIdx]?.id || '')
      }
      return next
    })
  }

  const moveFrame = (id: string, dir: -1 | 1) => {
    setFrames(prev => {
      const idx = prev.findIndex(f => f.id === id)
      const newIdx = idx + dir
      if (newIdx < 0 || newIdx >= prev.length) return prev
      const copy = [...prev]
      ;[copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]]
      return copy
    })
  }

  return (
    <div className="flex h-screen bg-[#f8fafc]">

      {/* Left Nav Sidebar */}
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-slate-100 bg-white">
        <div className="px-5 pt-6 pb-2">
          <a href="/" className="font-[Plus_Jakarta_Sans] text-[18px] font-bold tracking-tight text-slate-800">
            帧帧
          </a>
          <p className="mt-0.5 text-[13px] text-slate-400">AI 视频分镜工具</p>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          <NavItem icon={Home} label="创作中心" active />
          <NavItem icon={Clock} label="历史记录" />
          <NavItem icon={Settings} label="设置" href="/settings" />
        </nav>

        <div className="mx-3 mb-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">当前项目</p>
          <p className="mt-1 font-[Plus_Jakarta_Sans] text-[15px] font-semibold text-slate-700">{MOCK_PROJECT.name}</p>
          <p className="mt-0.5 text-[13px] text-slate-400">{frames.length} 帧 · {totalDuration.toFixed(1)}s</p>
        </div>

        <div className="border-t border-slate-100 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User size={16} />
            </div>
            <div>
              <p className="font-[Plus_Jakarta_Sans] text-[14px] font-semibold text-slate-700">用户</p>
              <p className="text-[12px] text-slate-400">免费版</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <h1 className="font-[Plus_Jakarta_Sans] text-[16px] font-bold text-slate-800">{MOCK_PROJECT.name}</h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[12px] font-medium text-blue-600">
              {MOCK_PROJECT.platform === 'douyin' ? '抖音' : MOCK_PROJECT.platform}
            </span>
            <span className="text-[12px] text-slate-400">{frames.length} 帧 · {totalDuration.toFixed(1)}s</span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm">
              <Film size={16} /> 生成视频
            </button>
            <button onClick={() => navigate(`/project/${MOCK_PROJECT.id}/export`)}
               className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-[14px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md">
              <Download size={16} /> 导出
            </button>
          </div>
        </header>

        {/* Content area: frame strip + detail */}
        <div className="flex flex-1 overflow-hidden">

          {/* Frame strip */}
          <div className="w-[280px] shrink-0 border-r border-slate-100 bg-white/60">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-[Plus_Jakarta_Sans] text-[14px] font-semibold text-slate-600">分镜列表</span>
              <button onClick={addFrame} className="flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[12px] font-semibold text-blue-600 transition-all hover:bg-blue-100">
                <Plus size={14} /> 添加
              </button>
            </div>
            <div className="flex-1 space-y-1.5 overflow-y-auto px-3 pb-4" style={{ maxHeight: 'calc(100vh - 140px)' }}>
              {frames.map((frame, i) => {
                const isSelected = frame.id === selectedId
                const colorCls = LABEL_COLORS[frame.frameLabel] || 'bg-slate-100 text-slate-500'
                return (
                  <button key={frame.id} onClick={() => setSelectedId(frame.id)}
                    className={`group relative flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected ? 'border-blue-200 bg-white shadow-sm shadow-blue-100/50' : 'border-transparent bg-white/80 hover:bg-white hover:shadow-sm'
                    }`}>
                    {/* Selection indicator */}
                    {isSelected && <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-blue-500" />}

                    {/* Frame number */}
                    <div className="flex h-16 w-7 shrink-0 flex-col items-center justify-center">
                      <span className={`font-[Plus_Jakarta_Sans] text-[16px] font-bold ${isSelected ? 'text-blue-500' : 'text-slate-300'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Thumbnail */}
                    <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                      {frame.imageUrl ? (
                        <img src={frame.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : frame.imageStatus === 'generating' ? (
                        <Loader2 size={14} className="animate-spin text-slate-400" />
                      ) : (
                        <ImageIcon size={14} className="text-slate-300" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${colorCls}`}>
                          {LABEL_TEXT[frame.frameLabel] || frame.frameLabel}
                        </span>
                        <span className="text-[12px] text-slate-400">{frame.duration}s</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-slate-600">
                        {frame.screenText || frame.content}
                      </p>
                    </div>

                    {/* Actions on hover/select */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 flex flex-col gap-0.5">
                        {i > 0 && (
                          <button onClick={e => { e.stopPropagation(); moveFrame(frame.id, -1) }}
                                  className="rounded-md p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500">
                            <ChevronUp size={12} />
                          </button>
                        )}
                        {i < frames.length - 1 && (
                          <button onClick={e => { e.stopPropagation(); moveFrame(frame.id, 1) }}
                                  className="rounded-md p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500">
                            <ChevronDown size={12} />
                          </button>
                        )}
                        {frames.length > 1 && (
                          <button onClick={e => { e.stopPropagation(); deleteFrame(frame.id) }}
                                  className="rounded-md p-1 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-400">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}

              {/* Add frame hint */}
              <button onClick={addFrame}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-200 py-3 text-[12px] text-slate-400 transition-all hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-500">
                <Plus size={14} /> 添加新帧
              </button>
            </div>
          </div>

          {/* Detail / Generation panel */}
          <div className="flex flex-1 flex-col bg-[#f8fafc]">
            {selectedFrame ? (
              <FrameDetailPanel
                frame={selectedFrame}
                frameIndex={selectedIndex}
                totalFrames={frames.length}
                onUpdate={updateFrame}
                onRegenerateImage={regenerateImage}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <ImageIcon size={32} className="text-slate-200" />
                <p className="text-[15px] text-slate-400">选择一帧开始编辑</p>
                <p className="text-[12px] text-slate-300">使用键盘 ↑↓ 快速切换</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon: Icon, label, active, href }: { icon: React.ElementType; label: string; active?: boolean; href?: string }) {
  const cls = `flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-medium transition-all ${
    active ? 'bg-blue-50 font-semibold text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
  }`
  if (href) return <a href={href} className={cls}><Icon size={18} />{label}</a>
  return <button className={cls}><Icon size={18} />{label}</button>
}