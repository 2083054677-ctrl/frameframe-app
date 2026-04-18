import { useState } from 'react'
import { RefreshCw, ImageIcon, Loader2, ChevronDown, Sparkles } from 'lucide-react'
import { LABEL_DESCRIPTIONS, SHOT_TYPES, CAMERA_MOVES, TRANSITIONS } from '../../lib/constants'
import type { Frame } from '../../types'

interface Props {
  frame: Frame
  frameIndex: number
  totalFrames: number
  onUpdate: (id: string, updates: Partial<Frame>) => void
  onRegenerateImage: (id: string) => void
}

export default function FrameDetailPanel({ frame, frameIndex, totalFrames, onUpdate, onRegenerateImage }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
  const selectCls = inputCls

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mb-5">
      <label className="mb-1.5 block font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  )

  return (
    <div className="flex h-full">
      {/* Left: Image preview */}
      <div className="flex w-[360px] shrink-0 flex-col items-center border-r border-slate-100 bg-white p-6">
        <div className="mb-3 w-full">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-[Plus_Jakarta_Sans] text-[12px] font-bold text-slate-500">
              {String(frameIndex + 1).padStart(2, '0')} / {String(totalFrames).padStart(2, '0')}
            </span>
            <p className="font-[Plus_Jakarta_Sans] text-[11px] font-semibold uppercase tracking-wider text-slate-400">这一帧的作用</p>
          </div>
          <p className="mt-1 font-[Plus_Jakarta_Sans] text-[15px] font-semibold text-slate-700">
            {LABEL_DESCRIPTIONS[frame.frameLabel] || frame.frameLabel}
          </p>
        </div>

        <div className="relative mb-4 flex aspect-[9/16] w-full max-h-[380px] items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
          {frame.imageUrl ? (
            <img src={frame.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : frame.imageStatus === 'generating' ? (
            <Loader2 size={24} className="animate-spin text-slate-400" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <ImageIcon size={32} />
              <span className="text-[13px]">等待生成</span>
            </div>
          )}
        </div>

        <div className="flex w-full gap-2">
          <button onClick={() => onRegenerateImage(frame.id)}
                  disabled={frame.imageStatus === 'generating'}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-[13px] font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm disabled:opacity-30">
            <RefreshCw size={14} /> 重新生成
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-30">
            <Sparkles size={14} /> AI 优化
          </button>
        </div>
      </div>

      {/* Right: Edit fields */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="mb-5 font-[Plus_Jakarta_Sans] text-[16px] font-bold text-slate-800">编辑内容</h3>

        <Field label="屏幕文案">
          <input type="text" value={frame.screenText || ''} onChange={e => onUpdate(frame.id, { screenText: e.target.value })} className={inputCls} placeholder="画面上显示的文字" />
        </Field>
        <Field label="画面内容">
          <textarea value={frame.content} rows={3} onChange={e => onUpdate(frame.id, { content: e.target.value })} className={inputCls + ' resize-none'} placeholder="描述这一帧的画面" />
        </Field>
        <Field label="旁白">
          <input type="text" value={frame.voiceover || ''} onChange={e => onUpdate(frame.id, { voiceover: e.target.value || null })} className={inputCls} placeholder="画外音文案" />
        </Field>

        <button onClick={() => setShowAdvanced(!showAdvanced)}
                className="mb-4 flex items-center gap-1.5 font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-400 transition-colors hover:text-slate-600">
          <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          高级设置
        </button>

        {showAdvanced && (
          <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="时长（秒）">
                <input type="number" step="0.5" min="0.5" max="10" value={frame.duration}
                       onChange={e => onUpdate(frame.id, { duration: parseFloat(e.target.value) || 2 })} className={inputCls} />
              </Field>
              <Field label="景别">
                <select value={frame.shotType} onChange={e => onUpdate(frame.id, { shotType: e.target.value })} className={selectCls}>
                  {SHOT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="运镜">
                <select value={frame.cameraMovement} onChange={e => onUpdate(frame.id, { cameraMovement: e.target.value })} className={selectCls}>
                  {CAMERA_MOVES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="转场">
                <select value={frame.transition} onChange={e => onUpdate(frame.id, { transition: e.target.value })} className={selectCls}>
                  {TRANSITIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <Field label="动作">
              <input type="text" value={frame.action} onChange={e => onUpdate(frame.id, { action: e.target.value })} className={inputCls} placeholder="角色/物体的动作" />
            </Field>
            <Field label="音效">
              <input type="text" value={frame.soundEffect || ''} onChange={e => onUpdate(frame.id, { soundEffect: e.target.value || null })} className={inputCls} placeholder="背景音效描述" />
            </Field>
          </div>
        )}
      </div>
    </div>
  )
}
