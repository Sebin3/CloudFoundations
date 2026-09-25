import { useState } from 'react'

type NodeKey = 'internet' | 'route53' | 'cloudfront' | 'vpc' | 'ec2' | 'rds'

type ArchitectureNode = {
  title: string
  layer: string
  mark: string
  subtitle: string
  purpose: string
  endpoint: string
  address: string
  latency: string
  tone: 'blue' | 'orange' | 'violet' | 'green'
}

const nodes: Record<NodeKey, ArchitectureNode> = {
  internet: { title: 'Internet', layer: 'Origen público', mark: 'NET', subtitle: 'Usuarios globales', purpose: 'Punto de origen del tráfico HTTPS de la aplicación.', endpoint: 'Usuarios globales', address: '0.0.0.0/0', latency: '—', tone: 'blue' },
  route53: { title: 'Route 53', layer: 'DNS administrado', mark: 'DNS', subtitle: 'Resolución de dominio', purpose: 'Resuelve el dominio público y dirige las solicitudes al CDN.', endpoint: 'app.cloudops.com', address: 'Alias A/AAAA', latency: '24 ms', tone: 'blue' },
  cloudfront: { title: 'CloudFront', layer: 'Edge / CDN', mark: 'CDN', subtitle: 'Distribución global', purpose: 'Entrega contenido desde ubicaciones de borde y protege el origen.', endpoint: 'd2x-cloudfront.net', address: 'HTTPS · TLS 1.3', latency: '11 ms', tone: 'orange' },
  vpc: { title: 'VPC producción', layer: 'Red privada', mark: 'VPC', subtitle: 'Segmentación de red', purpose: 'Aísla los recursos de aplicación y datos en subredes controladas.', endpoint: 'production-vpc', address: '10.0.0.0/16', latency: '2 ms', tone: 'violet' },
  ec2: { title: 'EC2', layer: 'Capa de aplicación', mark: 'EC2', subtitle: 'Procesamiento', purpose: 'Procesa las solicitudes y ejecuta la aplicación.', endpoint: 'app-server-asg', address: '10.0.1.0/24', latency: '4 ms', tone: 'green' },
  rds: { title: 'RDS', layer: 'Capa de datos', mark: 'RDS', subtitle: 'Persistencia', purpose: 'Mantiene los datos transaccionales en una subred privada.', endpoint: 'cloudops-production', address: '10.0.2.0/24', latency: '7 ms', tone: 'green' },
}

const toneClasses: Record<ArchitectureNode['tone'], { badge: string; border: string; selected: string }> = {
  blue: { badge: 'border-blue-200 bg-blue-50 text-blue-700', border: 'border-blue-200', selected: 'ring-blue-200' },
  orange: { badge: 'border-orange-200 bg-orange-50 text-orange-700', border: 'border-orange-200', selected: 'ring-orange-200' },
  violet: { badge: 'border-violet-200 bg-violet-50 text-violet-700', border: 'border-violet-200', selected: 'ring-violet-200' },
  green: { badge: 'border-emerald-200 bg-emerald-50 text-emerald-700', border: 'border-emerald-200', selected: 'ring-emerald-200' },
}

