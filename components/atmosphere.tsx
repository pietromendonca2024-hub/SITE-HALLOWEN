"use client"

// Camadas de atmosfera de terror: textura de sangue, respingos e escorridos.
// Puramente decorativo — aria-hidden.
export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* textura base de parede suja de sangue */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply"
        style={{ backgroundImage: "url(/blood-texture.png)" }}
      />
      {/* vinheta escura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_95%)]" />
      {/* brilho carmesim pulsante no topo */}
      <div className="animate-pulse-slow absolute -top-40 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      {/* escorridos de sangue no topo */}
      <div className="absolute inset-x-0 top-0 h-40">
        {DRIPS.map((d, i) => (
          <span
            key={i}
            className="drip absolute top-0 w-[3px] rounded-b-full bg-gradient-to-b from-primary/80 to-primary/0"
            style={{
              left: `${d.left}%`,
              height: `${d.height}px`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
            }}
          >
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/70" />
          </span>
        ))}
      </div>
    </div>
  )
}

const DRIPS = [
  { left: 6, height: 90, delay: 0, duration: 7 },
  { left: 18, height: 140, delay: 1.5, duration: 9 },
  { left: 31, height: 60, delay: 0.8, duration: 6 },
  { left: 44, height: 170, delay: 2.2, duration: 10 },
  { left: 57, height: 80, delay: 0.4, duration: 7.5 },
  { left: 69, height: 130, delay: 1.1, duration: 8.5 },
  { left: 82, height: 100, delay: 2.8, duration: 9.5 },
  { left: 93, height: 150, delay: 0.6, duration: 8 },
]
