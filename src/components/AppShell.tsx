import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import MeshBackground from './MeshBackground'

interface AppShellProps {
  children: React.ReactNode
  title?: string
  backHref?: string
}

export default function AppShell({ children, title, backHref }: AppShellProps) {
  return (
    <MeshBackground>
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-3">
          {backHref && (
            <Link to={backHref} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/60 hover:text-slate-600">
              <ArrowLeft size={16} />
            </Link>
          )}
          <span className="font-[Plus_Jakarta_Sans] text-[14px] font-semibold text-slate-700">
            {title || '帧帧'}
          </span>
        </div>
      </header>
      <main>{children}</main>
    </MeshBackground>
  )
}
