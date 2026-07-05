"use client"

import { useMemo, useState } from "react"
import { CATEGORIAS, type CategoriaId, type Genero, type Ingresso } from "@/lib/types"
import { useIngressos } from "@/lib/store"
import { detectarGenero } from "@/lib/gender"
import { Button } from "@/components/ui/button"
import { TicketView } from "./ticket-view"
import { PixPayment } from "./pix-payment"
import { Check, ArrowLeft } from "lucide-react"

type Etapa = "nome" | "pagamento"

export function BuyView() {
  const { criar } = useIngressos()
  const [etapa, setEtapa] = useState<Etapa>("nome")
  const [nome, setNome] = useState("")
  const [generoOverride, setGeneroOverride] = useState<Genero | null>(null)
  const [categoria, setCategoria] = useState<CategoriaId | null>(null)
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false)
  const [erro, setErro] = useState("")
  const [emitido, setEmitido] = useState<Ingresso | null>(null)

  const generoDetectado = useMemo(() => (nome.trim() ? detectarGenero(nome) : "masculino"), [nome])
  const genero = generoOverride ?? generoDetectado

  function avancarParaPagamento() {
    if (!nome.trim()) {
      setErro("Diga seu nome, mortal.")
      return
    }
    setErro("")
    setEtapa("pagamento")
  }

  function voltarParaNome() {
    setEtapa("nome")
    setPagamentoConfirmado(false)
  }

  function confirmarPagamentoEEmitir() {
    if (!categoria) {
      setErro("Escolha um pacto (categoria) antes de pagar.")
      return
    }
    setErro("")
    const t = criar(nome, categoria, genero)
    setEmitido(t)
  }

  function reset() {
    setEmitido(null)
    setNome("")
    setGeneroOverride(null)
    setCategoria(null)
    setPagamentoConfirmado(false)
    setEtapa("nome")
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

      {etapa === "nome" && (
        <>
          {/* Nome */}
          <div className="mb-6">
            <label htmlFor="nome" className="mb-2 block text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Seu nome
            </label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value)
                setGeneroOverride(null)
              }}
              placeholder="Como te chamam entre os vivos?"
              className="w-full rounded-md border border-input bg-card px-4 py-3 font-heading text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
            />
          </div>

          {/* Gênero do vilão sorteado (detectado automaticamente, mas ajustável) */}
          {nome.trim() && (
            <div className="mb-8">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Seu vilão vai ser
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setGeneroOverride("masculino")}
                  className={`flex-1 rounded-md border px-4 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
                    genero === "masculino"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Um vilão
                </button>
                <button
                  onClick={() => setGeneroOverride("feminino")}
                  className={`flex-1 rounded-md border px-4 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
                    genero === "feminino"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Uma vilã
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Detectamos pelo nome — se não bateu, é só escolher a opção certa acima.
              </p>
            </div>
          )}

          {erro && (
            <p className="mb-4 text-center text-sm font-medium text-destructive" role="alert">
              {erro}
            </p>
          )}

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={avancarParaPagamento}
              className="h-14 w-full max-w-sm bg-primary text-lg font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              Continuar para o pagamento
            </Button>
          </div>
        </>
      )}

      {etapa === "pagamento" && (
        <>
          <button
            onClick={voltarParaNome}
            className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Voltar
          </button>

          {/* Categorias */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {(Object.values(CATEGORIAS) as (typeof CATEGORIAS)[CategoriaId][]).map((cat) => {
              const ativo = categoria === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoria(cat.id)
                    setPagamentoConfirmado(false)
                  }}
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

          {categoria && (
            <div className="mb-8">
              <PixPayment valor={CATEGORIAS[categoria].price} identificador={nome.trim().slice(0, 20) || "ingresso"} />
            </div>
          )}

          {erro && (
            <p className="mb-4 text-center text-sm font-medium text-destructive" role="alert">
              {erro}
            </p>
          )}

          <div className="flex flex-col items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={pagamentoConfirmado}
                onChange={(e) => setPagamentoConfirmado(e.target.checked)}
                disabled={!categoria}
                className="size-4 accent-[var(--primary)]"
              />
              Já fiz o pagamento via Pix
            </label>
            <Button
              size="lg"
              onClick={confirmarPagamentoEEmitir}
              disabled={!categoria || !pagamentoConfirmado}
              className="h-14 w-full max-w-sm bg-primary text-lg font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              Selar meu pacto
            </Button>
            <p className="max-w-md text-center text-xs leading-relaxed text-muted-foreground">
              Ao confirmar, o site sorteia um vilão e gera sua pulseira digital com QR code.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
