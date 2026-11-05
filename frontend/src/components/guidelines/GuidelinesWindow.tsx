import React, { useState, useEffect, useRef } from 'react'
import { BookOpen, X, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react'
import { GUIDELINES_CONTENT } from './guidelinesContent'

export const GuidelinesWindow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  // Handle open/close side effects (body scroll lock and focus management)
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // Focus close button on open
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus()
      })

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false)
        } else if (e.key === 'Tab' && modalRef.current) {
          // Trap tab focus within the modal dialog
          const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          if (focusableElements.length === 0) return

          const firstElement = focusableElements[0]
          const lastElement = focusableElements[focusableElements.length - 1]

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = originalOverflow
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      // Return focus to trigger button when closed
      triggerButtonRef.current?.focus()
    }
  }, [isOpen])

  return (
    <>
      {/* Floating Guidelines Trigger Button */}
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="fixed bottom-5 right-5 z-40 flex items-center space-x-2 px-3.5 py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-800 border border-slate-300 shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 group"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
        </span>
        <BookOpen className="w-4 h-4 text-teal-700 transition-transform group-hover:scale-110" />
        <span className="font-semibold text-slate-800">Guidelines</span>
      </button>

      {/* Modal Overlay and Centered Dialog */}
      {isOpen && (
        <div
          role="presentation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="guidelines-modal-title"
            aria-describedby="guidelines-modal-subtitle"
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full my-6 p-5 sm:p-7 shadow-2xl text-slate-900 max-h-[90vh] flex flex-col focus:outline-none motion-safe:transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 shrink-0">
              <div className="space-y-1 pr-4">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    Reference Architecture
                  </span>
                </div>
                <h2
                  id="guidelines-modal-title"
                  className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight"
                >
                  {GUIDELINES_CONTENT.title}
                </h2>
                <p
                  id="guidelines-modal-subtitle"
                  className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed"
                >
                  {GUIDELINES_CONTENT.subtitle}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close guidelines window"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto py-5 flex-1 pr-1 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {GUIDELINES_CONTENT.cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col justify-between p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-colors space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/80 text-slate-700">
                          {card.badgeText}
                        </span>
                        {card.sourcePending && (
                          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
                            Source to be confirmed
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {card.title}
                      </h3>

                      <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                        {card.summary.map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-200/80">
                        <p className="text-[11px] font-semibold text-slate-700 mb-0.5">
                          How LungGuard relates:
                        </p>
                        <p className="text-xs text-slate-600 italic leading-relaxed">
                          {card.relation}
                        </p>
                      </div>
                    </div>

                    {card.sourceUrl && (
                      <div className="pt-2">
                        <a
                          href={card.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline gap-1 group"
                        >
                          <span>{card.sourceLabel || 'View Source'}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-teal-600 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Disclaimer */}
            <div className="pt-4 border-t border-slate-200 shrink-0 flex items-center justify-between flex-wrap gap-3">
              <p className="text-[11px] text-slate-500 leading-normal max-w-3xl">
                <span className="font-semibold text-slate-700">Note: </span>
                {GUIDELINES_CONTENT.footerNotice}
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
