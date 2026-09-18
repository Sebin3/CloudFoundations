import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Icon } from '../components/Icon'
import { RegionCard } from '../components/RegionCard'
import { regions } from '../data/cloudData'

type ConsoleView = 'summary' | 'resources' | 'monitoring'
type Region = (typeof regions)[number]

type InfraResource = {
  id: string
  name: string
  service: string
  zone: string
  state: string
  metric: string
  icon: string
}

const toneStyles = {
  success: { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  warning: { badge: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  danger: { badge: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
} as const

const mapPositions: Record<string, { left: string; top: string }> = {
  'us-east-1': { left: '25%', top: '39%' },
  'eu-west-1': { left: '48%', top: '32%' },
  'sa-east-1': { left: '36%', top: '69%' },
}

const serviceNames: Record<string, string> = {
  EC2: 'Amazon EC2', S3: 'Amazon S3', RDS: 'Amazon RDS', VPC: 'Amazon VPC', CloudFront: 'Amazon CloudFront',
}

function StatusPill({ region }: { region: Region }) {
  const style = toneStyles[region.tone as keyof typeof toneStyles]
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${style.badge}`}><span className={`size-1.5 rounded-full ${style.dot}`} />{region.status}</span>
}

function MetricCard({ label, value, detail, icon, tone = 'blue' }: { label: string; value: string; detail: string; icon: string; tone?: 'blue' | 'green' | 'amber' }) {
  const iconStyle = tone === 'green' ? 'bg-emerald-50 text-emerald-600' : tone === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
  return <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{label}</p><strong className="mt-2 block text-2xl font-extrabold tracking-[-0.04em] text-slate-800">{value}</strong><p className="mt-1 text-xs text-slate-500">{detail}</p></div><div className={`flex size-10 items-center justify-center rounded-xl ${iconStyle}`}><Icon name={icon} className="text-[20px]" /></div></div></article>
}

function WorldMap({ selectedCode, onSelect }: { selectedCode: string; onSelect: (code: string) => void }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-lg font-bold tracking-[-0.02em] text-slate-800">Mapa de regiones activas</h3><p className="mt-1 text-sm text-slate-500">Selecciona una ubicación para consultar su despliegue.</p></div><span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700"><Icon name="public" className="text-[15px]" />Cobertura global</span></div>
      <div className="relative min-h-[360px] overflow-hidden bg-[#f8fafc] sm:min-h-[390px]">
        <svg viewBox="0 0 900 440" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs><pattern id="mapGrid" width="45" height="45" patternUnits="userSpaceOnUse"><path d="M45 0H0V45" fill="none" stroke="#e2e8f0" strokeWidth="1" /></pattern><linearGradient id="ocean" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#f8fafc" /><stop offset="1" stopColor="#eff6ff" /></linearGradient></defs>
          <rect width="900" height="440" fill="url(#ocean)" /><rect width="900" height="440" fill="url(#mapGrid)" opacity=".55" />
          <g fill="#dbe4ef" stroke="#cbd5e1" strokeWidth="2">
            <path d="M62 96 104 57l79-15 52 20 35 40-16 30-40 5-21 32-32 9-17 45-31-7-7-40-38-30Z" />
            <path d="m223 205 46 20 25 46-8 47-29 69-23-13-5-53-20-45Z" />
            <path d="m407 78 35-18 48 12 15 22-19 17-34-3-13 20-29-7Z" />
            <path d="m424 144 64-14 42 36-7 72-39 86-38-26-17-66-28-39Z" />
            <path d="m493 82 84-47 124 11 84 37 58 56-20 37-68-4-36 31-68-9-51-33-54 2-36-31Z" />
            <path d="m708 284 69-16 43 34-20 43-61 7-39-29Z" />
            <path d="m324 107 23-11 27 7-7 17-31 3Z" />
          </g>
          <g fill="none" stroke="#93c5fd" strokeDasharray="6 8" strokeWidth="2" opacity=".75"><path d="M226 169Q342 87 447 143" /><path d="M447 143Q388 244 317 296" /><path d="M226 169Q232 246 317 296" /></g>
        </svg>
        {regions.map((region) => {
          const position = mapPositions[region.code]
          const selected = region.code === selectedCode
          return <button type="button" key={region.code} onClick={() => onSelect(region.code)} style={position} aria-label={`Seleccionar región ${region.name}`} className="group absolute -translate-x-1/2 -translate-y-1/2 text-left"><span className={`absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/15 ${selected ? 'animate-ping' : 'opacity-0 group-hover:opacity-100'}`} /><span className={`relative flex size-8 items-center justify-center rounded-full border-[3px] border-white shadow-lg transition ${selected ? 'scale-110 bg-blue-600 text-white ring-4 ring-blue-200' : region.tone === 'warning' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white group-hover:bg-blue-600'}`}><span className="text-[15px]">{region.flag}</span></span><span className={`absolute left-1/2 top-10 w-max -translate-x-1/2 rounded-lg border bg-white px-2.5 py-1.5 text-center shadow-md transition ${selected ? 'border-blue-200 opacity-100' : 'border-slate-200 opacity-0 group-hover:opacity-100'}`}><strong className="block text-[10px] text-slate-800">{region.code}</strong><span className="block text-[9px] text-slate-500">{region.flag} {region.location}</span></span></button>
        })}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-[10px] font-bold text-slate-500 shadow-sm backdrop-blur"><span className="inline-flex items-center gap-1.5"><i className="size-2 rounded-full bg-emerald-500" />Operativa</span><span className="inline-flex items-center gap-1.5"><i className="size-2 rounded-full bg-amber-500" />Revisión</span><span>{regions.length} regiones desplegadas</span></div>
      </div>
    </section>
  )
}

