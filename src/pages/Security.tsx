import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { SecurityCard } from '../components/SecurityCard'
import { securityChecks } from '../data/cloudData'

type SecurityFilter = 'Todos' | 'Correcto' | 'Revisión' | 'Problema'

const statusStyles = {
  success: { badge: 'bg-emerald-50 text-emerald-700', icon: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500', border: 'border-emerald-200', label: 'Correcto' },
  warning: { badge: 'bg-amber-50 text-amber-700', icon: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500', border: 'border-amber-200', label: 'Revisión' },
  danger: { badge: 'bg-red-50 text-red-700', icon: 'bg-red-50 text-red-600', dot: 'bg-red-500', border: 'border-red-200', label: 'Problema' },
} as const

const securityDetails: Record<string, { scope: string; coverage: string; action: string }> = {
  'Modelo de responsabilidad compartida': { scope: 'Seguridad de la nube y seguridad en la nube', coverage: 'Responsabilidades documentadas para la arquitectura actual.', action: 'Mantener la matriz de responsabilidades actualizada.' },
  'Identidades y accesos IAM': { scope: 'Roles, políticas y mínimo privilegio', coverage: 'Los accesos principales están asignados mediante roles.', action: 'Revisar permisos amplios durante la próxima auditoría.' },
  'Protección de cuentas': { scope: 'MFA, credenciales y acceso raíz', coverage: '1 usuario todavía requiere activar MFA.', action: 'Activar MFA y validar el acceso de emergencia.' },
  'Protección de datos': { scope: 'Cifrado, respaldos y exposición', coverage: 'El cifrado está activo en los recursos evaluados.', action: 'Conservar las llaves y políticas de respaldo vigentes.' },
  Cumplimiento: { scope: 'Políticas, evidencias y controles', coverage: '2 políticas necesitan revisión antes del cierre.', action: 'Asignar responsable y fecha a cada hallazgo.' },
}

function StatusPill({ tone, label }: { tone: keyof typeof statusStyles; label?: string }) {
  const style = statusStyles[tone]
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${style.badge}`}><span className={`size-1.5 rounded-full ${style.dot}`} />{label ?? style.label}</span>
}

export function Security() {
  const [filter, setFilter] = useState<SecurityFilter>('Todos')
  const [selectedLabel, setSelectedLabel] = useState(securityChecks[0].label)
  const [reviewing, setReviewing] = useState(false)
  const [lastReview, setLastReview] = useState('Hace 5 minutos')
  const counts = useMemo(() => ({ correct: securityChecks.filter((check) => check.tone === 'success').length, review: securityChecks.filter((check) => check.tone === 'warning').length, problem: securityChecks.filter((check) => check.tone === 'danger').length }), [])
  const visibleChecks = securityChecks.filter((check) => filter === 'Todos' || (filter === 'Problema' ? check.tone === 'danger' : check.status === filter))
  const selected = securityChecks.find((check) => check.label === selectedLabel) ?? securityChecks[0]
  const selectedTone = selected.tone as keyof typeof statusStyles
  const selectedStyle = statusStyles[selectedTone]

  const runReview = () => {
    setReviewing(true)
    window.setTimeout(() => { setReviewing(false); setLastReview('Ahora') }, 700)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-emerald-600">Seguridad y gobierno</p><h2 className="mt-1 text-3xl font-bold tracking-[-0.045em] text-slate-800 sm:text-[32px]">Protección de la solución</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Revisa identidades, datos, cuentas y cumplimiento con prioridades claras.</p></div><button type="button" onClick={runReview} disabled={reviewing} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70 sm:w-auto"><Icon name="refresh" className={`text-[18px] ${reviewing ? 'animate-spin' : ''}`} />{reviewing ? 'Revisando controles...' : 'Ejecutar revisión'}</button></header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center"><div><div className="flex items-start gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Icon name="shield_lock" className="text-[23px]" /></div><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-bold tracking-[-0.025em] text-slate-800">Postura de seguridad estable</h3><StatusPill tone="warning" label="Requiere seguimiento" /></div><p className="mt-1.5 text-sm text-slate-500">Última evaluación: {lastReview}. Hay {counts.review + counts.problem} controles que necesitan atención.</p></div></div><div className="mt-6 grid gap-2 sm:grid-cols-3"><div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3"><div className="flex items-center justify-between"><span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-emerald-700">Correctos</span><Icon name="check_circle" className="text-[17px] text-emerald-600" /></div><strong className="mt-1.5 block text-2xl text-slate-800">{counts.correct}</strong></div><div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3"><div className="flex items-center justify-between"><span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-amber-700">En revisión</span><Icon name="warning" className="text-[17px] text-amber-600" /></div><strong className="mt-1.5 block text-2xl text-slate-800">{counts.review}</strong></div><div className="rounded-xl border border-red-100 bg-red-50/60 p-3"><div className="flex items-center justify-between"><span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-red-700">Problemas</span><Icon name="error" className="text-[17px] text-red-600" /></div><strong className="mt-1.5 block text-2xl text-slate-800">{counts.problem}</strong></div></div></div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 text-center"><div className="relative mx-auto flex size-28 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#16a34a 0 76%, #dcfce7 76% 100%)' }}><div className="flex size-[88px] flex-col items-center justify-center rounded-full bg-white"><strong className="text-3xl font-extrabold tracking-[-0.05em] text-slate-800">76</strong><span className="text-[10px] font-bold uppercase text-slate-400">de 100</span></div></div><p className="mt-3 text-xs font-bold text-slate-700">Puntuación general</p><p className="mt-1 text-[11px] text-slate-500">Objetivo recomendado: 90</p></div>
        </div>
      </section>

      <section><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h3 className="text-lg font-bold text-slate-800">Dominios de control</h3><p className="mt-1 text-sm text-slate-500">Selecciona un dominio para revisar su cobertura y siguiente acción.</p></div><div className="flex flex-wrap gap-2">{(['Todos', 'Correcto', 'Revisión', 'Problema'] as SecurityFilter[]).map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${filter === item ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>{item}</button>)}</div></div><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{visibleChecks.map((check) => <SecurityCard key={check.label} check={check} selected={selected.label === check.label} onSelect={() => setSelectedLabel(check.label)} />)}</div></section>

      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">Control seleccionado</p><h3 className="mt-1.5 text-lg font-bold text-slate-800">{selected.label}</h3><p className="mt-1 text-xs text-slate-500">{securityDetails[selected.label]?.scope}</p></div><StatusPill tone={selectedTone} /></div><div className={`mt-5 rounded-xl border p-4 ${selectedStyle.border} ${selectedStyle.icon.split(' ')[0]}`}><div className="flex items-start gap-3"><div className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-white ${selectedStyle.icon.split(' ')[1]}`}><Icon name={selected.icon} className="text-[20px]" /></div><div><p className="text-xs font-extrabold uppercase tracking-[0.08em] text-slate-500">Cobertura actual</p><p className="mt-1.5 text-sm font-bold leading-6 text-slate-700">{securityDetails[selected.label]?.coverage}</p></div></div></div><div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4"><Icon name="tips_and_updates" className="mt-0.5 text-[19px] text-blue-600" /><div><p className="text-xs font-extrabold text-blue-800">Siguiente acción</p><p className="mt-1 text-sm leading-6 text-blue-800/80">{securityDetails[selected.label]?.action}</p></div></div></section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6"><h3 className="text-lg font-bold text-slate-800">Responsabilidad compartida</h3><p className="mt-1 text-sm text-slate-500">Separación clara de responsabilidades.</p><div className="mt-5 space-y-3"><div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4"><div className="flex items-center gap-2 text-blue-700"><Icon name="cloud" className="text-[19px]" /><strong className="text-sm">AWS protege la nube</strong></div><p className="mt-2 text-xs leading-5 text-slate-600">Hardware, centros de datos, red global y servicios administrados.</p></div><div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4"><div className="flex items-center gap-2 text-violet-700"><Icon name="manage_accounts" className="text-[19px]" /><strong className="text-sm">El cliente protege su uso</strong></div><p className="mt-2 text-xs leading-5 text-slate-600">Identidades, datos, permisos, aplicaciones y configuraciones.</p></div></div><button type="button" onClick={() => { setFilter('Problema'); setSelectedLabel('Cumplimiento') }} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100"><Icon name="priority_high" className="text-[16px]" />Revisar prioridad crítica</button></section>
      </div>
    </div>
  )
}
