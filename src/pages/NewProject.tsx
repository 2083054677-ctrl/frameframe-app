import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, Plus, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'

const STYLES = [
  { id: 'product-showcase', label: '产品展示', desc: '突出外观与细节' },
  { id: 'use-scene', label: '使用场景', desc: '真实场景演示' },
  { id: 'pain-point', label: '痛点解决', desc: '先戳痛点再给方案' },
]
const DURATIONS = [
  { value: 4, label: '4s', desc: '超短' },
  { value: 8, label: '8s', desc: '标准' },
  { value: 15, label: '15s', desc: '完整' },
]
const PLATFORMS = [
  { id: 'douyin', label: '抖音' },
  { id: 'xiaohongshu', label: '小红书' },
  { id: 'kuaishou', label: '快手' },
  { id: 'taobao', label: '淘宝主图' },
]

const TOTAL_STEPS = 3

export default function NewProject() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const [name, setName] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Step 2
  const [points, setPoints] = useState<string[]>([''])
  const [style, setStyle] = useState('product-showcase')
  const [duration, setDuration] = useState(8)
  const [platform, setPlatform] = useState<string | null>(null)

  // Prefill from Landing query (run once)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setName(q)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const addImages = useCallback((files: FileList | null) => {
    if (!files) return
    const newImgs = Array.from(files).slice(0, 5 - images.length).map(f => ({
      file: f, preview: URL.createObjectURL(f),
    }))
    setImages(prev => [...prev, ...newImgs].slice(0, 5))
  }, [images.length])

  const removeImage = (i: number) => {
    setImages(prev => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i) })
  }
  const updatePoint = (i: number, v: string) => setPoints(prev => prev.map((p, idx) => idx === i ? v : p))
  const addPoint = () => { if (points.length < 5) setPoints(prev => [...prev, '']) }
  const removePoint = (i: number) => { if (points.length > 1) setPoints(prev => prev.filter((_, idx) => idx !== i)) }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false); addImages(e.dataTransfer.files)
  }, [addImages])

  const canNext1 = name.trim().length > 0
  const canNext2 = true // step 2 has sensible defaults
  const canSubmit = canNext1

  const inputCls = "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 font-[Inter] text-[14px] text-slate-700 outline-none transition-all focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"

  const Chip = ({ active, onClick, children, sub }: { active: boolean; onClick: () => void; children: React.ReactNode; sub?: string }) => (
    <button onClick={onClick}
            className={`flex flex-col items-start rounded-xl border px-4 py-2.5 text-left transition-all ${
              active
                ? 'border-blue-200 bg-blue-50 shadow-sm'
                : 'border-slate-200 bg-white/60 hover:border-blue-100 hover:bg-white'
            }`}>
      <span className={`font-[Plus_Jakarta_Sans] text-[13px] font-medium ${active ? 'text-blue-600' : 'text-slate-600'}`}>{children}</span>
      {sub && <span className={`text-[11px] ${active ? 'text-blue-400' : 'text-slate-400'}`}>{sub}</span>}
    </button>
  )

  return (
    <AppShell title="新建项目" backHref="/">
      <div className="mx-auto max-w-xl px-6 py-8">

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const s = i + 1
            const isActive = s === step
            const isDone = s < step
            return (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all ${
                  isDone ? 'bg-blue-600 text-white' : isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isDone ? <Check size={14} /> : s}
                </div>
                <span className={`font-[Plus_Jakarta_Sans] text-[13px] font-medium ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>
                  {s === 1 ? '基本信息' : s === 2 ? '创意设置' : '确认生成'}
                </span>
                {s < TOTAL_STEPS && <div className={`mx-2 h-px w-8 ${s < step ? 'bg-blue-300' : 'bg-slate-200'}`} />}
              </div>
            )
          })}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <section>
              <label className="mb-1.5 block font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">产品名称</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                     placeholder="例如：便携榨汁杯" className={inputCls} autoFocus />
            </section>

            <section>
              <label className="mb-2 block font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">
                商品图 <span className="text-slate-400">（最多 5 张，可选）</span>
              </label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex min-h-[100px] flex-wrap items-start gap-2 rounded-2xl border p-3 backdrop-blur-sm transition-all ${
                  dragOver ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-white/60'
                }`}
              >
                {images.map((img, i) => (
                  <div key={i} className="group relative h-20 w-20 overflow-hidden rounded-xl">
                    <img src={img.preview} alt="" className="h-full w-full object-cover" />
                    <button onClick={() => removeImage(i)}
                            className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button onClick={() => fileRef.current?.click()}
                          className="flex h-20 w-20 flex-col items-center justify-center gap-0.5 rounded-xl border border-dashed border-slate-300 text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-500">
                    <Upload size={16} />
                    <span className="text-[10px]">上传</span>
                  </button>
                )}
                {images.length === 0 && (
                  <p className="flex-1 self-center text-center font-[Inter] text-[12px] text-slate-400">
                    拖拽图片到这里，或点击上传
                  </p>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => addImages(e.target.files)} />
            </section>
          </div>
        )}

        {/* Step 2: Creative Settings */}
        {step === 2 && (
          <div className="space-y-6">
            <section>
              <label className="mb-1.5 block font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">核心卖点</label>
              <div className="space-y-1.5">
                {points.map((p, i) => (
                  <div key={i} className="flex gap-1.5">
                    <input type="text" value={p} onChange={e => updatePoint(i, e.target.value)}
                           placeholder={`卖点 ${i + 1}`} className={inputCls + ' flex-1'} />
                    {points.length > 1 && (
                      <button onClick={() => removePoint(i)} className="rounded-lg p-2 text-slate-400 hover:bg-white/50 hover:text-slate-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {points.length < 5 && (
                <button onClick={addPoint} className="mt-1.5 inline-flex items-center gap-1 font-[Plus_Jakarta_Sans] text-[11px] font-semibold text-blue-500 hover:text-blue-600">
                  <Plus size={12} /> 添加卖点
                </button>
              )}
            </section>

            <section>
              <label className="mb-2 block font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">广告风格</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map(s => <Chip key={s.id} active={style === s.id} onClick={() => setStyle(s.id)} sub={s.desc}>{s.label}</Chip>)}
              </div>
            </section>

            <div className="flex gap-8">
              <section>
                <label className="mb-2 block font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">时长</label>
                <div className="flex gap-1.5">
                  {DURATIONS.map(d => <Chip key={d.value} active={duration === d.value} onClick={() => setDuration(d.value)} sub={d.desc}>{d.label}</Chip>)}
                </div>
              </section>
              <section>
                <label className="mb-2 block font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">
                  平台 <span className="text-slate-400">（可选）</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORMS.map(p => <Chip key={p.id} active={platform === p.id} onClick={() => setPlatform(platform === p.id ? null : p.id)}>{p.label}</Chip>)}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Generate */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white/80 p-5">
              <p className="mb-3 font-[Plus_Jakarta_Sans] text-[11px] font-semibold uppercase tracking-wider text-slate-400">项目摘要</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-500">产品名称</span>
                  <span className="font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">{name}</span>
                </div>
                {images.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">商品图</span>
                    <div className="flex -space-x-2">
                      {images.map((img, i) => (
                        <img key={i} src={img.preview} alt="" className="h-8 w-8 rounded-lg border-2 border-white object-cover" />
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-500">广告风格</span>
                  <span className="font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">{STYLES.find(s => s.id === style)?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-slate-500">时长</span>
                  <span className="font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">{duration}s</span>
                </div>
                {platform && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">平台</span>
                    <span className="font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">{PLATFORMS.find(p => p.id === platform)?.label}</span>
                  </div>
                )}
                {points.filter(p => p.trim()).length > 0 && (
                  <div>
                    <span className="text-[13px] text-slate-500">核心卖点</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {points.filter(p => p.trim()).map((p, i) => (
                        <span key={i} className="rounded-lg bg-blue-50 px-2 py-0.5 text-[12px] font-medium text-blue-600">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-blue-500" />
                <div>
                  <p className="font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-blue-700">AI 将为你生成</p>
                  <p className="mt-0.5 text-[12px] text-blue-500">完整分镜脚本 + 每帧参考图 + 拍摄指导</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-600 transition-all hover:bg-slate-50">
              <ArrowLeft size={14} /> 上一步
            </button>
          ) : <div />}

          {step < TOTAL_STEPS ? (
            <button onClick={() => setStep(step + 1)}
                    disabled={step === 1 && !canNext1}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:opacity-25 disabled:shadow-none">
              下一步 <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={() => canSubmit && navigate('/project/demo')}
                    disabled={!canSubmit}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-[Plus_Jakarta_Sans] text-[14px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg disabled:opacity-25 disabled:shadow-none">
              <Sparkles size={15} /> 生成分镜方案
            </button>
          )}
        </div>

      </div>
    </AppShell>
  )
}