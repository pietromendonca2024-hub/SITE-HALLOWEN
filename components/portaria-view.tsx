"use client"

import { useMemo, useState } from "react"
import { CATEGORIAS, type Ingresso } from "@/lib/types"
import { decodePayload, useIngressos } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Scanner } from "./scanner"
import { DoorOpen, LogOut, ScanLine, Search, Skull } from "lucide-react"

function fmt(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

export function PortariaView() {
  const { ingressos, alternarPresenca } = useIngressos()
  const [modo, setModo] = useState<"busca" | "scan">("busca")
  const [query, setQuery] = useState("")
  const [flash, setFlash] = useState<{ nome: string; entrou: boolean } | null>(null)

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = [...ingressos].sort((a, b) => a.nome.localeCompare(b.nome))
    if (!q) return base
    return base.filter(
      (i) => i.nome.toLowerCase().includes(q) || i.vilao.toLowerCase().includes(q) || i.code.toLowerCase().includes(q),
    )
  }, [ingressos, query])

  function toggle(i: Ingresso) {
    const r = alternarPresenca(i.id)
    if (r) {
      setFlash({ nome: r.nome, entrou: r.status === "dentro" })
      setTimeout(() => setFlash(null), 2200)
    }
  }

  function onScan(raw: string) {
    const { id, code } = decodePayload(raw)
    const encontrado = ingressos.find((i) => (id && i.id === id) || (code && i.code === code))
    if (encontrado) toggle(encontrado)
    else {
      setFlash({ nome: "Pulseira não reconhecida", entrou: false })
      setTimeout(() => setFlash(null), 2200)
    }
  }

  return (
    <div className="reveal-up mx-auto max-w-3xl">
      <header className="mb-8 text-center">
        <h1 className="font-display text-3xl text-foreground text-shadow-blood sm:text-4xl">Portaria</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Busque pelo nome/vilão do convidado ou escaneie a pulseira digital para liberar entrada e saída.
        </p>
      </header>

      {/* Alternador de modo */}
      <div className="mb-6 flex justify-center gap-2">
        <Button
          variant={modo === "busca" ? "default" : "outline"}
          onClick={() => setModo("busca")}
          className={modo === "busca" ? "bg-primary text-primary-foreground" : "border-border"}
        >
          <Search className="size-4" /> Buscar nome
        </Button>
        <Button
          variant={modo === "scan" ? "default" : "outline"}
          onClick={() => setModo("scan")}
          className={modo === "scan" ? "bg-primary text-primary-foreground" : "border-border"}
        >
          <ScanLine className="size-4" /> Escanear QR
        </Button>
      </div>

      {/* Flash de confirmação */}
      {flash && (
        <div
          className={`reveal-up mb-6 flex items-center justify-center gap-3 rounded-md border px-4 py-3 text-center font-heading text-lg font-semibold ${
            flash.entrou
              ? "border-primary/50 bg-primary/15 text-primary"
              : "border-border bg-secondary/60 text-muted-foreground"
          }`}
          role="status"
        >
          <Skull className="size-5" aria-hidden />
          {flash.entrou ? `${flash.nome} entrou nas sombras` : `${flash.nome} — registrado saída`}
        </div>
      )}

      {modo === "scan" && (
        <div className="mb-8">
          <Scanner onResult={onScan} />
        </div>
      )}

      {modo === "busca" && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nome, vilão ou código..."
          className="mb-6 w-full rounded-md border border-input bg-card px-4 py-3 font-heading text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
        />
      )}

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {filtrados.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {ingressos.length === 0 ? "Nenhum ingresso emitido ainda." : "Nenhum convidado encontrado."}
          </p>
        )}
        {filtrados.map((i) => {
          const dentro = i.status === "dentro"
          const cat = CATEGORIAS[i.categoria]
          return (
            <div
              key={i.id}
              className={`flex items-center justify-between gap-4 rounded-lg border bg-card p-4 transition-colors ${
                dentro ? "border-primary/50" : "border-border"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-heading text-lg font-semibold text-foreground">{i.nome}</span>
                  <span className="shrink-0 rounded-sm bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {cat.label}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-display text-sm text-primary">{i.vilao}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Entrada {fmt(i.entradaEm)} · Saída {fmt(i.saidaEm)} · {i.code}
                </p>
              </div>
              <Button
                onClick={() => toggle(i)}
                className={
                  dentro
                    ? "shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                }
              >
                {dentro ? (
                  <>
                    <LogOut className="size-4" /> Saída
                  </>
                ) : (
                  <>
                    <DoorOpen className="size-4" /> Entrada
                  </>
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
