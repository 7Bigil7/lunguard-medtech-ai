import {
  AnalysisResponseSchema,
  HealthResponseSchema,
  ApiErrorPayloadSchema,
} from '../lib/schemas'
import type { AnalysisResponse, HealthResponse, ApiErrorCode } from '../types/api'

export class ApiServiceError extends Error {
  code: ApiErrorCode
  status?: number

  constructor(message: string, code: ApiErrorCode, status?: number) {
    super(message)
    this.name = 'ApiServiceError'
    this.code = code
    this.status = status
  }
}

const DEFAULT_TIMEOUT_MS = 25000 // 25s timeout for deep learning inference
const HEALTH_TIMEOUT_MS = 4000 // 4s timeout for health probe

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
}

/**
 * Checks backend health and model status
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  const baseUrl = getApiBaseUrl()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS)

  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      throw new ApiServiceError(
        `Backend health check failed with HTTP ${res.status}: ${res.statusText}`,
        'NETWORK_ERROR',
        res.status
      )
    }

    const json = await res.json()
    const parsed = HealthResponseSchema.safeParse(json)

    if (!parsed.success) {
      throw new ApiServiceError(
        `Invalid health response schema: ${parsed.error.message}`,
        'SCHEMA_ERROR'
      )
    }

    return parsed.data
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    if (err instanceof ApiServiceError) throw err

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiServiceError('Health check timed out after 4 seconds.', 'NETWORK_ERROR')
    }

    throw new ApiServiceError(
      `Cannot connect to backend at ${baseUrl}. Ensure the FastAPI service is running.`,
      'NETWORK_ERROR'
    )
  }
}

/**
 * Posts CXR image to real backend for inference
 */
export async function analyzeImageLive(
  file: File,
  caseLabel?: string,
  userSignal?: AbortSignal
): Promise<AnalysisResponse> {
  const baseUrl = getApiBaseUrl()

  const formData = new FormData()
  formData.append('file', file)
  if (caseLabel && caseLabel.trim()) {
    formData.append('case_label', caseLabel.trim())
  }

  const internalController = new AbortController()
  const timeoutId = setTimeout(() => internalController.abort(), DEFAULT_TIMEOUT_MS)

  // Listen to either user abort or timeout abort
  if (userSignal) {
    userSignal.addEventListener('abort', () => {
      clearTimeout(timeoutId)
      internalController.abort()
    })
  }

  try {
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      body: formData,
      signal: internalController.signal,
    })

    clearTimeout(timeoutId)

    const rawJson = await res.json().catch(() => null)

    if (!res.ok) {
      if (rawJson) {
        const errorParse = ApiErrorPayloadSchema.safeParse(rawJson)
        if (errorParse.success) {
          throw new ApiServiceError(
            errorParse.data.error.message,
            errorParse.data.error.code,
            res.status
          )
        }
      }

      throw new ApiServiceError(
        `Server returned error ${res.status}: ${res.statusText}`,
        res.status >= 500 ? 'INTERNAL_ERROR' : 'INFERENCE_FAILED',
        res.status
      )
    }

    if (!rawJson) {
      throw new ApiServiceError(
        'Server returned empty response payload.',
        'SCHEMA_ERROR',
        res.status
      )
    }

    const validated = AnalysisResponseSchema.safeParse(rawJson)
    if (!validated.success) {
      const issueDetails = validated.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join(', ')
      throw new ApiServiceError(
        `API response did not match expected contract schema: ${issueDetails}`,
        'SCHEMA_ERROR',
        res.status
      )
    }

    return validated.data
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    if (err instanceof ApiServiceError) throw err

    if (err instanceof DOMException && err.name === 'AbortError') {
      if (userSignal?.aborted) {
        throw new DOMException('Analysis was cancelled by the user.', 'AbortError')
      }
      throw new ApiServiceError(
        `Inference request timed out after ${DEFAULT_TIMEOUT_MS / 1000} seconds. The backend may be overloaded.`,
        'NETWORK_ERROR'
      )
    }

    throw new ApiServiceError(
      `Network communication error while reaching ${baseUrl}/api/analyze.`,
      'NETWORK_ERROR'
    )
  }
}
