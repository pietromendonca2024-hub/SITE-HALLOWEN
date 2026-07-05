"use client"

import { useEffect, useRef } from "react"
import QRCode from "qrcode"

export function QrCode({ value, size = 200 }: { value: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    QRCode.toCanvas(ref.current, value, {
      width: size,
      margin: 1,
      color: {
        dark: "#0a0506",
        light: "#e8ddd0",
      },
      errorCorrectionLevel: "M",
    }).catch(() => {})
  }, [value, size])

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className="rounded-md"
      aria-label="QR code da pulseira digital"
    />
  )
}
