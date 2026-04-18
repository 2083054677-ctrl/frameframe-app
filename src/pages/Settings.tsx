import { useState } from 'react'
import { Save, Check, Eye, EyeOff } from 'lucide-react'
import AppShell from '../components/AppShell'
import { getConfig, saveConfig, type APIConfig } from '../lib/config'

export default function Settings() {
  const [config, setConfig] = useState<APIConfig>(getConfig())
  const [saved, setSaved] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const update = (section: keyof APIConfig, field: string, value: string) => {
    setConfig(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))
    setSaved(false)
  }

  const handleSave = () => {
    saveConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputCls = "w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-[Inter] text-[13px] text-slate-700 outline-none transition-all focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"

  const Section = ({ id, title, desc }: { id: keyof APIConfig; title: string; desc: string }) => (
    <div className="rounded-2xl border border-slate-100 bg-white/85 p-5 shadow-sm transition-all hover:shadow-md">
      <h3 className="font-[Plus_Jakarta_Sans] text-[14px] font-bold text-slate-700">{title}</h3>
      <p className="mt-0.5 mb-4 font-[Inter] text-[12px] text-slate-400">{desc}</p>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block font-[Plus_Jakarta_Sans] text-[11px] font-semibold text-slate-500">Base URL</label>
          <input type="text" value={config[id].baseUrl} onChange={e => update(id, 'baseUrl', e.target.value)}
                 placeholder="https://api.openai.com/v1" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block font-[Plus_Jakarta_Sans] text-[11px] font-semibold text-slate-500">API Key</label>
          <div className="relative">
            <input type={showKeys[id] ? 'text' : 'password'} value={config[id].apiKey}
                   onChange={e => update(id, 'apiKey', e.target.value)} placeholder="sk-..."
                   className={inputCls + ' pr-9'} />
            <button onClick={() => setShowKeys(p => ({ ...p, [id]: !p[id] }))} type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
              {showKeys[id] ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block font-[Plus_Jakarta_Sans] text-[11px] font-semibold text-slate-500">Model</label>
          <input type="text" value={config[id].model} onChange={e => update(id, 'model', e.target.value)}
                 placeholder="gpt-4o" className={inputCls} />
        </div>
      </div>
    </div>
  )

  return (
    <AppShell title="API 设置" backHref="/">
      <div className="mx-auto max-w-xl px-6 py-8">
        <h1 className="font-[Plus_Jakarta_Sans] text-2xl font-bold text-slate-800">API 配置</h1>
        <p className="mt-1 mb-6 font-[Inter] text-[13px] text-slate-500">
          Key 只存在本地浏览器，不经过任何服务器。
        </p>

        <div className="space-y-3">
          <Section id="llm" title="LLM — 脚本生成" desc="OpenAI / Claude / Deepseek 兼容接口" />
          <Section id="image" title="Image — 图片生成" desc="ChatFire nonobanana2 / OpenAI gpt-image-1" />
          <Section id="video" title="Video — 视频生成" desc="豆包 Seedance 2.0 / Kling / Runway" />
        </div>

        <button onClick={handleSave}
                className="mt-6 flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md">
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? '已保存' : '保存配置'}
        </button>
      </div>
    </AppShell>
  )
}
