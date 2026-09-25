import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { DashboardLayout } from './layout/DashboardLayout'
import type { RouteKey } from './types/cloud'
import './App.css'

const Dashboard = lazy(() => import('./pages/Dashboard').then(({ Dashboard }) => ({ default: Dashboard })))
const Planning = lazy(() => import('./pages/Planning').then(({ Planning }) => ({ default: Planning })))
const Costs = lazy(() => import('./pages/Costs').then(({ Costs }) => ({ default: Costs })))
const Infrastructure = lazy(() => import('./pages/Infrastructure').then(({ Infrastructure }) => ({ default: Infrastructure })))
const Security = lazy(() => import('./pages/Security').then(({ Security }) => ({ default: Security })))
const Network = lazy(() => import('./pages/Network').then(({ Network }) => ({ default: Network })))
const Services = lazy(() => import('./pages/Services').then(({ Services }) => ({ default: Services })))

const pageTitles: Record<RouteKey, string> = {
  dashboard: 'Dashboard',
  planning: 'Planificación Cloud',
  costs: 'Costos y economía',
  infrastructure: 'Infraestructura global',
  security: 'Seguridad',
  network: 'Arquitectura de red',
  services: 'Servicios AWS',
}

const validRoutes: RouteKey[] = ['dashboard', 'planning', 'costs', 'infrastructure', 'security', 'network', 'services']

function CloudApplication() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathRoute = location.pathname.split('/').filter(Boolean)[0] as RouteKey | undefined
  const route = pathRoute && validRoutes.includes(pathRoute) ? pathRoute : 'dashboard'

  return (
    <DashboardLayout route={route} title={pageTitles[route]} onNavigate={(nextRoute) => navigate(`/${nextRoute}`)}>
      <Suspense fallback={<div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-500">Cargando vista...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/costs" element={<Costs />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/security" element={<Security />} />
          <Route path="/network" element={<Network />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  )
}

function App() {
  return <BrowserRouter><CloudApplication /></BrowserRouter>
}

export default App
