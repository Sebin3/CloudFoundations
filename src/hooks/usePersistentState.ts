import { useEffect, useState } from 'react'

export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const saved = window.localStorage.getItem(key)
      return saved ? (JSON.parse(saved) as T) : initialValue
    } catch (error) {
      console.warn(`No se pudo leer ${key} desde localStorage:`, error)
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [value, setValue] as const
}
