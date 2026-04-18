import { Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="px-6 py-5">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link to="/" className="font-[Plus_Jakarta_Sans] text-[16px] font-bold tracking-tight text-slate-800">
          帧帧
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/settings" className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600">
            <Settings size={18} />
          </Link>
          <Link to="/new"
             className="rounded-xl bg-blue-600 px-4 py-2 font-[Plus_Jakarta_Sans] text-[13px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            新建项目
          </Link>
        </div>
      </div>
    </nav>
  )
}
