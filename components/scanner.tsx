"use client"

import { useEffect, useRef, useState } from "react"
import jsQR from "jsqr"

export function Scanner({ onResult }: { onResult: (raw: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [erro, setErro] = useState("")
  const rafRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const lockRef = useRef(false)

  useEffect(() => {
    let cancelado = false

    async function iniciar() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (cancelado) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        await video.play()
        tick()
      } catch {
        setErro("Não foi possível acessar a câmera. Verifique as permissões do navegador.")
      }
    }

    function tick() {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" })
          if (code && code.data && !lockRef.current) {
            lockRef.current = true
            onResult(code.data)
            setTimeout(() => (lockRef.current = false), 2500)
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    iniciar()

    return () => {
      cancelado = true
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [onResult])

  return (
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-primary/40 bg-black shadow-[0_0_40px_-10px_var(--primary)]">
      {erro ? (
        <p className="p-6 text-center text-sm text-destructive">{erro}</p>
      ) : (
        <>
          <video ref={videoRef} playsInline muted className="aspect-square w-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          {/* mira */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="size-2/3 rounded-md border-2 border-primary/80 shadow-[0_0_20px_var(--primary)]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-center">
            <p className="text-xs text-foreground/80">Aponte para o QR da pulseira digital</p>
          </div>
        </>
      )}
    </div>
  )
}
