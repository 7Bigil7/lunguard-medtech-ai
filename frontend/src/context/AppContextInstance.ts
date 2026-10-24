import { createContext } from 'react'
import type { AppMode, HealthResponse, TriageOutcome } from '../types/api'

export interface AppContextValue {
  mode: AppMode
  health: HealthResponse | null
  healthError: string | null
  isCheckingHealth: boolean
  simulatedScenario: TriageOutcome
  setSimulatedScenario: (scenario: TriageOutcome) => void
  enterDemoMode: () => void
  exitDemoMode: () => void
  recheckBackend: () => Promise<void>
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)
