import React, { useEffect, useState, useCallback } from 'react'
import type { AppMode, HealthResponse, TriageOutcome } from '../types/api'
import { checkBackendHealth } from '../services/apiClient'
import { AppContext } from './AppContextInstance'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const envDemo = import.meta.env.VITE_DEMO_MODE === 'true'
  const [mode, setMode] = useState<AppMode>(envDemo ? 'demo' : 'checking')
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(!envDemo)
  const [simulatedScenario, setSimulatedScenario] = useState<TriageOutcome>('UNCERTAIN_DUAL_RISK')

  const verifyBackend = useCallback(async () => {
    setIsCheckingHealth(true)
    setHealthError(null)
    try {
      const data = await checkBackendHealth()
      setHealth(data)
      if (data.model_loaded && data.mode === 'inference') {
        setMode('live')
      } else {
        setMode('backend-unavailable')
      }
    } catch (err: unknown) {
      setHealth(null)
      const msg = err instanceof Error ? err.message : 'Backend unreachable'
      setHealthError(msg)
      setMode('backend-unavailable')
    } finally {
      setIsCheckingHealth(false)
    }
  }, [])

  useEffect(() => {
    if (!envDemo) {
      const timer = setTimeout(() => {
        verifyBackend()
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [envDemo, verifyBackend])

  const enterDemoMode = useCallback(() => {
    setMode('demo')
  }, [])

  const exitDemoMode = useCallback(() => {
    verifyBackend()
  }, [verifyBackend])

  return (
    <AppContext.Provider
      value={{
        mode,
        health,
        healthError,
        isCheckingHealth,
        simulatedScenario,
        setSimulatedScenario,
        enterDemoMode,
        exitDemoMode,
        recheckBackend: verifyBackend,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