function buildResources(region: Region): InfraResource[] {
  const suffix = region.code.replaceAll('-', '').slice(-5)
  const all: InfraResource[] = [
    { id: `i-${suffix}01`, name: 'app-server-01', service: 'EC2', zone: `${region.code}a`, state: 'En ejecución', metric: 'CPU 38%', icon: 'dns' },
    { id: `i-${suffix}02`, name: 'app-server-02', service: 'EC2', zone: `${region.code}b`, state: 'En ejecución', metric: 'CPU 24%', icon: 'dns' },
    { id: `db-${suffix}01`, name: 'cloudops-production', service: 'RDS', zone: `${region.code}a`, state: 'Disponible', metric: '64 conexiones', icon: 'storage' },
    { id: `bucket-${suffix}`, name: 'cloudops-assets', service: 'S3', zone: 'Regional', state: 'Activo', metric: '18.4 GB', icon: 'database' },
    { id: `vpc-${suffix}`, name: 'production-vpc', service: 'VPC', zone: region.code, state: 'Disponible', metric: '2 subredes', icon: 'hub' },
    { id: `dist-${suffix}`, name: 'web-distribution', service: 'CloudFront', zone: 'Global', state: 'Desplegado', metric: '42 ms', icon: 'public' },
  ]
  return all.filter((resource) => region.services.includes(resource.service))
}

