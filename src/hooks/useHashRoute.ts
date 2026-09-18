import { useEffect, useState } from 'react'
import type { RouteKey } from '../types/cloud'

const routes: RouteKey[] = ['dashboard', 'planning', 'costs', 'infrastructure', 'security', 'network', 'services']

function readRoute(): RouteKey {
  const route = window.location.hash.replace('#/', '') as RouteKey
  return routes.includes(route) ? route : 'dashboard'
}

export function useHashRoute() {
  const [route, setRoute] = useState<RouteKey>(readRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (nextRoute: RouteKey) => {
    window.location.hash = `/${nextRoute}`
  }

  return { route, navigate }
}
