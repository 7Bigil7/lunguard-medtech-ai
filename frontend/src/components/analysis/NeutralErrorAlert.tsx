import React from 'react'
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react'
import type { ApiErrorCode } from '../../types/api'

interface NeutralErrorAlertProps {
  code?: ApiErrorCode | string
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

/**
 * Dedicated neutral error component.
 * NOTE: This component intentionally uses slate/gray neutral styling and standard UI icons.
 * It NEVER uses triage colors (purple, red, amber, green) or clinical triage language,
 * ensuring system/network failures can never be confused with an Uncertain clinical result.
 */
export const NeutralErrorAlert: React.FC<NeutralErrorAlertProps> = ({
  code,
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-5 bg-slate-100 border border-slate-300 rounded-lg text-slate-900 shadow-sm space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded bg-slate-200 text-slate-700 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-slate-800" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Analysis could not be completed
            </h3>
            {code && (
              <span className="inline-block mt-0.5 font-mono text-xs uppercase px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded border border-slate-300">
                Error Code: {code}
              </span>
            )}
            <p className="mt-1.5 text-sm text-slate-700 leading-relaxed max-w-2xl">
              {message}
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-600 p-1 rounded focus:outline-none"
            aria-label="Dismiss error"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          This is an application or network error. It does not reflect patient imaging or clinical findings.
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Retry Request
          </button>
        )}
      </div>
    </div>
  )
}
