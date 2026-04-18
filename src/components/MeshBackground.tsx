import React from 'react'

export default function MeshBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f8fafc]">
      {/* Primary warm blob */}
      <div className="pointer-events-none absolute -top-[20%] -left-[10%] h-[60%] w-[50%] rounded-full bg-blue-100 opacity-60 blur-[160px]" />
      {/* Secondary cool blob */}
      <div className="pointer-events-none absolute -right-[8%] -bottom-[10%] h-[50%] w-[45%] rounded-full bg-sky-100 opacity-50 blur-[140px]" />
      {/* Accent highlight */}
      <div className="pointer-events-none absolute top-[25%] right-[15%] h-[25%] w-[25%] rounded-full bg-indigo-50 opacity-50 blur-[120px]" />
      {/* Subtle warm accent */}
      <div className="pointer-events-none absolute bottom-[20%] left-[20%] h-[20%] w-[20%] rounded-full bg-violet-50 opacity-30 blur-[100px]" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
