// Gera o payload "Pix Copia e Cola" (padrão BR Code / EMV) a partir da chave PIX
// configurada em lib/pix-config.ts. O mesmo texto vira o QR code exibido na tela
// de pagamento — é o formato oficial que qualquer banco/app de pagamentos entende.

function removerAcentos(txt: string): string {
  return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function limparTexto(txt: string, max: number): string {
  return removerAcentos(txt)
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .slice(0, max)
}

function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0")
  return `${id}${len}${value}`
}

function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0")
}

export interface PixPayloadInput {
  chave: string
  nomeRecebedor: string
  cidade: string
  valor: number
  identificador?: string // aparece no extrato/app de quem paga; ex.: código do ingresso
}

export function gerarPixCopiaECola({ chave, nomeRecebedor, cidade, valor, identificador }: PixPayloadInput): string {
  const gui = tlv("00", "br.gov.bcb.pix")
  const chaveField = tlv("01", chave.trim())
  const merchantAccount = tlv("26", gui + chaveField)

  const pfi = tlv("00", "01")
  // Point of Initiation Method: opcional pela especificação do BCB, mas vários
  // apps de banco (Nubank, Itaú, etc.) recusam o QR como "inválido" se esse
  // campo não estiver presente. "11" = QR estático (mesmo código pode ser pago
  // várias vezes). Sem isso, o payload é válido "no papel" mas muitos scanners
  // de banco não aceitam.
  const pontoIniciacao = tlv("01", "11")
  const mcc = tlv("52", "0000")
  const currency = tlv("53", "986")
  const amount = tlv("54", valor.toFixed(2))
  const country = tlv("58", "BR")
  const merchantName = tlv("59", limparTexto(nomeRecebedor, 25) || "RECEBEDOR")
  const merchantCity = tlv("60", limparTexto(cidade, 15) || "CIDADE")
  const txid = tlv("05", limparTexto(identificador ?? "***", 25) || "***")
  const additionalData = tlv("62", txid)

  const semCrc =
    pfi + pontoIniciacao + merchantAccount + mcc + currency + amount + country + merchantName + merchantCity + additionalData + "6304"

  return semCrc + crc16(semCrc)
}