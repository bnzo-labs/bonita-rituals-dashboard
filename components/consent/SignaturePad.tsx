'use client'

import { useRef, useState, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { cn } from '@/lib/utils'

interface SignaturePadProps {
  onChange: (dataUrl: string | null) => void
  error?: boolean
  signHereLabel: string
  clearLabel: string
}

export function SignaturePad({ onChange, error, signHereLabel, clearLabel }: SignaturePadProps) {
  const sigRef = useRef<SignatureCanvas>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasWidth, setCanvasWidth] = useState(500)

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.clientWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  function handleEnd() {
    if (!sigRef.current) return
    const empty = sigRef.current.isEmpty()
    setIsEmpty(empty)
    onChange(empty ? null : sigRef.current.toDataURL('image/png'))
  }

  function handleClear() {
    sigRef.current?.clear()
    setIsEmpty(true)
    onChange(null)
  }

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className={cn(
          'relative rounded-md border bg-warm-white overflow-hidden',
          error ? 'border-danger' : 'border-gold'
        )}
        style={{ touchAction: 'none' }}
      >
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{
            width: canvasWidth,
            height: 160,
            className: 'block',
            style: { touchAction: 'none', cursor: 'crosshair' },
          }}
          onEnd={handleEnd}
          penColor="#2C2420"
        />
        {isEmpty && (
          <div className="signature-placeholder">
            {signHereLabel}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="text-[12px] font-sans font-medium uppercase tracking-[0.08em] text-warm-gray hover:text-gold-dark transition-colors duration-150"
        >
          {clearLabel}
        </button>
      </div>
    </div>
  )
}