function LiveMonitoring({ region }: { region: Region }) {
  const [running, setRunning] = useState(true)
  const [samples, setSamples] = useState(() => Array.from({ length: 22 }, (_, index) => ({ sample: index + 1, inbound: 18 + ((index * 7) % 26), outbound: 8 + ((index * 5) % 14), latency: 32 + ((index * 3) % 16) })))

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setSamples((current) => {
        const previous = current[current.length - 1]
        const jitter = Math.round(Math.random() * 12) - 6
        const next = { sample: previous.sample + 1, inbound: Math.max(8, Math.min(72, previous.inbound + jitter)), outbound: Math.max(4, Math.min(38, previous.outbound + Math.round(jitter / 2))), latency: Math.max(20, Math.min(75, 38 + Math.round(Math.random() * 18))) }
        return [...current.slice(-21), next]
      })
    }, 1100)
    return () => window.clearInterval(timer)
  }, [running])

  const latest = samples[samples.length - 1]
  return <div className="p-4 sm:p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><h4 className="text-sm font-extrabold text-slate-800">Tráfico de red</h4><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700"><span className={`size-1.5 rounded-full bg-emerald-500 ${running ? 'animate-pulse' : ''}`} />{running ? 'EN VIVO' : 'PAUSADO'}</span></div><p className="mt-1 text-xs text-slate-500">Telemetría simulada · {region.code} · actualización cada segundo</p></div><button type="button" onClick={() => setRunning((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Icon name={running ? 'remove' : 'add'} className="text-[15px]" />{running ? 'Pausar' : 'Reanudar'}</button></div>
    <div className="mt-4 grid gap-2 sm:grid-cols-3"><div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3"><span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-blue-500">Entrada</span><strong className="mt-1 block text-xl text-slate-800">{latest.inbound} <small className="text-xs font-bold text-slate-400">Mbps</small></strong></div><div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-3"><span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-cyan-600">Salida</span><strong className="mt-1 block text-xl text-slate-800">{latest.outbound} <small className="text-xs font-bold text-slate-400">Mbps</small></strong></div><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-400">Latencia</span><strong className="mt-1 block text-xl text-slate-800">{latest.latency} <small className="text-xs font-bold text-slate-400">ms</small></strong></div></div>
    <div className="mt-4 h-[260px] rounded-xl border border-slate-200 bg-slate-50/60 p-2"><ResponsiveContainer width="100%" height="100%"><AreaChart data={samples} margin={{ top: 12, right: 10, left: -22, bottom: 0 }}><defs><linearGradient id="networkFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity=".28" /><stop offset="100%" stopColor="#2563eb" stopOpacity=".02" /></linearGradient></defs><CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" /><XAxis dataKey="sample" hide /><YAxis yAxisId="traffic" domain={[0, 80]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9 }} /><YAxis yAxisId="latency" orientation="right" domain={[0, 90]} hide /><Tooltip formatter={(value, name) => [`${value} ${name === 'latency' ? 'ms' : 'Mbps'}`, name === 'inbound' ? 'Entrada' : name === 'outbound' ? 'Salida' : 'Latencia']} labelFormatter={() => 'Ahora'} /><Area yAxisId="traffic" type="monotone" dataKey="inbound" stroke="#2563eb" strokeWidth={2.5} fill="url(#networkFill)" isAnimationActive={false} /><Line yAxisId="traffic" type="monotone" dataKey="outbound" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} /><Line yAxisId="latency" type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 4" dot={false} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div>
    <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500"><span className="inline-flex items-center gap-1.5"><i className="h-0.5 w-4 bg-blue-600" />Entrada</span><span className="inline-flex items-center gap-1.5"><i className="h-0.5 w-4 bg-cyan-500" />Salida</span><span className="inline-flex items-center gap-1.5"><i className="h-0.5 w-4 border-t-2 border-dashed border-amber-500" />Latencia</span></div>
  </div>
}

function InfrastructureConsole({ selectedRegion, onSelectRegion }: { selectedRegion: Region; onSelectRegion: (code: string) => void }) {
  const [view, setView] = useState<ConsoleView>('summary')
  const [search, setSearch] = useState('')
  const resources = buildResources(selectedRegion)
  const filtered = resources.filter((resource) => `${resource.name} ${resource.service} ${resource.id}`.toLowerCase().includes(search.toLowerCase()))

  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)]"><div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-700"><Icon name="monitoring" className="text-[18px]" /></div><div><div className="flex items-center gap-2"><p className="text-xs font-extrabold text-slate-800">Consola de producción</p><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">OPERATIVA</span></div><p className="mt-0.5 text-[10px] text-slate-500">Cuenta CloudOps · actualización automática</p></div></div><label className="flex items-center gap-2"><span className="text-[10px] font-bold text-slate-500">Región</span><select value={selectedRegion.code} onChange={(event) => onSelectRegion(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100">{regions.map((region) => <option key={region.code} value={region.code}>{region.code} · {region.location}</option>)}</select></label></div>
    <div className="flex border-b border-slate-200 px-2">{([{ id: 'summary', label: 'Resumen', icon: 'dashboard' }, { id: 'resources', label: 'Recursos', icon: 'dns' }, { id: 'monitoring', label: 'Monitoreo en vivo', icon: 'monitoring' }] as Array<{ id: ConsoleView; label: string; icon: string }>).map((item) => <button type="button" key={item.id} onClick={() => setView(item.id)} className={`inline-flex flex-1 items-center justify-center gap-2 border-b-2 px-2 py-3 text-[11px] font-bold transition sm:text-xs ${view === item.id ? 'border-orange-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Icon name={item.icon} className="text-[16px]" />{item.label}</button>)}</div>
    {view === 'summary' && <div className="p-4 sm:p-5"><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 p-3"><span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-400">Salud</span><strong className="mt-1.5 block text-xl text-slate-800">{resources.length}/{resources.length}</strong><p className="mt-1 text-[11px] text-emerald-700">Recursos disponibles</p></div><div className="rounded-xl border border-slate-200 p-3"><span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-400">Disponibilidad</span><strong className="mt-1.5 block text-xl text-slate-800">{selectedRegion.availability}</strong><p className="mt-1 text-[11px] text-slate-500">Últimos 30 días</p></div><div className="rounded-xl border border-slate-200 p-3"><span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-400">Alarmas</span><strong className="mt-1.5 block text-xl text-amber-600">{selectedRegion.tone === 'warning' ? '1' : '0'}</strong><p className="mt-1 text-[11px] text-slate-500">Requieren atención</p></div></div><div className="mt-4"><div className="flex items-center justify-between"><h4 className="text-xs font-extrabold text-slate-800">Servicios desplegados</h4><button type="button" onClick={() => setView('resources')} className="text-[11px] font-bold text-blue-600">Ver recursos</button></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{selectedRegion.services.map((service) => <div key={service} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"><div className="flex size-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm"><Icon name={service === 'S3' ? 'database' : service === 'RDS' ? 'storage' : service === 'VPC' ? 'hub' : service === 'CloudFront' ? 'public' : 'dns'} className="text-[16px]" /></div><span className="min-w-0 flex-1 truncate text-xs font-bold text-slate-700">{serviceNames[service]}</span><span className="size-2 rounded-full bg-emerald-500" /></div>)}</div></div></div>}
    {view === 'resources' && <div><div className="flex flex-col gap-2 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="relative min-w-0 flex-1"><Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, ID o servicio" className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" /></div><span className="text-[10px] font-bold text-slate-500">{filtered.length} recursos</span></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="border-b border-slate-200 bg-slate-50 text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-500"><tr><th className="px-4 py-3">Recurso</th><th className="px-3 py-3">Servicio</th><th className="px-3 py-3">Zona</th><th className="px-3 py-3">Estado</th><th className="px-4 py-3 text-right">Métrica</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((resource) => <tr key={resource.id} className="text-xs hover:bg-orange-50/40"><td className="px-4 py-3"><div className="flex items-center gap-2"><div className="flex size-7 items-center justify-center rounded-md bg-orange-50 text-orange-600"><Icon name={resource.icon} className="text-[15px]" /></div><div><strong className="block text-slate-700">{resource.name}</strong><span className="font-mono text-[9px] text-slate-400">{resource.id}</span></div></div></td><td className="px-3 py-3 font-bold text-slate-600">{resource.service}</td><td className="px-3 py-3 text-slate-500">{resource.zone}</td><td className="px-3 py-3"><span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" />{resource.state}</span></td><td className="px-4 py-3 text-right font-bold text-slate-600">{resource.metric}</td></tr>)}</tbody></table></div></div>}
    {view === 'monitoring' && <LiveMonitoring region={selectedRegion} />}
  </section>
}

export function Infrastructure() {
  const [selectedCode, setSelectedCode] = useState(regions[0].code)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const selectedRegion = useMemo(() => regions.find((region) => region.code === selectedCode) ?? regions[0], [selectedCode])
  const totalResources = regions.reduce((total, region) => total + region.resources, 0)
  const deployedServices = new Set(regions.flatMap((region) => region.services)).size

  const refresh = () => {
    setIsRefreshing(true)
    window.setTimeout(() => setIsRefreshing(false), 650)
  }

  return <div className="flex flex-col gap-6"><header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-600">Infraestructura Global</p><h2 className="mt-1 text-3xl font-bold tracking-[-0.045em] text-slate-800 sm:text-[32px]">Regiones y recursos</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Supervisa la ubicación, disponibilidad y telemetría de la solución desde una vista operativa.</p></div><button type="button" onClick={refresh} disabled={isRefreshing} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-70 sm:w-auto"><Icon name="sync" className={`text-[18px] ${isRefreshing ? 'animate-spin' : ''}`} />{isRefreshing ? 'Sincronizando...' : 'Actualizar estado'}</button></header>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Regiones activas" value={`${regions.length}`} detail="Ubicaciones configuradas" icon="public" /><MetricCard label="Recursos Cloud" value={`${totalResources}`} detail="Distribuidos globalmente" icon="hub" tone="green" /><MetricCard label="Servicios" value={`${deployedServices}`} detail="Componentes desplegados" icon="apps" tone="amber" /><MetricCard label="Estado global" value="Operativa" detail="Sin incidentes críticos" icon="check_circle" tone="green" /></div>
    <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,.7fr)]"><WorldMap selectedCode={selectedCode} onSelect={setSelectedCode} /><aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.05)]"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">Región seleccionada</p><h3 className="mt-1.5 text-xl font-bold text-slate-800">{selectedRegion.code}</h3></div><StatusPill region={selectedRegion} /></div><div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4"><div className="flex items-start gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm text-xl">{selectedRegion.flag}</div><div><h4 className="text-sm font-bold text-slate-800">{selectedRegion.name}</h4><p className="mt-1 text-xs text-slate-500">{selectedRegion.flag} {selectedRegion.location}</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-lg bg-white p-3"><span className="text-[9px] font-bold uppercase text-slate-400">Recursos</span><strong className="mt-1 block text-lg text-slate-800">{selectedRegion.resources}</strong></div><div className="rounded-lg bg-white p-3"><span className="text-[9px] font-bold uppercase text-slate-400">SLA</span><strong className="mt-1 block text-lg text-slate-800">{selectedRegion.availability}</strong></div></div></div><div className="mt-4"><p className="text-xs font-bold text-slate-700">Servicios activos</p><div className="mt-2 flex flex-wrap gap-2">{selectedRegion.services.map((service) => <span key={service} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600">{service}</span>)}</div></div><div className="mt-5 border-t border-slate-100 pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Cambiar región</p><div className="mt-3 space-y-2">{regions.filter((region) => region.code !== selectedRegion.code).map((region) => <button type="button" key={region.code} onClick={() => setSelectedCode(region.code)} className="flex w-full items-center gap-3 rounded-lg border border-slate-100 p-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50/50"><span className="size-2 rounded-full bg-emerald-500" /><span className="min-w-0 flex-1"><strong className="block text-xs text-slate-700">{region.code}</strong><span className="text-[10px] text-slate-400">{region.location}</span></span><Icon name="arrow_forward" className="text-[14px] text-slate-400" /></button>)}</div></div></aside></div>
    <InfrastructureConsole selectedRegion={selectedRegion} onSelectRegion={setSelectedCode} />
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div><h3 className="text-lg font-bold text-slate-800">Estado por región</h3><p className="mt-1 text-sm text-slate-500">Resumen rápido de disponibilidad y servicios.</p></div><div className="mt-4 grid gap-3 md:grid-cols-3">{regions.map((region) => <RegionCard key={region.code} region={region} selected={region.code === selectedCode} onSelect={() => setSelectedCode(region.code)} />)}</div></section>
  </div>
}
