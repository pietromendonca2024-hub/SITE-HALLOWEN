// Detecta se um primeiro nome brasileiro é provavelmente masculino ou feminino.
// É uma heurística (lista de exceções conhecidas + regra de terminação), não é 100%
// infalível — por isso a tela de compra sempre mostra o resultado e deixa a pessoa
// corrigir manualmente antes de emitir o ingresso.

import type { Genero } from "./types"

function removerAcentos(txt: string): string {
  return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function primeiroNome(nomeCompleto: string): string {
  return removerAcentos(nomeCompleto.trim().toLowerCase()).split(/\s+/)[0] ?? ""
}

// Nomes que fogem da regra geral de terminação (ex.: terminam em "a" mas são
// masculinos, ou terminam em consoante/e mas são femininos).
const EXCECOES_MASCULINO = new Set([
  "luca",
  "joshua",
  "josua",
  "jonhata",
  "ilya",
  "matias",
  "elias",
  "tobias",
  "isaias",
  "jeremias",
  "lucas",
  "nicolas",
  "andre",
  "felipe",
  "guilherme",
  "vicente",
  "davi",
  "gabriel",
  "rafael",
  "miguel",
  "samuel",
  "ismael",
  "noah",
  "heitor",
  "vitor",
  "igor",
  "iuri",
  "yuri",
  "cauet",
  "kaue",
  "kauet",
])

const EXCECOES_FEMININO = new Set([
  "alice",
  "beatrice",
  "danielle",
  "daniele",
  "michelle",
  "michele",
  "gabrielle",
  "raquel",
  "ester",
  "esther",
  "ingrid",
  "miriam",
  "myriam",
  "noemi",
  "ruth",
  "ruthe",
  "carmen",
  "yasmin",
  "yasmim",
  "jasmim",
  "isis",
  "nicole",
  "beatriz",
  "luz",
  "elizabeth",
  "isabel",
  "raquele",
  "marilis",
  "isadore" /* raro */,
  "abgail",
  "abigail",
  "jussara",
])

export function detectarGenero(nomeCompleto: string): Genero {
  const nome = primeiroNome(nomeCompleto)
  if (!nome) return "masculino"

  if (EXCECOES_MASCULINO.has(nome)) return "masculino"
  if (EXCECOES_FEMININO.has(nome)) return "feminino"

  const ultimaLetra = nome[nome.length - 1]

  if (ultimaLetra === "a") return "feminino"
  if (ultimaLetra === "o") return "masculino"

  // Terminações tipicamente femininas mesmo sem vogal "a": -ice, -riz, -dre (Andrea/Sandra
  // já cobertos por "a"), -ex (Alex é unissex, default abaixo cobre).
  if (nome.endsWith("ice") || nome.endsWith("riz")) return "feminino"

  // Consoante ou "e" final: no português brasileiro a maioria dos nomes clássicos
  // masculinos termina assim (Rafael, Miguel, Vitor, Felipe...), então esse é o
  // default de desempate.
  return "masculino"
}
