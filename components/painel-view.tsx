"use client"

import { useMemo, useState } from "react"
import { CATEGORIAS, type CategoriaId } from "@/lib/types"
import { useIngressos } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { DollarSign, Ticket, Users, Trash2 } from "lucide-react"

export function PainelView() {
  const { ingressos, limparTudo } = useIngressos()
  const [confirmando, setConfirmando] = useState(false)

  const stats = useMemo(() => {
    const total = ingressos.length
    const dentro = ingressos.filter((i) => i.status === "dentro").length
    const receita = ingressos.reduce((acc, i) => acc + CATEGORIAS[i.categoria].price, 0)
    const porCategoria = (Object.keys(CATEGORIAS) as CategoriaId[]).map((id) => ({
      cat: CATEGORIAS[id],
      qtd: ingressos.filter((i) => i.categoria === id).length,
    }))
    return { total, dentro, receita, porCategoria }
  }, [ingressos])

  const maxCat = Math.max(1, ...stats.porCategoria.map((c) => c.qtd))

  return (
    <div className="reveal-up mx-auto max-w-4xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-foreground text-shadow-blood sm:text-4xl">Painel</h1>
          <p className="mt-2 text-sm text-muted-foreground">Vendas, presença e o livro dos condenados.</p>
        </div>
        {ingressos.length > 0 &&
          (confirmando ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Apagar tudo?</span>
              <Button
                size="sm"
                onClick={() => {
                  limparTudo()
                  setConfirmando(false)
                }}
                className="bg-destructive text-primary-foreground hover:bg-destructive/90"
              >
                Confirmar
              </Button>
              <Button size="sm" variant="outline" className="border-border" onClick={() => setConfirmando(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="border-border" onClick={() => setConfirmando(true)}>
              <Trash2 className="size-4" /> Limpar dados
            </Button>
          ))}
      </header>

      {/* Cards de estatística */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Ticket className="size-5" />} label="Ingressos vendidos" value={String(stats.total)} />
        <StatCard
          icon={<Users className="size-5" />}
          label="Presentes agora"
          value={String(stats.dentro)}
          destaque
        />
        <StatCard icon={<DollarSign className="size-5" />} label="Receita" value={`R$ ${stats.receita}`} />
      </div>

      {/* Por categoria */}
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-5 font-heading text-lg font-semibold uppercase tracking-wide text-foreground">
          Por categoria
        </h2>
        <div className="flex flex-col gap-4">
          {stats.porCategoria.map(({ cat, qtd }) => (
            <div key={cat.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-foreground">{cat.label}</span>
                <span className="font-mono text-muted-foreground">{qtd}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(qtd / maxCat) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border bg-secondary/50 px-5 py-3">
          <h2 className="font-heading text-lg font-semibold uppercase tracking-wide text-foreground">
            Livro dos condenados
          </h2>
        </div>
        {ingressos.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">Nenhum ingresso emitido ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-medium">Convidado</th>
                  <th className="px-5 py-3 font-medium">Vilão</th>
                  <th className="px-5 py-3 font-medium">Categoria</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {ingressos.map((i) => (
                  <tr key={i.id} className="border-b border-border/50 last:border-0">
                    <td className="px-5 py-3 font-heading font-medium text-foreground">{i.nome}</td>
                    <td className="px-5 py-3 font-display text-primary">{i.vilao}</td>
                    <td className="px-5 py-3 text-muted-foreground">{CATEGORIAS[i.categoria].label}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-sm px-2 py-1 text-xs uppercase tracking-wider ${
                          i.status === "dentro"
                            ? "bg-primary/15 text-primary"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {i.status === "dentro" ? "Dentro" : "Fora"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  destaque,
}: {
  icon: React.ReactNode
  label: string
  value: string
  destaque?: boolean
}) {
  return (
    <div
      className={`blood-edge rounded-lg border bg-card p-5 ${
        destaque ? "border-primary/50 shadow-[0_0_30px_-12px_var(--primary)]" : "border-border"
      }`}
    >
      <div className={`mb-3 flex size-9 items-center justify-center rounded-md ${destaque ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-3xl ${destaque ? "text-primary text-shadow-blood" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  )
}
