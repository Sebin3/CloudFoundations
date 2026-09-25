import type { StatusTone } from '../types/cloud'
import { Icon } from './Icon'

type CostCardProps = {
  label: string
  value: string
  detail: string
  icon: string
  tone?: Extract<StatusTone, 'success' | 'warning' | 'info'>
  featured?: boolean
  progress?: number
}

const toneClasses = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  info: 'bg-blue-50 text-blue-600',
}

export function CostCard({ label, value, detail, icon, tone = 'info', featured = false, progress }: CostCardProps) {
  if (featured) {
    return (
      <article className="h-full min-h-[148px] overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white p-5 text-slate-800 shadow-[0_8px_24px_rgba(37,99,235,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-blue-700">{label}</p><strong className="mt-3 block text-3xl font-extrabold tracking-[-0.05em] text-slate-900">{value}</strong><p className="mt-1 text-xs text-slate-500">{detail}</p></div>
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm"><Icon name={icon} className="text-[22px]" /></div>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-blue-100 pt-4 text-[11px] font-bold text-blue-700"><span className="size-2 rounded-full bg-blue-500" />Estimación actualizada</div>
      </article>
    )
  }

  return (
    <article className="h-full min-h-[148px] rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_26px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-400">{label}</p><strong className="mt-3 block text-2xl font-extrabold tracking-[-0.04em] text-slate-800">{value}</strong><p className="mt-1 text-xs text-slate-500">{detail}</p></div>
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}><Icon name={icon} className="text-[20px]" /></div>
      </div>
      {progress !== undefined && <div className="mt-4"><div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-slate-400"><span>Uso del presupuesto</span><span className="text-slate-600">{Math.max(0, Math.round(progress))}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${progress <= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} /></div></div>}
    </article>
  )
}
