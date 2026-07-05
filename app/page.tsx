"use client"

import type React from "react"
import { useState } from "react"
import { Atmosphere } from "@/components/atmosphere"
import { BuyView } from "@/components/buy-view"
import { PortariaView } from "@/components/portaria-view"
import { PainelView } from "@/components/painel-view"
import { Skull, Ticket, DoorClosed, BarChart3 } from "lucide-react"

type View = "comprar" | "portaria" | "painel"

const TABS: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "comprar", label: "Ingressos", icon: <Ticket className="size-4" /> },
  { id: "portaria", label: "Portaria", icon: <DoorClosed className="size-4" /> },
  { id: "painel", label: "Painel", icon: <BarChart3 className="size-4" /> },
]

export default function Page() {
  const [view, setView] = useState<View>("comprar")

  return (
    <main className="relative min-h-dvh">
      <Atmosphere />

      {/* Cabeçalho */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Skull className="flicker size-7 text-primary" aria-hidden />
            <div>
              <p className="font-display text-lg leading-none text-foreground">Noite das Sombras</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Controle de Acesso</p>
            </div>
          </div>

          <nav className="flex gap-1 rounded-lg border border-border bg-card/60 p-1" aria-label="Navegação">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                aria-current={view === t.id ? "page" : undefined}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors sm:px-4 ${
                  view === t.id
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_-6px_var(--primary)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon}
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        {view === "comprar" && <BuyView />}
        {view === "portaria" && <PortariaView />}
        {view === "painel" && <PainelView />}
      </div>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Noite das Sombras · {new Date().getFullYear()} · 100 vilões à espreita
      </footer>
    </main>
  )
}
