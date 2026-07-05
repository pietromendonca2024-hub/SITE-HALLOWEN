"use client"

import { useMemo, useState } from "react"
import { QrCode } from "./qr-code"
import { Button } from "@/components/ui/button"
import { PIX_CONFIG } from "@/lib/pix-config"
import { gerarPixCopiaECola } from "@/lib/pix"
import { Copy, Check } from "lucide-react"

export function PixPayment({ valor, identificador }: { valor: number; identificador: string }) {
  const [copiado, setCopiado] = useState(false)

  const codigo = useMemo(
    () =>
      gerarPixCopiaECola({
        chave: PIX_CONFIG.chave,
        nomeRecebedor: PIX_CONFIG.nomeRecebedor,
        cidade: PIX_CONFIG.cidade,
        valor,
        identificador,
      }),
    [valor, identificador],
  )

  const chaveNaoConfigurada = PIX_CONFIG.chave.includes("COLOQUE-SUA-CHAVE")

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // silencioso — navegador pode bloquear clipboard sem https/localhost
    }
  }

  if (chaveNaoConfigurada) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-center text-sm text-destructive">
        A chave PIX ainda não foi configurada em <span className="font-mono">lib/pix-config.ts</span>. Preencha o
        arquivo com sua chave, nome e cidade para habilitar o pagamento.
      </div>
    )
  }

  return (
    <div className="blood-edge flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">Pague com Pix</p>
      <div className="rounded-md border border-border bg-[#e8ddd0] p-3">
        <QrCode value={codigo} size={190} />
      </div>
      <p className="font-display text-2xl text-primary text-shadow-blood">R$ {valor.toFixed(2)}</p>

      <div className="w-full">
        <p className="mb-2 text-center text-xs text-muted-foreground">
          Ou copie o código Pix e cole no app do seu banco:
        </p>
        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
          <span className="flex-1 truncate font-mono text-xs text-muted-foreground">{codigo}</span>
          <Button size="sm" variant="outline" onClick={copiar} className="shrink-0 border-border">
            {copiado ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copiado ? "Copiado" : "Copiar"}
          </Button>
        </div>
      </div>

      <p className="max-w-sm text-center text-xs leading-relaxed text-muted-foreground">
        O pagamento vai direto para a conta cadastrada pelo organizador. Como o site não tem um servidor para
        confirmar automaticamente, clique em "Já paguei" só depois que o Pix for concluído.
      </p>
    </div>
  )
}
