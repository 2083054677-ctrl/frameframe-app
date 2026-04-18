import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import MeshBackground from '../components/MeshBackground'

type AuthMode = 'phone' | 'email'

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('phone')
  const [value, setValue] = useState('')
  const [code, setCode] = useState('')
  const [countdown, setCountdown] = useState(0)

  const sendCode = () => {
    if (!value.trim()) return
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = '/new'
  }

  const inputCls = "w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 font-[Inter] text-[14px] text-slate-700 outline-none transition-all focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"

  return (
    <MeshBackground>
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-white/60 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          <a href="/" className="mb-8 block font-[Plus_Jakarta_Sans] text-[16px] font-bold text-slate-800">
            帧帧
          </a>

          <h1 className="font-[Plus_Jakarta_Sans] text-2xl font-bold text-slate-900">登录</h1>
          <p className="mt-1 font-[Inter] text-[13px] text-slate-500">
            输入手机号或邮箱，验证码登录
          </p>

          <div className="mt-6 flex rounded-xl bg-slate-100/80 p-1">
            {(['phone', 'email'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setValue(''); setCode('') }}
                className={`flex-1 rounded-lg py-2 font-[Plus_Jakarta_Sans] text-[12px] font-semibold transition-all ${
                  mode === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-500'
                }`}
              >
                {m === 'phone' ? '手机号' : '邮箱'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              type={mode === 'phone' ? 'tel' : 'email'}
              placeholder={mode === 'phone' ? '手机号' : '邮箱地址'}
              value={value}
              onChange={e => setValue(e.target.value)}
              className={inputCls}
            />

            <div className="flex gap-2">
              <input
                type="text" inputMode="numeric" maxLength={6}
                placeholder="验证码" value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                className={inputCls + ' flex-1'}
              />
              <button type="button" onClick={sendCode}
                      disabled={!value.trim() || countdown > 0}
                      className="shrink-0 rounded-xl bg-slate-100 px-4 py-3 font-[Plus_Jakarta_Sans] text-[12px] font-semibold text-slate-600 transition-all hover:bg-slate-200 disabled:opacity-30">
                {countdown > 0 ? `${countdown}s` : '发送'}
              </button>
            </div>

            <button type="submit" disabled={!code || code.length < 4}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:opacity-25 disabled:shadow-none">
              登录 <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </MeshBackground>
  )
}
