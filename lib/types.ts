export type CategoriaId = "pista" | "vip" | "pista_openbar"

export interface Categoria {
  id: CategoriaId
  label: string
  price: number
  descricao: string
}

export const CATEGORIAS: Record<CategoriaId, Categoria> = {
  pista: {
    id: "pista",
    label: "Pista",
    price: 40,
    descricao: "Acesso à pista de dança e às áreas comuns do casarão.",
  },
  vip: {
    id: "vip",
    label: "VIP",
    price: 80,
    descricao: "Área elevada, mesa reservada e entrada preferencial na cripta.",
  },
  pista_openbar: {
    id: "pista_openbar",
    label: "Pista + Open Bar",
    price: 100,
    descricao: "Tudo da pista mais bebidas liberadas a noite inteira. O pacto completo.",
  },
}

export type StatusIngresso = "fora" | "dentro"

export interface Ingresso {
  id: string
  code: string
  nome: string
  categoria: CategoriaId
  vilao: string
  criadoEm: string
  status: StatusIngresso
  entradaEm: string | null
  saidaEm: string | null
}
