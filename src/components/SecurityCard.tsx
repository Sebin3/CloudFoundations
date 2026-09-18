import type { SecurityCheck, StatusTone } from '../types/cloud'
import { Icon } from './Icon'

type SecurityCardProps = {
  check: SecurityCheck
  selected?: boolean
  onSelect?: () => void
}

const styles: Record<StatusTone, { badge: string; icon: string; border: string; label: string }> = {
  success: { badge: 'bg-emerald-50 text-emerald-700', icon: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200', label: 'Correcto' },
  warning: { badge: 'bg-amber-50 text-amber-700', icon: 'bg-amber-50 text-amber-600', border: 'border-amber-200', label: 'Revisión' },
  danger: { badge: 'bg-red-50 text-red-700', icon: 'bg-red-50 text-red-600', border: 'border-red-200', label: 'Problema' },
  info: { badge: 'bg-blue-50 text-blue-700', icon: 'bg-blue-50 text-blue-600', border: 'border-blue-200', label: 'Informativo' },
  neutral: { badge: 'bg-slate-100 text-slate-600', icon: 'bg-slate-100 text-slate-500', border: 'border-slate-200', label: 'Pendiente' },
}

export function SecurityCard({ check, selected = false, onSelect }: SecurityCardProps) {
  const tone = styles[check.tone]
  return (
    <button type="button" onClick={onSelect} aria-pressed={selected} className={`min-w-0 rounded-2xl border bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:shadow-md ${selected ? `${tone.border} ring-2 ring-blue-100` : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-3"><div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}><Icon name={check.icon} className="text-[19px]" /></div><Icon name={selected ? 'radio_button_checked' : 'radio_button_unchecked'} className={`text-[17px] ${selected ? 'text-blue-600' : 'text-slate-300'}`} /></div>
      <div className="mt-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${tone.badge}`}><span className="size-1.5 rounded-full bg-current opacity-70" />{tone.label}</span><h4 className="mt-3 line-clamp-2 text-sm font-bold leading-5 text-slate-800">{check.label}</h4><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{check.detail}</p></div>
    </button>
  )
}
