import type { RouteKey } from '../types/cloud'
import { Icon } from './Icon'

type SidebarProps = {
  route: RouteKey
  onNavigate: (route: RouteKey) => void
  mobileOpen: boolean
  onClose: () => void
}

const primaryItems: { route: RouteKey; label: string; icon: string }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { route: 'planning', label: 'Planificación Cloud', icon: 'edit_note' },
  { route: 'costs', label: 'Costos', icon: 'payments' },
  { route: 'infrastructure', label: 'Infraestructura global', icon: 'public' },
]

const architectureItems: { route: RouteKey; label: string; icon: string }[] = [
  { route: 'security', label: 'Seguridad', icon: 'shield' },
  { route: 'network', label: 'Arquitectura de red', icon: 'account_tree' },
  { route: 'services', label: 'Servicios AWS', icon: 'apps' },
]

function NavItem({ item, active, onNavigate }: { item: (typeof primaryItems)[number]; active: boolean; onNavigate: (route: RouteKey) => void }) {
  const itemClassName = active
    ? 'bg-slate-800 text-white shadow-[0_1px_2px_rgba(2,6,23,0.22),0_4px_12px_rgba(2,6,23,0.16)] ring-1 ring-slate-700'
    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'

  return (
    <button
      className={`group flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200 ${itemClassName}`}
      aria-current={active ? 'page' : undefined}
      onClick={() => onNavigate(item.route)}
    >
      <Icon name={item.icon} className={`text-[19px] ${active ? 'text-blue-400' : 'text-slate-500 transition-colors group-hover:text-slate-300'}`} />
      <span>{item.label}</span>
    </button>
  )
}

export function Sidebar({ route, onNavigate, mobileOpen, onClose }: SidebarProps) {
  const sidebarPosition = mobileOpen ? 'translate-x-0' : '-translate-x-full min-[861px]:translate-x-0'

  return (
    <>
      {mobileOpen && <button className="fixed inset-0 z-20 bg-slate-950/40 min-[861px]:hidden" aria-label="Cerrar menú" onClick={onClose} />}
      <aside className={`sidebar-shell fixed inset-y-0 left-0 z-30 flex w-[258px] flex-col border-r text-slate-200 shadow-[8px_0_24px_rgba(2,6,23,0.28)] transition-transform duration-200 ease-out ${sidebarPosition}`}>
        <div className="flex items-center gap-3 px-5 pb-5 pt-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-950/30">
            <Icon name="cloud" filled className="text-[21px]" />
          </div>
          <div className="min-w-0">
            <p className="sidebar-brand-name m-0 text-[16px] font-extrabold tracking-[-0.02em]">CloudOps</p>
            <p className="m-0 mt-0.5 text-[8px] font-extrabold tracking-[0.15em] text-slate-400">FOUNDATIONS</p>
          </div>
          <button className="ml-auto inline-flex rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white min-[861px]:hidden" onClick={onClose} aria-label="Cerrar menú"><Icon name="close" className="text-[20px]" /></button>
        </div>

        <div className="sidebar-workspace mx-4 mb-6 flex items-center gap-2.5 rounded-xl border px-3 py-2.5 shadow-sm">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-extrabold text-white">N</div>
          <div className="min-w-0 flex-1">
            <span className="sidebar-workspace-name block truncate text-[12px] font-bold">Nova Systems</span>
            <small className="mt-0.5 block truncate text-[9px] text-slate-400">Workspace principal</small>
          </div>
          <Icon name="unfold_more" className="text-[18px] text-slate-400" />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Navegación principal">
          <p className="mb-2 px-2 text-[10px] font-extrabold tracking-[0.14em] text-slate-500">OPERACIONES</p>
          <div className="space-y-1">
            {primaryItems.map((item) => <NavItem key={item.route} item={item} active={route === item.route} onNavigate={onNavigate} />)}
          </div>
          <p className="mb-2 mt-7 px-2 text-[10px] font-extrabold tracking-[0.14em] text-slate-500">ARQUITECTURA</p>
          <div className="space-y-1">
            {architectureItems.map((item) => <NavItem key={item.route} item={item} active={route === item.route} onNavigate={onNavigate} />)}
          </div>
        </nav>

        <div className="sidebar-divider mt-auto border-t px-4 pb-4 pt-4">
          <div className="sidebar-help mb-4 flex items-center gap-2.5 rounded-xl border p-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300"><Icon name="support_agent" className="text-[17px]" /></div>
            <div className="min-w-0 flex-1"><strong className="block text-[11px] font-bold">¿Necesitas ayuda?</strong><span className="mt-0.5 block truncate text-[10px]">Consulta la guía Cloud</span></div>
            <Icon name="arrow_forward" className="text-[16px] text-slate-400" />
          </div>
          <div className="sidebar-divider flex items-center gap-2.5 border-t pt-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-extrabold text-white">AT</div>
            <div className="min-w-0 flex-1"><strong className="sidebar-user-name block truncate text-[12px] font-bold">Alex Torres</strong><span className="sidebar-user-role mt-0.5 block text-[10px]">Administrador</span></div>
            <button className="inline-flex rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" aria-label="Abrir opciones de usuario"><Icon name="more_vert" className="text-[18px]" /></button>
          </div>
        </div>
      </aside>
    </>
  )
}
