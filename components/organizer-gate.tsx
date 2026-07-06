"use client"

import { useEffect, useState, type ReactNode } from "react"
import { ORGANIZER_PASSWORD } from "@/lib/access-config"
import { Lock } from "lucide-react"

const SESSION_KEY = "organizador-liberado"

export function OrganizerGate({ children }: { children: ReactNode }) {
  const [liberado, setLiberado] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState(false)

  useEffect(() => {
    // sessionStorage some quando a aba fecha — evita ficar "logado" pra sempre
    // no celular de quem usar o link, por exemplo, num computador compartilhado.
    const jaLiberado = sessionStorage.getItem(SESSION_KEY) === "1"
    setLiberado(jaLiberado)
    setCarregando(false)
  }, [])

  function entrar(e: React.FormEvent) {
    e.preventDefault()
    if (senha === ORGANIZER_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1")
      setLiberado(true)
      setErro(false)
    } else {
      setErro(true)
    }
  }

  if (carregando) return null

  if (!liberado) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 text-center">
        <Lock className="size-8 text-primary" aria-hidden />
        <div>
          <p className="font-display text-xl text-foreground">Acesso restrito</p>
          <p className="mt-1 text-sm text-muted-foreground">Área exclusiva da organização. Digite a senha combinada.</p>
        </div>
        <form onSubmit={entrar} className="flex w-full flex-col gap-3">
          <input
            type="password"
            value={senha}
            onChange={(ev) => {
              setSenha(ev.target.value)
              setErro(false)
            }}
            autoFocus
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            placeholder="Senha da organização"
          />
          {erro && <p className="text-xs text-destructive">Senha incorreta.</p>}
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90"
          >
            Entrar
          </button>
        </form>
      </div>
    )
  }

  return <>{children}</>
}
