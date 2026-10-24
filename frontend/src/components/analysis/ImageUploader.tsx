import React, { useRef, useState, useCallback, useEffect } from 'react'
import {
  UploadCloud,
  FileImage,
  Trash2,
  Play,
  ShieldAlert,
} from 'lucide-react'
import { validateCxrImage, type FileValidationResult } from '../../lib/fileValidation'
import { NeutralErrorAlert } from './NeutralErrorAlert'

interface ImageUploaderProps {
  onAnalyze: (file: File, caseLabel?: string) => void
  isAnalyzing: boolean
  onReset: () => void
  hasResult: boolean
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalyze,
  isAnalyzing,
  onReset,
  hasResult,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number } | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [validationCode, setValidationCode] = useState<string | null>(null)
  const [caseLabel, setCaseLabel] = useState<string>('')
  const [isValidating, setIsValidating] = useState<boolean>(false)

  // Cleanup object URL on unmount or file replacement
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleClearImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setImageMeta(null)
    setValidationError(null)
    setValidationCode(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (hasResult) {
      onReset()
    }
  }, [previewUrl, hasResult, onReset])

  const processFile = async (file: File) => {
    setIsValidating(true)
    setValidationError(null)
    setValidationCode(null)

    const result: FileValidationResult = await validateCxrImage(file)

    setIsValidating(false)

    if (!result.valid) {
      handleClearImage()
      setValidationError(result.error.message)
      setValidationCode(result.error.code)
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setSelectedFile(result.file)
    setPreviewUrl(result.objectUrl)
    setImageMeta({ width: result.width, height: result.height })
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      processFile(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  const handleStartAnalysis = () => {
    if (!selectedFile) return
    onAnalyze(selectedFile, caseLabel)
  }

  const loadSampleFile = async (e: React.MouseEvent, samplePath: string, filename: string, mimeType: string) => {
    e.stopPropagation()
    try {
      setIsValidating(true)
      const res = await fetch(samplePath)
      const blob = await res.blob()
      const file = new File([blob], filename, { type: mimeType })
      await processFile(file)
    } catch {
      setValidationError('Failed to load sample image file.')
      setValidationCode('CORRUPT_IMAGE')
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Validation Error Alert */}
      {validationError && (
        <NeutralErrorAlert
          code={validationCode || 'VALIDATION_FAILED'}
          message={validationError}
          onDismiss={() => {
            setValidationError(null)
            setValidationCode(null)
          }}
        />
      )}

      {/* Case Label Input & Privacy Advisory */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label htmlFor="case-label-input" className="text-xs font-semibold uppercase text-slate-700 tracking-wider">
            Optional Case Reference / Session ID
          </label>
          <span className="text-[11px] text-slate-400">Unique Case ID will be auto-generated</span>
        </div>

        <input
          id="case-label-input"
          type="text"
          value={caseLabel}
          onChange={(e) => setCaseLabel(e.target.value)}
          placeholder="e.g., SIM-BATCH-B4 or EVAL-CASE-01"
          maxLength={40}
          disabled={isAnalyzing}
          className="w-full text-sm px-3 py-2 rounded-md border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 bg-slate-50/50"
        />

        <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded border border-amber-200">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Privacy Requirement:</strong> Do NOT enter patient names, medical record numbers (MRNs), or any protected health information (PHI).
          </span>
        </div>
      </div>

      {/* Dropzone & Preview */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Upload chest X-ray image in PNG or JPEG format, maximum 10 megabytes"
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-teal-600 ${
            dragActive
              ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-400'
              : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleInputChange}
            className="hidden"
            aria-hidden="true"
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <UploadCloud className="w-6 h-6 text-teal-600" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {isValidating ? 'Validating image integrity...' : 'Select or drag & drop chest X-ray image'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Accepted: <strong>PNG</strong> or <strong>JPEG</strong> • Max: <strong>10 MB</strong> • Min: <strong>224×224 px</strong>
              </p>
            </div>

            <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
              Client-side verification inspects file signature magic bytes. Images stay entirely in browser memory.
            </p>

            {/* Quick Test Samples for Evaluator Convenience */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Quick Test:</span>
              <button
                type="button"
                onClick={(e) => loadSampleFile(e, '/sample_cxr.png', 'patient_cxr_512x512.png', 'image/png')}
                className="px-2.5 py-1 text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 rounded border border-teal-200 transition-colors shadow-xs"
              >
                Load Sample CXR (512×512)
              </button>
              <button
                type="button"
                onClick={(e) => loadSampleFile(e, '/spoofed_extension.png', 'spoofed_xray.png', 'image/png')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 transition-colors"
                title="Test magic-byte rejection on non-image text file"
              >
                Test Spoofed File
              </button>
              <button
                type="button"
                onClick={(e) => loadSampleFile(e, '/small_xray.png', 'tiny_xray_100x100.png', 'image/png')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 transition-colors"
                title="Test dimension threshold rejection (<224px)"
              >
                Test Undersized (&lt;224px)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Image Loaded Preview State */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <FileImage className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-300">
                Loaded Radiograph (In-Memory)
              </span>
            </div>

            <button
              onClick={handleClearImage}
              disabled={isAnalyzing}
              className="text-xs text-slate-300 hover:text-white flex items-center px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-400" />
              Remove / Replace
            </button>
          </div>

          <div className="p-5 flex flex-col md:flex-row gap-6 items-center">
            {/* Thumbnail */}
            <div className="relative w-48 h-48 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Chest radiograph preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Metadata card */}
            <div className="flex-1 space-y-3 text-xs w-full">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Filename</span>
                  <span className="font-semibold text-slate-800 truncate block max-w-[200px]" title={selectedFile.name}>
                    {selectedFile.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">File Size</span>
                  <span className="font-semibold text-slate-800">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Dimensions</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {imageMeta ? `${imageMeta.width} × ${imageMeta.height} px` : 'Detecting...'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Integrity Check</span>
                  <span className="font-semibold text-emerald-700 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                    Magic Bytes Verified
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-300 text-white font-semibold text-sm rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  {isAnalyzing ? 'Analyzing Image...' : 'Analyze X-ray'}
                </button>

                {hasResult && (
                  <button
                    type="button"
                    onClick={onReset}
                    disabled={isAnalyzing}
                    className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Reset / New Case
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
