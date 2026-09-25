import { useMemo, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { costItems, regions, securityChecks, services } from '../data/cloudData'
import { Icon } from '../components/Icon'
import { Button } from '../components/ui/button'
import { useSelectedRegion } from '../context/selectedRegion'
import { usePersistentState } from '../hooks/usePersistentState'
import { savedProposalStorageKey, type SolutionPlan } from '../types/planning'

type DashboardTone = 'blue' | 'green' | 'amber' | 'purple'
type DashboardStatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const metricToneClasses: Record<DashboardTone, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  purple: 'bg-violet-50 text-violet-600',
}

const statusToneClasses: Record<DashboardStatusTone, string> = {
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  neutral: 'bg-slate-100 text-slate-600',
}

const costCategoryColors: Record<string, string> = {
  Compute: '#2563eb',
  Database: '#f59e0b',
  Storage: '#16a34a',
  Delivery: '#7c3aed',
  Networking: '#64748b',
}

function DashboardPanel({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)] sm:p-6 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold tracking-[-0.02em] text-slate-800">{title}</h3>
          {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function DashboardStatus({ label, tone = 'neutral' }: { label: string; tone?: DashboardStatusTone }) {
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusToneClasses[tone]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

function MetricCard({ label, value, detail, icon, tone, trend, compact = false }: { label: string; value: string; detail: string; icon: string; tone: DashboardTone; trend?: string; compact?: boolean }) {
  return (
    <article className="relative min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_28px_rgba(37,99,235,0.09)]">
      <div className="flex items-start gap-3.5">
        <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${metricToneClasses[tone]}`}>
          <Icon name={icon} className="text-[21px]" />
        </div>
        <div className="min-w-0 flex-1 pr-4">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-400">{label}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <strong className={`${compact ? 'text-xl' : 'text-3xl'} font-bold tracking-[-0.05em] text-slate-800`}>{value}</strong>
            {trend && <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600"><Icon name="trending_up" className="text-[15px]" />{trend}</span>}
          </div>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">{detail}</p>
        </div>
      </div>
      <Icon name="more_horiz" className="absolute right-4 top-5 text-[18px] text-slate-300" />
    </article>
  )
}

function ServiceRow({ service }: { service: (typeof services)[number] }) {
  const iconTone = service.iconTone === 'warning' ? 'bg-amber-50 text-amber-600' : service.iconTone === 'success' ? 'bg-emerald-50 text-emerald-600' : service.iconTone === 'neutral' ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'

  return (
    <div className="flex items-center gap-3 border-b border-slate-100 py-3.5 last:border-0 last:pb-0 first:pt-0">
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${iconTone}`}><Icon name={service.icon} className="text-[18px]" /></div>
      <div className="min-w-0 flex-1">
        <strong className="block truncate text-sm font-bold text-slate-800">{service.name}</strong>
        <span className="mt-0.5 block text-xs text-slate-400">{service.category}</span>
      </div>
      <DashboardStatus label={service.status} tone={service.status === 'En uso' ? 'success' : service.status === 'Revisión' ? 'warning' : 'neutral'} />
    </div>
  )
}

function securityIconClass(tone: DashboardStatusTone) {
  return tone === 'success' ? 'text-emerald-600' : tone === 'warning' ? 'text-amber-600' : tone === 'danger' ? 'text-red-600' : 'text-slate-500'
}

export function Dashboard() {
  const navigate = useNavigate()
  const { selectedRegion: selectedRegionCode } = useSelectedRegion()
  const [savedProposal] = usePersistentState<SolutionPlan | null>(savedProposalStorageKey, null)
  const [usageHours] = usePersistentState<number>('cloudfoundations.usageHours', 720)
  const [selectedCostServices] = usePersistentState<string[]>('cloudfoundations.costServices', [])
  const [quantities] = usePersistentState<Record<string, number>>('cloudfoundations.costQuantities', {})
  const planServiceIds = useMemo(() => savedProposal?.selectedServices ?? [], [savedProposal])
  const calculatedCostItems = useMemo(() => costItems.filter((item) => planServiceIds.includes(item.serviceId) && selectedCostServices.includes(item.serviceId)).map((item) => {
    const quantity = quantities[item.serviceId] ?? 1
    const unitHourlyCost = item.monthly / (item.quantity * item.hours)
    return { ...item, monthly: quantity * usageHours * unitHourlyCost }
  }), [planServiceIds, quantities, selectedCostServices, usageHours])
  const dashboardMonthlyTotal = calculatedCostItems.reduce((total, item) => total + item.monthly, 0)
  const annualTotal = dashboardMonthlyTotal * 12
  const dashboardCostDistribution = calculatedCostItems.map((item) => ({ name: item.category, value: item.monthly, fill: costCategoryColors[item.category] ?? '#64748b' }))
  const dashboardTrend = savedProposal && calculatedCostItems.length > 0 ? [{ month: 'Actual', cost: Math.round(dashboardMonthlyTotal) }] : []
  const selectedRegion = regions.find((region) => region.code === (savedProposal?.region ?? selectedRegionCode)) ?? regions[0]
  const usedServices = services.filter((service) => planServiceIds.includes(service.id))
  const totalResources = calculatedCostItems.reduce((total, item) => total + item.quantity, 0) + usedServices.filter((service) => !costItems.some((item) => item.serviceId === service.id)).length
  const correctSecurityChecks = securityChecks.filter((check) => check.tone === 'success').length
  const securityScore = Math.round((securityChecks.reduce((score, check) => score + (check.tone === 'success' ? 1 : check.tone === 'warning' ? 0.8 : 0), 0) / securityChecks.length) * 100)
  const securityLabel = securityScore >= 90 ? 'Protección alta' : securityScore >= 70 ? 'Requiere seguimiento' : 'Atención prioritaria'
  const securityTone: DashboardStatusTone = securityScore >= 90 ? 'success' : securityScore >= 70 ? 'warning' : 'danger'
  const architectureStatus = savedProposal ? (selectedRegion.tone === 'success' ? 'Operativa' : 'Revisión') : 'Sin plan'
  const networkConfigured = planServiceIds.includes('vpc')
  const continuityConfigured = savedProposal?.availability.includes('Alta') ?? false

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600">Vista general</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-slate-800 sm:text-[32px]">Buenos días, Sebastian</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Este es el estado actual de tu propuesta de arquitectura Cloud.</p>
        </div>
        <Button type="button" size="lg" onClick={() => navigate('/planning')} className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300">
          <Icon name="add" className="text-[19px]" />
          Nueva propuesta
        </Button>
      </header>

      <section aria-label="Indicadores principales" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Costo mensual estimado" value={savedProposal ? `$${dashboardMonthlyTotal.toLocaleString('en-US')}` : '—'} detail={savedProposal ? 'Según la planificación registrada' : 'Crea una planificación para estimar'} icon="payments" tone="amber" />
        <MetricCard label="Costo anual estimado" value={savedProposal ? `$${annualTotal.toLocaleString('en-US')}` : '—'} detail={savedProposal ? 'Proyección de inversión a 12 meses' : 'Sin datos para proyectar'} icon="calendar_month" tone="blue" compact />
        <MetricCard label="Región seleccionada" value={savedProposal ? selectedRegion.code : '—'} detail={savedProposal ? `${selectedRegion.name} · ${selectedRegion.location}` : 'Se toma desde la planificación'} icon="location_on" tone="blue" compact />
        <MetricCard label="Servicios utilizados" value={savedProposal ? `${usedServices.length}` : '—'} detail={savedProposal ? 'Componentes de la planificación' : 'Sin servicios registrados'} icon="apps" tone="purple" compact />
        <MetricCard label="Recursos Cloud" value={savedProposal ? `${totalResources}` : '—'} detail={savedProposal ? 'Recursos estimables del plan actual' : 'Se calcula desde Costos'} icon="deployed_code" tone="purple" />
        <MetricCard label="Estado de seguridad" value={`${securityScore}%`} detail={`${correctSecurityChecks} de ${securityChecks.length} correctos · ${securityChecks.length - correctSecurityChecks} requieren atención`} icon="shield_lock" tone={securityTone === 'success' ? 'green' : 'amber'} />
        <MetricCard label="Estado de arquitectura" value={architectureStatus} detail={savedProposal ? `SLA ${selectedRegion.availability} · ${selectedRegion.status.toLowerCase()}` : 'Registra una propuesta para revisar el estado'} icon="account_tree" tone={architectureStatus === 'Operativa' ? 'green' : 'amber'} compact />
      </section>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <DashboardPanel title="Costo estimado del plan" subtitle="Estimación mensual en USD · sin historial inventado">
          <div className="mb-3 flex items-center justify-between gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-blue-600" />Estimación actual</span>
            <span className="text-slate-400">Sin datos históricos</span>
          </div>
          {dashboardTrend.length > 0 ? <div className="h-[250px] w-full sm:h-[280px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dashboardTrend} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <defs><linearGradient id="dashboardCostGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} /><stop offset="100%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="#e2e8f0" vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)', fontFamily: 'DM Sans' }} formatter={(value) => [`$${value}`, 'Costo']} />
                <Area type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={3} fill="url(#dashboardCostGradient)" activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer></div> : <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center sm:min-h-[280px]"><Icon name="bar_chart" className="text-[30px] text-slate-300" /><p className="mt-3 text-sm font-bold text-slate-700">El gráfico se activará con tu planificación</p><p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">Aquí aparecerá el costo mensual calculado desde los servicios y cantidades que registres.</p></div>}
        </DashboardPanel>

        <DashboardPanel title="Resumen de seguridad" subtitle="Última revisión: hoy, 09:42" action={<Button type="button" variant="link" size="sm" onClick={() => navigate('/security')} className="h-auto p-0 text-xs font-bold text-blue-600">Ver detalles <Icon name="arrow_forward" className="text-[16px]" /></Button>}>
          <div className="flex items-center gap-4">
            <div className="relative flex size-24 shrink-0 items-center justify-center rounded-full border-[9px] border-emerald-100 border-r-emerald-500">
              <div className="text-center"><strong className="block text-2xl font-bold leading-none text-slate-800">92</strong><span className="mt-1 block text-[10px] text-slate-400">/ 100</span></div>
            </div>
            <div className="min-w-0">
              <DashboardStatus label={securityLabel} tone={securityTone} />
              <p className="mt-2 text-xs leading-5 text-slate-500">La arquitectura cumple con los controles principales de seguridad.</p>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" /></div>
          <div className="mt-5 divide-y divide-slate-100">
            {securityChecks.map((check) => <div className="flex items-center gap-2.5 py-3 first:pt-0 last:pb-0" key={check.label}><Icon name={check.icon} className={`shrink-0 text-[18px] ${securityIconClass(check.tone)}`} /><span className="min-w-0 flex-1 truncate text-xs text-slate-500">{check.label}</span><DashboardStatus label={check.status} tone={check.tone} /></div>)}
          </div>
        </DashboardPanel>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <DashboardPanel title="Distribución de costos" subtitle="Por categoría de servicio" action={<span aria-hidden="true" className="inline-flex rounded-lg p-1.5 text-slate-300"><Icon name="more_horiz" className="text-[19px]" /></span>}>
          {dashboardCostDistribution.length > 0 ? <><div className="mb-3 flex items-center justify-between gap-3"><span className="text-xs text-slate-500">Costo mensual total</span><strong className="text-sm font-extrabold text-slate-800">${dashboardMonthlyTotal.toLocaleString('en-US')}</strong></div><div className="h-[245px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={dashboardCostDistribution} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 4 }}><CartesianGrid stroke="#e2e8f0" horizontal={false} /><XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(value) => `$${value}`} /><YAxis type="category" dataKey="name" width={84} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} /><Tooltip cursor={{ fill: '#f8fafc' }} formatter={(value) => [`$${Number(value ?? 0).toLocaleString('en-US')}`, 'Mensual']} /><Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>{dashboardCostDistribution.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer></div></> : <div className="flex min-h-[245px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center"><Icon name="bar_chart" className="text-[28px] text-slate-300" /><p className="mt-3 text-sm font-bold text-slate-700">Sin costos para distribuir</p><p className="mt-1 text-xs leading-5 text-slate-500">Activa un servicio desde el módulo de Costos para visualizar la distribución.</p></div>}
        </DashboardPanel>

        <DashboardPanel title="Servicios principales" subtitle="Componentes activos en la solución" action={<Button type="button" variant="link" size="sm" onClick={() => navigate('/services')} className="h-auto p-0 text-xs font-bold text-blue-600">Ver catálogo <Icon name="arrow_forward" className="text-[16px]" /></Button>}>
          {usedServices.length > 0 ? <div>{usedServices.map((service) => <ServiceRow service={service} key={service.id} />)}</div> : <div className="flex min-h-[245px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center"><Icon name="apps" className="text-[28px] text-slate-300" /><p className="mt-3 text-sm font-bold text-slate-700">Sin servicios en la planificación</p><p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Registra una propuesta para ver aquí los componentes de tu solución.</p></div>}
        </DashboardPanel>
      </div>

      <DashboardPanel title="Estado de la arquitectura" subtitle="Resumen operativo de la solución Cloud" action={<DashboardStatus label={architectureStatus} tone={architectureStatus === 'Operativa' ? 'success' : 'warning'} />}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><Icon name="monitor_heart" className="text-[20px]" /></div><div><strong className="block text-sm font-bold text-slate-800">Disponibilidad</strong><span className="text-xs text-slate-500">{savedProposal ? savedProposal.availability : 'Sin disponibilidad definida'}</span></div></div>
          <div className={`flex items-center gap-3 rounded-xl border p-4 ${networkConfigured ? 'border-blue-100 bg-blue-50/70' : 'border-slate-200 bg-slate-50/70'}`}><div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${networkConfigured ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}><Icon name="hub" className="text-[20px]" /></div><div><strong className="block text-sm font-bold text-slate-800">Red operativa</strong><span className="text-xs text-slate-500">{networkConfigured ? 'VPC incluida en el plan' : 'VPC no incluida'}</span></div></div>
          <div className={`flex items-center gap-3 rounded-xl border p-4 ${continuityConfigured ? 'border-emerald-100 bg-emerald-50/70' : 'border-amber-100 bg-amber-50/70'}`}><div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${continuityConfigured ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}><Icon name="backup" className="text-[20px]" /></div><div><strong className="block text-sm font-bold text-slate-800">Continuidad</strong><span className="text-xs text-slate-500">{continuityConfigured ? 'Disponibilidad alta solicitada' : 'Requiere revisión del plan'}</span></div></div>
        </div>
      </DashboardPanel>

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Catálogo rápido</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-800">Servicios utilizados</h2></div>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate('/services')} className="self-start rounded-xl text-xs font-bold text-slate-600 sm:self-auto">Ver todos <Icon name="arrow_forward" className="text-[16px]" /></Button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {usedServices.length > 0 ? usedServices.map((service) => {
            const iconTone = service.iconTone === 'warning' ? 'bg-amber-50 text-amber-600' : service.iconTone === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
            return <article className="group flex min-h-[190px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(37,99,235,0.09)]" key={service.id}><div className="flex items-start justify-between gap-3"><div className={`flex size-11 items-center justify-center rounded-xl ${iconTone}`}><Icon name={service.icon} className="text-[21px]" /></div><DashboardStatus label={service.status} tone={service.status === 'En uso' ? 'success' : 'neutral'} /></div><h3 className="mt-4 text-base font-bold text-slate-800">{service.name}</h3><span className="mt-1 text-xs text-slate-400">{service.category}</span><p className="mt-3 flex-1 text-sm leading-5 text-slate-500">{service.description}</p><div className="mt-4 border-t border-slate-100 pt-3"><span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Uso principal</span><strong className="mt-1 block text-xs font-semibold text-slate-600">{service.purpose}</strong></div></article>
          }) : <div className="col-span-full flex min-h-[190px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center"><Icon name="add_circle" className="text-[28px] text-slate-300" /><p className="mt-3 text-sm font-bold text-slate-700">Aún no hay una solución activa</p><p className="mt-1 max-w-md text-xs leading-5 text-slate-500">Los servicios seleccionados en Planificación aparecerán aquí con su estado de uso.</p></div>}
        </div>
      </section>
    </div>
  )
}
