import type { RouteKey } from '../types/cloud'
import { Icon } from './Icon'
import { Sheet, SheetClose, SheetContent } from './ui/sheet'

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
    ? 'border-l-2 border-blue-400 bg-slate-800/90 pl-[10px] text-white shadow-[0_4px_12px_rgba(2,6,23,0.14)] hover:bg-slate-800'
    : 'border-l-2 border-transparent text-slate-300 hover:bg-slate-800/70 hover:text-white'

  return (
    <button
      type="button"
      className={`group flex w-full items-center gap-3 rounded-lg bg-transparent px-3 py-2.5 text-left text-[13px] font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200 ${itemClassName}`}
      aria-current={active ? 'page' : undefined}
      onClick={() => onNavigate(item.route)}
    >
      <Icon name={item.icon} className={`text-[19px] ${active ? 'text-blue-400' : 'text-slate-500 transition-colors group-hover:text-slate-300'}`} />
      <span>{item.label}</span>
    </button>
  )
}

function SidebarContent({ route, onNavigate, mobile }: { route: RouteKey; onNavigate: (route: RouteKey) => void; mobile?: boolean }) {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 pb-5 pt-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-950/30">
          <Icon name="cloud" filled className="text-[21px]" />
        </div>
        <div className="min-w-0">
          <p className="sidebar-brand-name m-0 text-[16px] font-extrabold tracking-[-0.02em]">CloudOps</p>
          <p className="m-0 mt-0.5 text-[8px] font-extrabold tracking-[0.15em] text-slate-400">FOUNDATIONS</p>
        </div>
        {mobile && <SheetClose asChild><button type="button" className="ml-auto inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" aria-label="Cerrar menú"><Icon name="close" className="text-[20px]" /></button></SheetClose>}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6 pt-5" aria-label="Navegación principal">
        <p className="mb-3 px-2 text-[9px] font-extrabold tracking-[0.18em] text-slate-500">OPERACIONES</p>
        <div className="space-y-0.5">
          {primaryItems.map((item) => <NavItem key={item.route} item={item} active={route === item.route} onNavigate={onNavigate} />)}
        </div>
        <p className="mb-3 mt-8 px-2 text-[9px] font-extrabold tracking-[0.18em] text-slate-500">ARQUITECTURA</p>
        <div className="space-y-0.5">
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
          <button type="button" className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white" aria-label="Abrir opciones de usuario"><Icon name="more_vert" className="text-[18px]" /></button>
        </div>
      </div>
    </>
  )
}

export function Sidebar({ route, onNavigate, mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="sidebar-shell fixed inset-y-0 left-0 z-30 hidden w-[258px] flex-col border-r text-slate-200 shadow-[8px_0_24px_rgba(2,6,23,0.28)] min-[861px]:flex">
        <SidebarContent route={route} onNavigate={onNavigate} />
      </aside>
      <Sheet open={mobileOpen} onOpenChange={(open) => { if (!open) onClose() }}>
        <SheetContent side="left" showCloseButton={false} className="sidebar-shell w-[258px] border-r border-slate-800 bg-slate-900 p-0 text-slate-200 min-[861px]:hidden">
          <SidebarContent route={route} onNavigate={onNavigate} mobile />
        </SheetContent>
      </Sheet>
    </>
  )
}
