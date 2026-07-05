"use client"

import { CATEGORIAS, type Ingresso } from "@/lib/types"
import { encodePayload } from "@/lib/store"
import { QrCode } from "./qr-code"
import { Button } from "@/components/ui/button"
import { Skull } from "lucide-react"

export function TicketView({ ingresso, onVoltar }: { ingresso: Ingresso; onVoltar: () => void }) {
  const cat = CATEGORIAS[ingresso.categoria]

  return (
    <div className="reveal-up mx-auto flex max-w-md flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Seu destino foi selado</p>
        <h2 className="mt-2 font-display text-3xl leading-tight text-primary text-shadow-blood">
          Seu vilão foi escolhido
        </h2>
      </div>

      {/* Pulseira digital */}
      <div className="blood-edge w-full overflow-hidden rounded-lg border border-border bg-card shadow-[0_0_40px_-10px_var(--primary)]">
        <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-5 py-3">
          <span className="font-heading text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Noite das Sombras
          </span>
          <span className="rounded-sm bg-primary/15 px-2 py-1 font-mono text-xs font-bold uppercase tracking-wider text-primary">
            {cat.label}
          </span>
        </div>

        <div className="flex flex-col items-center gap-5 px-6 py-7">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Convidado</p>
            <p className="mt-1 font-heading text-2xl font-semibold text-foreground">{ingresso.nome}</p>
          </div>

          <div className="flex w-full flex-col items-center gap-2 rounded-md border border-primary/30 bg-primary/5 py-4">
            <div className="flex items-center gap-2 text-primary">
              <Skull className="size-4" aria-hidden />
              <span className="text-xs uppercase tracking-[0.3em]">Vilão-senha</span>
            </div>
            <p className="font-display text-2xl text-primary text-shadow-blood">{ingresso.vilao}</p>
          </div>

          <div className="rounded-md border border-border bg-[#e8ddd0] p-3">
            <QrCode value={encodePayload(ingresso)} size={190} />
          </div>

          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span>
              Código: <span className="font-mono font-bold text-foreground">{ingresso.code}</span>
            </span>
            <span>R$ {cat.price},00</span>
          </div>
        </div>
      </div>

      <p className="max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
        Na porta, diga seu nome e o vilão. Guarde bem — esse monstro é a sua senha da noite. Tire um print
        desta tela: ela vale como comprovante.
      </p>

      <Button variant="outline" onClick={onVoltar} className="border-border">
        Comprar outro ingresso
      </Button>
    </div>
  )
}
