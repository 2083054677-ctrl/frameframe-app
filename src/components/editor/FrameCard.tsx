import { ImageIcon, Loader2 } from 'lucide-react'
import type { Frame } from '../../types'

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

interface FrameCardProps {
  frame: Frame
  isSelected: boolean
  onClick: () => void
}

export default function FrameCard({ frame, isSelected, onClick }: FrameCardProps) {
  const colorCls = LABEL_COLORS[frame.frameLabel] || 'bg-slate-100 text-slate-500'

  return (
    <button
      onClick={onClick}
      className={`group flex w-full flex-col rounded-2xl border p-2 text-left transition-all ${
        isSelected
          ? 'border-blue-200 bg-white shadow-sm shadow-blue-100/50'
          : 'border-slate-100 bg-white/60 hover:bg-white/80 hover:shadow-sm'
      }`}
    >
      <div className="relative mb-2 flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100">
        {frame.imageUrl ? (
          <img src={frame.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : frame.imageStatus === 'generating' ? (
          <Loader2 size={16} className="animate-spin text-slate-400" />
        ) : (
          <ImageIcon size={16} className="text-slate-300" />
        )}
        <span className="absolute bottom-1 right-1 rounded-md bg-black/50 px-1.5 py-0.5 font-[Plus_Jakarta_Sans] text-[9px] font-semibold text-white">
          {frame.duration}s
        </span>
      </div>

      <span className={`mb-1 inline-block self-start rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${colorCls}`}>
        {LABEL_TEXT[frame.frameLabel] || frame.frameLabel}
      </span>

      <p className="line-clamp-2 font-[Inter] text-[11px] leading-tight text-slate-500">
        {frame.screenText || frame.content}
      </p>
    </button>
  )
}
