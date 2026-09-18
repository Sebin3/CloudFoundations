import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CostCard } from '../components/CostCard'
import { Icon } from '../components/Icon'
import { costItems } from '../data/cloudData'
import { usePersistentState } from '../hooks/usePersistentState'

const colors = ['#2563eb', '#f59e0b', '#16a34a', '#7c3aed', '#0891b2']
const budget = 450
const usageProfiles = [
  { hours: 720, label: 'Operación continua', detail: '24/7 · 720 h/mes' },
  { hours: 176, label: 'Horario laboral', detail: '8×5 · 176 h/mes' },
  { hours: 80, label: 'Desarrollo', detail: 'Uso parcial · 80 h/mes' },
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function Costs() {
  const [usageHours, setUsageHours] = usePersistentState<number>('cloudfoundations.usageHours', 720)
  const [quantities, setQuantities] = usePersistentState<Record<string, number>>('cloudfoundations.costQuantities', Object.fromEntries(costItems.map((item) => [item.service, item.quantity])))
  const [exportMessage, setExportMessage] = useState('')

  const calculatedItems = useMemo(() => costItems.map((item) => {
    const unitHourlyCost = item.monthly / (item.quantity * item.hours)
    const quantity = quantities[item.service] ?? item.quantity
    const monthly = quantity * usageHours * unitHourlyCost
    return { ...item, quantity, hours: usageHours, monthly, annual: monthly * 12 }
  }), [quantities, usageHours])

  const monthlyTotal = calculatedItems.reduce((total, item) => total + item.monthly, 0)
  const annualTotal = monthlyTotal * 12
  const budgetPercent = Math.round((monthlyTotal / budget) * 100)
  const distribution = calculatedItems.map((item, index) => ({ name: item.category, value: item.monthly, fill: colors[index] }))

  const changeQuantity = (service: string, delta: number) => {
    setQuantities((current) => ({ ...current, [service]: Math.max(0, Math.min(20, (current[service] ?? 0) + delta)) }))
  }

  const reset = () => {
    setUsageHours(720)
    setQuantities(Object.fromEntries(costItems.map((item) => [item.service, item.quantity])))
    setExportMessage('')
  }

  const exportReport = () => {
    const rows = [
      ['Servicio', 'Categoría', 'Cantidad', 'Horas/mes', 'Costo mensual', 'Costo anual'],
      ...calculatedItems.map((item) => [item.service, item.category, String(item.quantity), String(item.hours), String(item.monthly.toFixed(2)), String(item.annual.toFixed(2))]),
    ]

    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'reporte-costos-cloudops.csv'
    link.click()
    URL.revokeObjectURL(url)
    setExportMessage('Reporte exportado correctamente')
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-amber-600">Economía Cloud</p><h2 className="mt-1 text-3xl font-bold tracking-[-0.045em] text-slate-800 sm:text-[32px]">Costos y consumo</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Configura la capacidad con controles simples y revisa el impacto económico al instante.</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={exportReport} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto"><Icon name="download" className="text-[18px]" />Exportar reporte</button>
          <button type="button" onClick={reset} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"><Icon name="refresh" className="text-[18px]" />Restablecer</button>
        </div>
      </header>

      {exportMessage && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{exportMessage}</div>}

      <div className="grid gap-3 md:grid-cols-3">
        <CostCard label="Total mensual" value={formatCurrency(monthlyTotal)} detail="Estimación de la configuración" icon="payments" featured />
        <CostCard label="Proyección anual" value={formatCurrency(annualTotal)} detail="Costo estimado a 12 meses" icon="calendar_month" tone="info" />
        <CostCard label="Presupuesto utilizado" value={`${budgetPercent}%`} detail={`${formatCurrency(monthlyTotal)} de ${formatCurrency(budget)}`} icon="show_chart" tone={monthlyTotal <= budget ? 'success' : 'warning'} />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h3 className="text-lg font-bold tracking-[-0.02em] text-slate-800">Capacidad de la solución</h3><p className="mt-1 text-sm text-slate-500">Usa − y + para ajustar recursos.</p></div><label className="min-w-[190px]"><span className="sr-only">Perfil de uso mensual</span><select value={usageHours} onChange={(event) => setUsageHours(Number(event.target.value))} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">{usageProfiles.map((profile) => <option key={profile.hours} value={profile.hours}>{profile.label} · {profile.hours} h</option>)}</select></label></div>

          <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {calculatedItems.map((item) => (
              <div key={item.service} className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Icon name={item.icon} className="text-[18px]" /></div><div className="min-w-0"><strong className="block truncate text-sm text-slate-700">{item.service}</strong><span className="mt-0.5 block text-[11px] text-slate-400">{item.category} · {usageHours} h/mes</span></div></div>
                <div className="flex items-center justify-between gap-4 sm:justify-end"><div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1"><button type="button" onClick={() => changeQuantity(item.service, -1)} disabled={item.quantity === 0} aria-label={`Reducir cantidad de ${item.service}`} className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"><Icon name="remove" className="text-[16px]" /></button><output aria-label={`Cantidad actual de ${item.service}`} className="w-9 text-center text-sm font-extrabold text-slate-800">{item.quantity}</output><button type="button" onClick={() => changeQuantity(item.service, 1)} disabled={item.quantity === 20} aria-label={`Aumentar cantidad de ${item.service}`} className="flex size-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-30"><Icon name="add" className="text-[16px]" /></button></div><div className="w-20 text-right"><strong className="block text-sm text-slate-800">{formatCurrency(item.monthly)}</strong><span className="text-[10px] text-slate-400">por mes</span></div></div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold text-slate-700">Perfil activo: {usageProfiles.find((profile) => profile.hours === usageHours)?.label}</p><p className="mt-0.5 text-[11px] text-slate-500">Todos los servicios se calculan con {usageHours} horas mensuales.</p></div><span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${monthlyTotal <= budget ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}><span className="size-1.5 rounded-full bg-current" />{monthlyTotal <= budget ? 'Dentro del presupuesto' : 'Presupuesto excedido'}</span></div>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-bold tracking-[-0.02em] text-slate-800">Costo por servicio</h3><p className="mt-1 text-sm text-slate-500">Comparativa de la configuración actual.</p></div><span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">USD / mes</span></div>
          <div className="mt-4 h-[245px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={calculatedItems} layout="vertical" margin={{ top: 5, right: 12, left: 0, bottom: 5 }}><CartesianGrid stroke="#e2e8f0" horizontal={false} /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(value) => `$${value}`} /><YAxis type="category" dataKey="service" width={82} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} /><Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Mensual']} /><Bar dataKey="monthly" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={16} /></BarChart></ResponsiveContainer></div>
          <div className="mt-3 grid grid-cols-[120px_minmax(0,1fr)] items-center gap-4 border-t border-slate-100 pt-4"><div className="relative h-28"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={distribution} dataKey="value" innerRadius={34} outerRadius={50} paddingAngle={3} stroke="none">{distribution.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="text-sm text-slate-800">{formatCurrency(monthlyTotal)}</strong><span className="text-[9px] text-slate-400">total</span></div></div><div className="grid grid-cols-2 gap-x-3 gap-y-2">{distribution.map((entry) => <div key={entry.name} className="flex min-w-0 items-center gap-2 text-[10px]"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: entry.fill }} /><span className="min-w-0 flex-1 truncate text-slate-500">{entry.name}</span><strong className="text-slate-700">{monthlyTotal ? Math.round((entry.value / monthlyTotal) * 100) : 0}%</strong></div>)}</div></div>
        </section>
      </div>
    </div>
  )
}