function DiagramNode({ nodeKey, selected, onSelect, compact = false }: { nodeKey: NodeKey; selected: boolean; onSelect: () => void; compact?: boolean }) {
  const node = nodes[nodeKey]
  const tone = toneClasses[node.tone]
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`group flex items-center gap-3 rounded-2xl border bg-white p-3 text-left shadow-[0_5px_16px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(15,23,42,0.09)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 ${compact ? 'min-h-[72px] w-full' : 'mx-auto min-h-[76px] w-full max-w-[320px]'} ${selected ? `${tone.border} ring-4 ${tone.selected}` : 'border-slate-200'}`}
    >
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl border text-[10px] font-black tracking-[-0.04em] ${tone.badge}`}>
        {node.mark}
      </span>
      <span className="min-w-0 flex-1">
        <strong className="block text-sm font-extrabold text-slate-800">{node.title}</strong>
        <span className="mt-0.5 block truncate text-[11px] text-slate-500">{node.subtitle}</span>
      </span>
      <span className={`size-2 shrink-0 rounded-full ${selected ? 'bg-orange-500' : 'bg-slate-200 group-hover:bg-orange-300'}`} />
    </button>
  )
}

function VerticalConnector() {
  return (
    <div className="flex h-8 flex-col items-center justify-center" aria-hidden="true">
      <span className="h-5 w-px bg-slate-200" />
      <span className="-mt-1 size-1.5 rotate-45 border-b border-r border-slate-300" />
    </div>
  )
}

function SelectedNodeDetails({ node }: { node: ArchitectureNode }) {
  return (
    <section className="min-w-0 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-5 min-[861px]:sticky min-[861px]:top-24">
      <div className="flex items-start gap-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border text-[10px] font-black ${toneClasses[node.tone].badge}`}>
          {node.mark}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">Componente seleccionado</p>
          <h3 className="mt-1 text-lg font-bold text-slate-800">{node.title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{node.layer}</p>
        </div>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500" />Activo
        </span>
      </div>

      <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">{node.purpose}</p>

      <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 min-[861px]:grid-cols-1">
        <div className="rounded-xl border border-slate-100 p-3">
          <dt className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-400">Endpoint</dt>
          <dd className="mt-1 truncate text-xs font-bold text-slate-700">{node.endpoint}</dd>
        </div>
        <div className="rounded-xl border border-slate-100 p-3">
          <dt className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-400">Dirección</dt>
          <dd className="mt-1 truncate font-mono text-[11px] font-bold text-slate-700">{node.address}</dd>
        </div>
        <div className="rounded-xl border border-slate-100 p-3">
          <dt className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-slate-400">Latencia</dt>
          <dd className="mt-1 text-xs font-bold text-slate-700">{node.latency}</dd>
        </div>
      </dl>
    </section>
  )
}

export function Network() {
  const [selectedKey, setSelectedKey] = useState<NodeKey>('vpc')
  const selectedNode = nodes[selectedKey]
  const selectNode = (nodeKey: NodeKey) => setSelectedKey(nodeKey)

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-orange-600">Arquitectura de red</p>
        <h2 className="mt-1 text-3xl font-bold tracking-[-0.045em] text-slate-800 sm:text-[32px]">Flujo de conectividad</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Selecciona cualquier componente del diagrama para consultar su función y configuración.</p>
      </header>

      <section className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_36px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Arquitectura de producción</h3>
            <p className="mt-1 text-sm text-slate-500">Internet → Route 53 → CloudFront → VPC → EC2/RDS</p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />Operativa
          </span>
        </div>

        <div className="mt-6 grid items-start gap-6 min-[861px]:grid-cols-[minmax(0,1.25fr)_minmax(220px,.9fr)] min-[861px]:justify-center">
          <div className="min-w-0 mx-auto w-full max-w-[420px] rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3 px-1">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-400">Flujo de entrada</p>
                <p className="mt-1 text-xs font-semibold text-slate-600">Servicios públicos hacia la red privada</p>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-500">HTTPS</span>
            </div>
            <DiagramNode nodeKey="internet" selected={selectedKey === 'internet'} onSelect={() => selectNode('internet')} />
            <VerticalConnector />
            <DiagramNode nodeKey="route53" selected={selectedKey === 'route53'} onSelect={() => selectNode('route53')} />
            <VerticalConnector />
            <DiagramNode nodeKey="cloudfront" selected={selectedKey === 'cloudfront'} onSelect={() => selectNode('cloudfront')} />
            <VerticalConnector />
            <div className="mx-auto w-full max-w-[380px] rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/35 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-violet-600">Red privada</p>
                  <h3 className="mt-1 text-sm font-extrabold text-slate-800">VPC producción</h3>
                </div>
                <span className="rounded-lg border border-violet-200 bg-white px-2 py-1 font-mono text-[10px] font-bold text-violet-700">10.0.0.0/16</span>
              </div>
              <DiagramNode nodeKey="vpc" selected={selectedKey === 'vpc'} onSelect={() => selectNode('vpc')} />
              <VerticalConnector />
              <div className="grid gap-3 sm:grid-cols-2">
                <DiagramNode nodeKey="ec2" compact selected={selectedKey === 'ec2'} onSelect={() => selectNode('ec2')} />
                <DiagramNode nodeKey="rds" compact selected={selectedKey === 'rds'} onSelect={() => selectNode('rds')} />
              </div>
            </div>
          </div>

          <SelectedNodeDetails node={selectedNode} />
        </div>
      </section>
    </div>
  )
}
