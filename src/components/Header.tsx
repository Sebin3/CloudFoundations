import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { regions } from '../data/cloudData'
import type { RouteKey } from '../types/cloud'
import { Icon } from './Icon'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type HeaderProps = {
  route: RouteKey
  title: string
  onOpenSidebar: () => void
  selectedRegion: string
  onRegionChange: (region: string) => void
}

const labels: Record<RouteKey, string> = {
  dashboard: 'Resumen general',
  planning: 'Definición de solución', 
  costs: 'Economía Cloud',
  infrastructure: 'Regiones y recursos',
  security: 'Controles y cumplimiento',
  network: 'Topología de solución',
  services: 'Catálogo AWS',
}

const notifications = [
  { title: 'Propuesta guardada', detail: 'La solución quedó persistida localmente.' },
  { title: 'Costos actualizados', detail: 'El presupuesto se recalculó con los últimos cambios.' },
  { title: 'Riesgos revisados', detail: '1 control requiere atención en seguridad.' },
]

export function Header({ route, title, onOpenSidebar, selectedRegion, onRegionChange }: HeaderProps) {
  const [openNotifications, setOpenNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notificationRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const activeRegion = regions.find((region) => region.code === selectedRegion) ?? regions[0]

  useEffect(() => {
    if (!openNotifications) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!notificationRef.current?.contains(event.target as Node)) setOpenNotifications(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenNotifications(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openNotifications])

  const handleSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) return
    const result = Object.entries(labels).find(([key, label]) => `${key} ${label}`.toLowerCase().includes(normalizedQuery))
    if (result) {
      navigate(`/${result[0]}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-title">
        <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="icon-button menu-trigger" onClick={onOpenSidebar} aria-label="Abrir menú"><Icon name="menu" /></Button></TooltipTrigger><TooltipContent>Abrir menú</TooltipContent></Tooltip>
        <div><p className="breadcrumb">CloudOps / <span>{labels[route]}</span></p><h1>{title}</h1></div>
      </div>
      <div className="topbar-actions">
        <div className="topbar-search" role="search"><Icon name="search" /><Input aria-label="Buscar en CloudOps" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Buscar en CloudOps" className="h-auto border-0 bg-transparent p-0 text-xs shadow-none focus-visible:ring-0" /></div>
        <div className="header-divider" />
        <div className="notification-wrap" ref={notificationRef}>
          <Tooltip><TooltipTrigger asChild><Button type="button" variant="ghost" size="icon" className="icon-button notification-button" aria-label="Notificaciones" aria-expanded={openNotifications} aria-haspopup="true" onClick={() => setOpenNotifications((value) => !value)}><Icon name="notifications" /><span /></Button></TooltipTrigger><TooltipContent>Notificaciones</TooltipContent></Tooltip>
          {openNotifications && (
            <div className="notification-panel">
              <div className="notification-header"><strong>Notificaciones</strong><span>{notifications.length} nuevas</span></div>
              {notifications.map((item) => (
                <div key={item.title} className="notification-item">
                  <div className="notification-dot" />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="header-region" aria-label="Cambiar región activa">
          <Icon name="location_on" />
          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="header-region-select h-auto min-w-[82px] border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" aria-label="Seleccionar región activa">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {regions.map((region) => <SelectItem key={region.code} value={region.code}>{region.code}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <span className="header-region-label-mobile">{activeRegion.code}</span>
      </div>
    </header>
  )
}
