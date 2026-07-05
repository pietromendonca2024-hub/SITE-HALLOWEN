"use client"

import { useState } from "react"
import { CATEGORIAS, type CategoriaId, type Ingresso } from "@/lib/types"
import { useIngressos } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { TicketView } from "./ticket-view"
import { Check } from "lucide-react"

export function BuyView() {
  const { criar } = useIngressos()
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState<CategoriaId | null>(null)
  const [erro, setErro] = useState("")
  const [emitido, setEmitido] = useState<Ingresso | null>(null)

  function comprar() {
    if (!nome.trim()) {
      setErro("Diga seu nome, mortal.")
      return
    }
    if (!categoria) {
      setErro("Escolha um pacto (categoria).")
      return
    }
    setErro("")
    const t = criar(nome, categoria)
    setEmitido(t)
  }

  function reset() {
    setEmitido(null)
    setNome("")
    setCategoria(null)
  }

  if (emitido) return <TicketView ingresso={emitido} onVoltar={reset} />

  return (
    <div className="reveal-up mx-auto max-w-3xl">
      <header className="mb-10 text-center">
        <h1 className="text-balance font-display text-4xl leading-tight text-foreground text-shadow-blood sm:text-5xl">
          Escolha seu <span className="text-primary">vilão</span>.
          <br />
          Guarde seu <span className="text-primary">segredo</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Cada ingresso vem com o nome de um monstro clássico e um QR code. Na entrada, é só falar quem você
          é ou deixar a portaria escanear sua pulseira digital.
        </p>
      </header>

      {/* Nome */}
      <div className="mb-8">
        <label htmlFor="nome" className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Seu nome
        </label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como te chamam entre os vivos?"
          className="w-full rounded-md border border-input bg-card px-4 py-3 font-heading text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
        />
      </div>

      {/* Categorias */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {(Object.values(CATEGORIAS) as (typeof CATEGORIAS)[CategoriaId][]).map((cat) => {
          const ativo = categoria === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setCategoria(cat.id)}
              className={`blood-edge group relative flex flex-col rounded-lg border p-5 text-left transition-all ${
                ativo
                  ? "border-primary bg-primary/10 shadow-[0_0_30px_-8px_var(--primary)]"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {ativo && (
                <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-4" aria-hidden />
                </span>
              )}
              <span className="font-heading text-xl font-semibold uppercase tracking-wide text-foreground">
                {cat.label}
              </span>
              <span className="mt-1 font-display text-xl text-primary">R${cat.price}</span>
              <span className="mt-3 text-xs leading-relaxed text-muted-foreground">{cat.descricao}</span>
            </button>
          )
        })}
      </div>

      {erro && (
        <p className="mb-4 text-center text-sm font-medium text-destructive" role="alert">
          {erro}
        </p>
      )}

      <div className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          onClick={comprar}
          className="h-14 w-full max-w-sm bg-primary text-lg font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
        >
          Selar meu pacto
        </Button>
        <p className="max-w-md text-center text-xs leading-relaxed text-muted-foreground">
          Isto não é um sistema de pagamento real — é o controle de acesso da festa. Ao confirmar, o site
          sorteia um vilão e gera sua pulseira digital com QR code.
        </p>
      </div>
    </div>
  )
}
