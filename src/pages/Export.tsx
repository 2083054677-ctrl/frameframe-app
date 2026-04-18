import { useState } from 'react'
import { Download, FileText, Image as ImageIcon, Film, Copy, Check, CheckCircle2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { getProject } from '../lib/store'
import { PLATFORMS } from '../lib/constants'
import { MOCK_PROJECT } from '../data/mock'

export default function Export() {
  const { id } = useParams<{ id: string }>()
  const project = (id ? getProject(id) : null) ?? MOCK_PROJECT
  const [copied, setCopied] = useState(false)

  const copyScript = () => {
    const script = project.frames.map((f, i) =>
      `【镜头 ${i + 1}】${f.duration}s | ${f.shotType} | ${f.cameraMovement}\n画面：${f.content}\n文案：${f.screenText || '—'}\n旁白：${f.voiceover || '—'}`
    ).join('\n\n')
    navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasImages = project.frames.some(f => f.imageUrl)
  const platformLabel = PLATFORMS.find(p => p.id === project.platform)?.label ?? project.platform

  const exports = [
    { icon: Film, label: '视频 MP4', desc: '完整短视频成片', action: '下载视频', ready: false, primary: true },
    { icon: ImageIcon, label: '分镜图包', desc: `${project.frames.length} 张参考图`, action: '下载图包', ready: hasImages, primary: false },
    { icon: FileText, label: '脚本文档', desc: '完整拍摄脚本', action: '下载脚本', ready: true, primary: false },
  ]

  return (
    <AppShell title="导出" backHref={`/project/${project.id}`}>
      <div className="mx-auto max-w-xl px-6 py-8">

        {/* Success header */}
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-500" />
          <div>
            <p className="font-[Plus_Jakarta_Sans] text-[14px] font-bold text-emerald-700">分镜方案已就绪</p>
            <p className="mt-0.5 text-[12px] text-emerald-500">
              {project.frames.length} 帧 · {project.duration}s · {platformLabel}
            </p>
          </div>
        </div>

        <h1 className="font-[Plus_Jakarta_Sans] text-2xl font-bold text-slate-800">{project.name}</h1>
        <p className="mt-1 font-[Inter] text-[13px] text-slate-500">选择导出格式</p>

        <div className="mt-6 space-y-2">
          {exports.map(exp => (
            <div key={exp.label} className={`flex items-center justify-between rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md ${
              exp.primary ? 'border-blue-100 bg-blue-50/30' : 'border-slate-100 bg-white/80'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  exp.primary ? 'bg-blue-100' : 'bg-slate-100'
                }`}>
                  <exp.icon size={18} className={exp.primary ? 'text-blue-500' : 'text-slate-500'} />
                </div>
                <div>
                  <p className="font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">{exp.label}</p>
                  <p className="font-[Inter] text-[11px] text-slate-400">{exp.desc}</p>
                </div>
              </div>
              <button disabled={!exp.ready}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-[Plus_Jakarta_Sans] text-[11px] font-semibold transition-all disabled:opacity-25 ${
                        exp.primary
                          ? 'border-blue-200 bg-blue-600 text-white hover:bg-blue-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}>
                <Download size={12} /> {exp.ready ? exp.action : '生成中...'}
              </button>
            </div>
          ))}
        </div>
        <button onClick={copyScript}
                className="mt-6 flex items-center gap-1.5 font-[Plus_Jakarta_Sans] text-[12px] font-semibold text-blue-500 transition-colors hover:text-blue-600">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? '已复制' : '一键复制脚本'}
        </button>

        {/* Script preview */}
        <div className="mt-4 rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm">
          <p className="mb-3 font-[Plus_Jakarta_Sans] text-[10px] font-semibold uppercase tracking-wider text-slate-400">脚本预览</p>
          <div className="space-y-3">
            {project.frames.map((f, i) => (
              <div key={f.id} className="border-l-2 border-slate-200 pl-3">
                <p className="font-[Plus_Jakarta_Sans] text-[11px] font-semibold text-slate-600">
                  镜头 {i + 1} · {f.duration}s · {f.shotType}
                </p>
                <p className="mt-0.5 font-[Inter] text-[12px] leading-relaxed text-slate-500">{f.content}</p>
                {f.screenText && (
                <p className="mt-0.5 font-[Inter] text-[12px] text-blue-500">「{f.screenText}」</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}