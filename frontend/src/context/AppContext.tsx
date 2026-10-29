import React, { useEffect, useState, useCallback } from 'react'
import type { AppMode, HealthResponse, TriageOutcome } from '../types/api'
import { checkBackendHealth } from '../services/apiClient'
import { AppContext } from './AppContextInstance'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const envDemo = import.meta.env.VITE_DEMO_MODE === 'true'
  // Start directly in demo mode unless live backend is detected
  const [mode, setMode] = useState<AppMode>('demo')
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState<boolean>(false)
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
        // Backend reached but not loaded for inference: stay in demo mode
        setMode('demo')
        setHealthError('Backend is active but model inference worker is offline. Remaining in Simulated Demo Mode.')
      }
    } catch (err: unknown) {
      setHealth(null)
      const msg = err instanceof Error ? err.message : 'Backend unreachable'
      setHealthError(msg)
      // When backend is unreachable, stay directly in clearly labeled SIMULATED DEMO MODE
      setMode('demo')
    } finally {
      setIsCheckingHealth(false)
    }
  }, [])

  useEffect(() => {
    if (!envDemo) {
      // Opportunistically check if a live backend is reachable without dead-ending
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
