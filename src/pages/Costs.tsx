import { useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CostCard } from '../components/CostCard'
import { Icon } from '../components/Icon'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Button } from '../components/ui/button'
import { costItems, costTrend } from '../data/cloudData'
import { usePersistentState } from '../hooks/usePersistentState'

const budget = 450
const usageProfiles = [
  { hours: 720, label: 'Operación continua', detail: '24/7 · 720 h/mes' },
  { hours: 176, label: 'Horario laboral', detail: '8×5 · 176 h/mes' },
  { hours: 80, label: 'Desarrollo', detail: 'Uso parcial · 80 h/mes' },
]

function formatCurrency(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(value)
}

export function Costs() {
  const [usageHours, setUsageHours] = usePersistentState<number>('cloudfoundations.usageHours', 720)
  const [selectedServices, setSelectedServices] = usePersistentState<string[]>('cloudfoundations.costServices', costItems.map((item) => item.service))
  const [quantities, setQuantities] = usePersistentState<Record<string, number>>('cloudfoundations.costQuantities', Object.fromEntries(costItems.map((item) => [item.service, item.quantity])))
  const [exportMessage, setExportMessage] = useState('')

  const calculatedItems = useMemo(() => costItems.filter((item) => selectedServices.includes(item.service)).map((item) => {
    const unitHourlyCost = item.monthly / (item.quantity * item.hours)
    const quantity = quantities[item.service] ?? item.quantity
    const monthly = quantity * usageHours * unitHourlyCost
    return { ...item, quantity, hours: usageHours, unitHourlyCost, monthly, annual: monthly * 12 }
  }), [quantities, selectedServices, usageHours])

  const monthlyTotal = calculatedItems.reduce((total, item) => total + item.monthly, 0)
  const annualTotal = monthlyTotal * 12
  const budgetPercent = Math.round((monthlyTotal / budget) * 100)
  const costTrendData = useMemo(() => {
    const baseline = costItems.reduce((total, item) => total + item.monthly, 0)
    const multiplier = baseline > 0 ? monthlyTotal / baseline : 0
    return costTrend.map((item) => ({ ...item, cost: Math.round(item.cost * multiplier) }))
  }, [monthlyTotal])
  const selectedProfile = usageProfiles.find((profile) => profile.hours === usageHours) ?? usageProfiles[0]

  const changeQuantity = (service: string, delta: number) => {
    setQuantities((current) => ({ ...current, [service]: Math.max(0, Math.min(20, (current[service] ?? 0) + delta)) }))
  }

  const toggleService = (service: string) => {
    setSelectedServices((current) => current.includes(service) ? current.filter((item) => item !== service) : [...current, service])
  }

  const reset = () => {
    setUsageHours(720)
    setSelectedServices(costItems.map((item) => item.service))
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
          <Button type="button" size="lg" onClick={exportReport} className="w-full bg-blue-600 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"><Icon name="download" className="text-[18px]" />Exportar reporte</Button>
          <Button type="button" size="lg" variant="outline" onClick={reset} className="w-full text-sm font-bold sm:w-auto"><Icon name="refresh" className="text-[18px]" />Restablecer</Button>
        </div>
      </header>

      {exportMessage && <Alert role="status" className="border-emerald-200 bg-emerald-50 text-emerald-800"><Icon name="check_circle" className="text-[20px] text-emerald-600" /><AlertDescription className="font-medium text-emerald-700">{exportMessage}</AlertDescription></Alert>}

      <div className="grid gap-3 md:grid-cols-3">
        <CostCard label="Total mensual" value={formatCurrency(monthlyTotal)} detail="Estimación de la configuración" icon="payments" featured />
        <CostCard label="Proyección anual" value={formatCurrency(annualTotal)} detail="Costo estimado a 12 meses" icon="calendar_month" tone="info" />
        <CostCard label="Presupuesto utilizado" value={`${budgetPercent}%`} detail={`${formatCurrency(monthlyTotal)} de ${formatCurrency(budget)}`} icon="show_chart" tone={monthlyTotal <= budget ? 'success' : 'warning'} progress={budgetPercent} />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div><h3 className="text-lg font-bold tracking-[-0.02em] text-slate-800">Capacidad de la solución</h3><p className="mt-1 text-sm text-slate-500">Define los supuestos de uso y ajusta la cantidad de recursos, como en una calculadora de AWS.</p></div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700">Perfil de uso mensual</p>
                <p className="mt-0.5 text-[11px] text-slate-500">Las horas seleccionadas se aplican a todos los servicios estimados.</p>
              </div>
              <span className="w-fit rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-blue-700 shadow-sm">{selectedProfile.hours} h/mes</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3" role="group" aria-label="Perfil de uso mensual">
              {usageProfiles.map((profile) => {
                const selected = profile.hours === usageHours
                return <button type="button" key={profile.hours} aria-pressed={selected} onClick={() => setUsageHours(profile.hours)} className={`rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${selected ? 'border-blue-300 bg-white shadow-sm' : 'border-transparent bg-white/60 hover:border-slate-200 hover:bg-white'}`}><span className={`block text-xs font-bold ${selected ? 'text-blue-700' : 'text-slate-700'}`}>{profile.label}</span><span className="mt-1 block text-[11px] text-slate-500">{profile.detail}</span></button>
              })}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold text-slate-700">Servicios con consumo estimado</p><p className="mt-0.5 text-[11px] leading-5 text-slate-500">Selecciona los servicios que participarán en el cálculo actual.</p></div><span className="text-[11px] font-bold text-blue-700">{selectedServices.length} de {costItems.length}</span></div><div className="mt-3 flex flex-wrap gap-2">{costItems.map((item) => { const selected = selectedServices.includes(item.service); return <Button type="button" key={item.service} size="sm" variant={selected ? 'default' : 'outline'} onClick={() => toggleService(item.service)} aria-pressed={selected} className={`rounded-full text-[11px] font-bold ${selected ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border-slate-300 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-700'}`}>{item.service}</Button> })}</div><p className="mt-3 border-t border-blue-100 pt-3 text-[10px] leading-4 text-slate-500">El catálogo Cloud tiene 7 servicios. Esta estimación usa 5 con consumo directo; IAM y VPC base requieren conceptos asociados para calcular cargos específicos.</p></div>

          <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {calculatedItems.length > 0 ? calculatedItems.map((item) => (
              <div key={item.service} className="grid gap-3 px-3 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:px-4">
                <div className="flex min-w-0 items-center gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Icon name={item.icon} className="text-[18px]" /></div><div className="min-w-0"><strong className="block truncate text-sm text-slate-700">{item.service}</strong><span className="mt-0.5 block text-[11px] text-slate-400">{item.category}</span></div></div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500"><div><span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Cantidad</span><div className="mt-1 inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1"><Button type="button" variant="ghost" size="icon-sm" onClick={() => changeQuantity(item.service, -1)} disabled={item.quantity === 0} aria-label={`Reducir cantidad de ${item.service}`} className="text-slate-500 hover:bg-white hover:text-slate-800"><Icon name="remove" className="text-[16px]" /></Button><output aria-label={`Cantidad actual de ${item.service}`} className="w-9 text-center text-sm font-extrabold text-slate-800">{item.quantity}</output><Button type="button" variant="ghost" size="icon-sm" onClick={() => changeQuantity(item.service, 1)} disabled={item.quantity === 20} aria-label={`Aumentar cantidad de ${item.service}`} className="bg-white text-blue-600 shadow-sm hover:bg-blue-50"><Icon name="add" className="text-[16px]" /></Button></div></div><div><span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Horas</span><strong className="mt-1 block text-xs text-slate-700">{item.hours} h/mes</strong></div><div><span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Tarifa</span><strong className="mt-1 block text-xs text-slate-700">{formatCurrency(item.unitHourlyCost, 2)}/h</strong></div></div>
                <div className="flex items-end justify-between gap-5 border-t border-slate-100 pt-3 sm:block sm:border-t-0 sm:pt-0 sm:text-right"><div><span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Mensual</span><strong className="mt-1 block text-sm text-slate-800">{formatCurrency(item.monthly)}</strong></div><div className="mt-1 text-[10px] text-slate-400">Anual: <span className="font-bold text-slate-600">{formatCurrency(item.annual)}</span></div></div>
              </div>
            )) : <div className="p-6 text-center"><Icon name="tune" className="text-[26px] text-slate-300" /><p className="mt-2 text-sm font-bold text-slate-700">Selecciona al menos un servicio</p><p className="mt-1 text-xs text-slate-500">La estimación se actualizará cuando actives un componente.</p></div>}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3"><p className="text-[11px] leading-5 text-slate-500">Estimación basada en <strong className="text-slate-700">{selectedProfile.label.toLowerCase()}</strong> · {selectedProfile.hours} h/mes.</p><span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${monthlyTotal <= budget ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}><span className="size-1.5 rounded-full bg-current" />{monthlyTotal <= budget ? 'Dentro del presupuesto' : 'Presupuesto excedido'}</span></div>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-bold tracking-[-0.02em] text-slate-800">Análisis de costos</h3><p className="mt-1 text-sm text-slate-500">Compara el consumo actual y observa su evolución mensual.</p></div><span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">USD / mes</span></div>
          {calculatedItems.length > 0 ? (
            <>
              <div className="mt-5"><div className="flex items-center justify-between gap-3"><h4 className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">Costo mensual por servicio</h4><span className="text-[10px] text-slate-400">Configuración actual</span></div><div className="mt-2 h-[220px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={calculatedItems} layout="vertical" margin={{ top: 5, right: 12, left: 0, bottom: 5 }}><CartesianGrid stroke="#e2e8f0" horizontal={false} /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(value) => `$${value}`} /><YAxis type="category" dataKey="service" width={82} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} /><Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Mensual']} /><Bar dataKey="monthly" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={16} /></BarChart></ResponsiveContainer></div></div>
              <div className="mt-5 border-t border-slate-100 pt-5"><div className="flex items-center justify-between gap-3"><div><h4 className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">Tendencia mensual</h4><p className="mt-1 text-[11px] text-slate-400">Evolución estimada del gasto de la configuración actual.</p></div><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">Interactivo</span></div><div className="mt-2 h-[190px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={costTrendData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="costTrendFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" /><stop offset="100%" stopColor="#2563eb" stopOpacity="0.03" /></linearGradient></defs><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(value) => `$${value}`} /><Tooltip cursor={{ stroke: '#93c5fd', strokeDasharray: '4 4' }} formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Costo']} /><Area type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={2.5} fill="url(#costTrendFill)" activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div></div>
            </>
          ) : (
            <div className="mt-4 flex min-h-[245px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center"><Icon name="bar_chart" className="text-[28px] text-slate-300" /><p className="mt-3 text-sm font-bold text-slate-700">Sin servicios para comparar</p><p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Activa al menos un servicio para visualizar la distribución del costo estimado.</p></div>
          )}
        </section>
      </div>
    </div>
  )
}
