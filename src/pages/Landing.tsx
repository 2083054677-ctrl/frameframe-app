import { useState } from 'react'
import { ArrowUp, Sparkles, Film, Zap, Palette } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MeshBackground from '../components/MeshBackground'

const EXAMPLES = [
  { icon: Film, label: '产品展示', desc: '突出产品外观与细节', query: '做一个产品展示类型的短视频广告' },
  { icon: Zap, label: '痛点解决', desc: '先戳痛点再给方案', query: '做一个痛点解决类型的短视频广告' },
  { icon: Palette, label: '使用场景', desc: '真实场景中展示产品', query: '做一个使用场景类型的短视频广告' },
]

export default function Landing() {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    navigate(`/new?q=${encodeURIComponent(input.trim())}`)
  }

  const handleExample = (query: string) => {
    navigate(`/new?q=${encodeURIComponent(query)}`)
  }

  return (
    <MeshBackground>
      <Navbar />

      <main className="flex min-h-[calc(100svh-80px)] flex-col items-center justify-center px-6 pb-24">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/80 px-3 py-1 backdrop-blur-sm">
          <Sparkles size={12} className="text-blue-500" />
          <span className="font-[Inter] text-[11px] font-medium text-blue-600">AI 驱动的视频分镜工具</span>
        </div>

        <h1 className="mb-3 text-center font-[Plus_Jakarta_Sans] text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-[1.12] tracking-tight text-slate-900">
          定义一个好视频，
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">只需要几帧</span>
        </h1>
        <p className="mb-10 max-w-md text-center font-[Inter] text-[15px] leading-relaxed text-slate-500">
          描述你的产品或广告需求，AI 帮你生成分镜和脚本
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className={`rounded-2xl border bg-white/90 p-2 shadow-lg backdrop-blur-xl transition-all duration-300 ${
            focused ? 'border-blue-200 shadow-blue-500/10' : 'border-white/60 shadow-slate-200/50'
          }`}>
            <div className="flex items-center px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder='例如："给一款便携榨汁杯做 15 秒抖音广告"'
                className="flex-1 bg-transparent font-[Inter] text-[14px] text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="shrink-0 rounded-xl bg-blue-600 p-2.5 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:opacity-30 disabled:shadow-none"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </form>

        {/* Example cards */}
        <div className="mt-8 grid w-full max-w-lg grid-cols-3 gap-3">
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => handleExample(ex.query)}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white/70 p-4 text-center backdrop-blur-sm transition-all hover:border-blue-200 hover:bg-white hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-100">
                <ex.icon size={18} />
              </div>
              <span className="font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-slate-700">{ex.label}</span>
              <span className="font-[Inter] text-[11px] leading-snug text-slate-400">{ex.desc}</span>
            </button>
          ))}
        </div>
      </main>

      <footer className="px-6 py-4">
        <p className="text-center font-[Plus_Jakarta_Sans] text-[11px] text-slate-400">
          &copy; 2026 帧帧 FrameFrame
        </p>
      </footer>
    </MeshBackground>
  )
}
