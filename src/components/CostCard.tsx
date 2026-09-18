import type { StatusTone } from '../types/cloud'
import { Icon } from './Icon'

type CostCardProps = {
  label: string
  value: string
  detail: string
  icon: string
  tone?: Extract<StatusTone, 'success' | 'warning' | 'info'>
  featured?: boolean
}

const toneClasses = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  info: 'bg-blue-50 text-blue-600',
}

export function CostCard({ label, value, detail, icon, tone = 'info', featured = false }: CostCardProps) {
  if (featured) {
    return (
      <article className="overflow-hidden rounded-2xl border border-blue-700 bg-gradient-to-br from-slate-900 via-blue-950 to-blue-800 p-5 text-white shadow-[0_12px_30px_rgba(30,64,175,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-blue-200">{label}</p><strong className="mt-3 block text-3xl font-extrabold tracking-[-0.05em]">{value}</strong><p className="mt-1 text-xs text-blue-200">{detail}</p></div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-100"><Icon name={icon} className="text-[22px]" /></div>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-[11px] font-bold text-emerald-300"><span className="size-2 rounded-full bg-emerald-400" />Estimación actualizada</div>
      </article>
    )
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_26px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-400">{label}</p><strong className="mt-3 block text-2xl font-extrabold tracking-[-0.04em] text-slate-800">{value}</strong><p className="mt-1 text-xs text-slate-500">{detail}</p></div>
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}><Icon name={icon} className="text-[20px]" /></div>
      </div>
    </article>
  )
}
