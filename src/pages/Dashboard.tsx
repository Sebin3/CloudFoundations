import type { ReactNode } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { costDistribution, costTrend, monthlyTotal, securityChecks, services } from '../data/cloudData'
import { Icon } from '../components/Icon'

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

export function Dashboard() {
  const annualTotal = monthlyTotal * 12

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600">Vista general</p>
          <h2 className="mt-2 text-3xl font-bold tracking-[-0.045em] text-slate-800 sm:text-[32px]">Buenos días, Alex</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Este es el estado actual de tu propuesta de arquitectura Cloud.</p>
        </div>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.18)] transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300">
          <Icon name="add" className="text-[19px]" />
          Nueva propuesta
        </button>
      </header>

      <section aria-label="Indicadores principales" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Costo mensual estimado" value={`$${monthlyTotal.toLocaleString('en-US')}`} detail="Proyección para septiembre" icon="payments" tone="amber" trend="5.2%" />
        <MetricCard label="Costo anual estimado" value={`$${annualTotal.toLocaleString('en-US')}`} detail="Proyección de inversión a 12 meses" icon="calendar_month" tone="blue" compact />
        <MetricCard label="Región seleccionada" value="us-east-1" detail="N. Virginia · 48 recursos" icon="location_on" tone="blue" compact />
        <MetricCard label="Recursos Cloud" value="78" detail="Distribuidos en 3 regiones activas" icon="deployed_code" tone="purple" trend="8.4%" />
        <MetricCard label="Estado de seguridad" value="92%" detail="4 de 5 controles correctos" icon="shield_lock" tone="green" />
        <MetricCard label="Estado de arquitectura" value="Operativa" detail="SLA 99.98% · sin incidentes" icon="account_tree" tone="green" compact />
      </section>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <DashboardPanel title="Evolución de costos" subtitle="Estimación mensual en USD" action={<button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"><span>Últimos 6 meses</span><Icon name="expand_more" className="text-[17px]" /></button>}>
          <div className="mb-3 flex items-center justify-between gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-blue-600" />Costo estimado</span>
            <span className="text-slate-400">Actualizado hace 2 horas</span>
          </div>
          <div className="h-[250px] w-full sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrend} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <defs><linearGradient id="dashboardCostGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} /><stop offset="100%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="#e2e8f0" vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip contentStyle={{ border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)', fontFamily: 'DM Sans' }} formatter={(value) => [`$${value}`, 'Costo']} />
                <Area type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={3} fill="url(#dashboardCostGradient)" activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Resumen de seguridad" subtitle="Última revisión: hoy, 09:42" action={<button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">Ver detalles <Icon name="arrow_forward" className="text-[16px]" /></button>}>
          <div className="flex items-center gap-4">
            <div className="relative flex size-24 shrink-0 items-center justify-center rounded-full border-[9px] border-emerald-100 border-r-emerald-500">
              <div className="text-center"><strong className="block text-2xl font-bold leading-none text-slate-800">92</strong><span className="mt-1 block text-[10px] text-slate-400">/ 100</span></div>
            </div>
            <div className="min-w-0">
              <DashboardStatus label="Protección alta" tone="success" />
              <p className="mt-2 text-xs leading-5 text-slate-500">La arquitectura cumple con los controles principales de seguridad.</p>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><span className="block h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" /></div>
          <div className="mt-5 divide-y divide-slate-100">
            {securityChecks.slice(0, 3).map((check) => <div className="flex items-center gap-2.5 py-3 first:pt-0 last:pb-0" key={check.label}><Icon name={check.icon} className="shrink-0 text-[18px] text-emerald-600" /><span className="min-w-0 flex-1 truncate text-xs text-slate-500">{check.label}</span><DashboardStatus label={check.status} tone={check.tone} /></div>)}
          </div>
        </DashboardPanel>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <DashboardPanel title="Distribución de costos" subtitle="Por categoría de servicio" action={<button type="button" aria-label="Más opciones de costos" className="inline-flex rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"><Icon name="more_horiz" className="text-[19px]" /></button>}>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative size-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={costDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="none">{costDistribution.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Pie><Tooltip formatter={(value) => [`$${value}`, 'Mensual']} /></PieChart></ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><strong className="text-xl font-bold tracking-[-0.04em] text-slate-800">${monthlyTotal}</strong><span className="text-[10px] text-slate-400">mensual</span></div>
            </div>
            <div className="flex w-full flex-1 flex-col gap-3">
              {costDistribution.map((entry) => <div className="flex items-center justify-between gap-4 text-xs text-slate-500" key={entry.name}><span className="inline-flex items-center gap-2"><i className="size-2 rounded-full" style={{ backgroundColor: entry.fill }} />{entry.name}</span><strong className="text-sm text-slate-800">${entry.value}</strong></div>)}
            </div>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Servicios principales" subtitle="Componentes activos en la solución" action={<button type="button" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">Ver catálogo <Icon name="arrow_forward" className="text-[16px]" /></button>}>
          <div>{services.slice(0, 4).map((service) => <ServiceRow service={service} key={service.id} />)}</div>
        </DashboardPanel>
      </div>

      <DashboardPanel title="Estado de la arquitectura" subtitle="Resumen operativo de la solución Cloud" action={<DashboardStatus label="Operativa" tone="success" />}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><Icon name="monitor_heart" className="text-[20px]" /></div><div><strong className="block text-sm font-bold text-slate-800">Disponibilidad</strong><span className="text-xs text-slate-500">99.98% SLA cumplido</span></div></div>
          <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600"><Icon name="hub" className="text-[20px]" /></div><div><strong className="block text-sm font-bold text-slate-800">Red operativa</strong><span className="text-xs text-slate-500">VPC y rutas configuradas</span></div></div>
          <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-4"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600"><Icon name="backup" className="text-[20px]" /></div><div><strong className="block text-sm font-bold text-slate-800">Continuidad</strong><span className="text-xs text-slate-500">1 recomendación pendiente</span></div></div>
        </div>
      </DashboardPanel>

      <section>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Catálogo rápido</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-slate-800">Servicios utilizados</h2></div>
          <button type="button" className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:self-auto">Ver todos <Icon name="arrow_forward" className="text-[16px]" /></button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {services.slice(0, 4).map((service) => {
            const iconTone = service.iconTone === 'warning' ? 'bg-amber-50 text-amber-600' : service.iconTone === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
            return <article className="group flex min-h-[190px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(37,99,235,0.09)]" key={service.id}><div className="flex items-start justify-between gap-3"><div className={`flex size-11 items-center justify-center rounded-xl ${iconTone}`}><Icon name={service.icon} className="text-[21px]" /></div><DashboardStatus label={service.status} tone={service.status === 'En uso' ? 'success' : 'neutral'} /></div><h3 className="mt-4 text-base font-bold text-slate-800">{service.name}</h3><span className="mt-1 text-xs text-slate-400">{service.category}</span><p className="mt-3 flex-1 text-sm leading-5 text-slate-500">{service.description}</p><div className="mt-4 border-t border-slate-100 pt-3"><span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Uso principal</span><strong className="mt-1 block text-xs font-semibold text-slate-600">{service.purpose}</strong></div></article>
          })}
        </div>
      </section>
    </div>
  )
}
