"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { CategoriaId, Ingresso } from "./types"
import { pickVillain } from "./villains"

const STORAGE_KEY = "noite-das-sombras:ingressos"
const EVENT = "noite-das-sombras:update"

function read(): Ingresso[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Ingresso[]) : []
  } catch {
    return []
  }
}

function write(ingressos: Ingresso[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ingressos))
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(callback: () => void) {
  const handler = () => callback()
  window.addEventListener(EVENT, handler)
  window.addEventListener("storage", handler)
  return () => {
    window.removeEventListener(EVENT, handler)
    window.removeEventListener("storage", handler)
  }
}

// Cache para manter referência estável entre renders (evita loop no useSyncExternalStore).
let cache: Ingresso[] = []
let cacheRaw = ""

function getSnapshot(): Ingresso[] {
  if (typeof window === "undefined") return cache
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? ""
  if (raw !== cacheRaw) {
    cacheRaw = raw
    cache = read()
  }
  return cache
}

const EMPTY: Ingresso[] = []

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let out = ""
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export function useIngressos() {
  const ingressos = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)

  const criar = useCallback((nome: string, categoria: CategoriaId): Ingresso => {
    const atual = read()
    const usados = atual.map((i) => i.vilao)
    const novo: Ingresso = {
      id: crypto.randomUUID(),
      code: genCode(),
      nome: nome.trim(),
      categoria,
      vilao: pickVillain(usados),
      criadoEm: new Date().toISOString(),
      status: "fora",
      entradaEm: null,
      saidaEm: null,
    }
    write([...atual, novo])
    return novo
  }, [])

  const alternarPresenca = useCallback((id: string): Ingresso | null => {
    const atual = read()
    let alterado: Ingresso | null = null
    const proximo = atual.map((i) => {
      if (i.id !== id) return i
      const agora = new Date().toISOString()
      if (i.status === "fora") {
        alterado = { ...i, status: "dentro", entradaEm: agora, saidaEm: null }
      } else {
        alterado = { ...i, status: "fora", saidaEm: agora }
      }
      return alterado
    })
    if (alterado) write(proximo)
    return alterado
  }, [])

  const remover = useCallback((id: string) => {
    write(read().filter((i) => i.id !== id))
  }, [])

  const limparTudo = useCallback(() => {
    write([])
  }, [])

  return { ingressos, criar, alternarPresenca, remover, limparTudo }
}

export function encodePayload(ingresso: Ingresso): string {
  return JSON.stringify({ id: ingresso.id, code: ingresso.code, v: 1 })
}

export function decodePayload(raw: string): { id?: string; code?: string } {
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object") return parsed
  } catch {
    // fallback: pode ser só o código
  }
  return { code: raw.trim().toUpperCase() }
}
