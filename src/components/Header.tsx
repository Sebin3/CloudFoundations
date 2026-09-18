import { useState } from 'react'
import { regions } from '../data/cloudData'
import type { RouteKey } from '../types/cloud'
import { Icon } from './Icon'

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
  const activeRegion = regions.find((region) => region.code === selectedRegion) ?? regions[0]

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="icon-button menu-trigger" onClick={onOpenSidebar} aria-label="Abrir menú"><Icon name="menu" /></button>
        <div><p className="breadcrumb">CloudOps / <span>{labels[route]}</span></p><h1>{title}</h1></div>
      </div>
      <div className="topbar-actions">
        <div className="topbar-search"><Icon name="search" /><input aria-label="Buscar" placeholder="Buscar en CloudOps" /></div>
        <div className="header-divider" />
        <div className="notification-wrap">
          <button className="icon-button notification-button" aria-label="Notificaciones" onClick={() => setOpenNotifications((value) => !value)}><Icon name="notifications" /><span /></button>
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
        <label className="header-region" aria-label="Cambiar región activa">
          <Icon name="location_on" />
          <select value={selectedRegion} onChange={(event) => onRegionChange(event.target.value)} className="header-region-select" aria-label="Seleccionar región activa">
            {regions.map((region) => <option key={region.code} value={region.code}>{region.code}</option>)}
          </select>
          <Icon name="expand_more" />
        </label>
        <span className="header-region-label-mobile">{activeRegion.code}</span>
      </div>
    </header>
  )
}
