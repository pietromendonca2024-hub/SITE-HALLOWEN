// ============================================================================
// CONFIGURAÇÃO DO PIX — É AQUI QUE VOCÊ COLOCA SUA CONTA PARA RECEBER
// ============================================================================
// Preencha os 3 campos abaixo com os dados da SUA conta bancária/PIX.
// O QR code e o "copia e cola" mostrados na tela de pagamento são gerados
// automaticamente a partir destes dados — o dinheiro cai direto na sua conta,
// sem intermediário, sem taxa extra e sem precisar de gateway de pagamento.
//
// 1) chave: sua chave PIX. Pode ser:
//    - CPF (só números, ex: "12345678900")
//    - Celular (com DDI, ex: "+5521999999999")
//    - E-mail (ex: "seuemail@gmail.com")
//    - Chave aleatória (aquele código tipo "123e4567-e89b-...")
//
// 2) nomeRecebedor: o nome cadastrado no banco para essa chave PIX (o nome
//    que aparece pro pagador confirmar antes de pagar). Máximo 25 caracteres,
//    sem acento (o código já remove acentos automaticamente).
//
// 3) cidade: a cidade do titular da conta, sem acento. Máximo 15 caracteres.
//
// IMPORTANTE: este QR code gera uma cobrança PIX real. Como o site não tem
// um servidor/backend para confirmar pagamentos automaticamente, a confirmação
// é manual — a pessoa clica em "Já paguei" depois de pagar. Antes da festa (ou
// na portaria), vale checar o extrato do PIX para bater com os ingressos
// emitidos.
// ============================================================================

export const PIX_CONFIG = {
  chave: "1743292a-b3f1-4105-bd69-170841e9a2c0", // CPF, celular, e-mail ou chave aleatória
  nomeRecebedor: "Pietro Mendonça Rodrigues", // nome cadastrado na chave PIX (máx. 25 caracteres)
  cidade: "Rio de Janeiro", // cidade do titular da conta (máx. 15 caracteres)
}
