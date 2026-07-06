// ============================================================================
// SENHA DA ORGANIZAÇÃO — protege as páginas de Portaria e Painel
// ============================================================================
// Troque o valor abaixo pela senha que só você e quem for trabalhar na
// portaria vão saber. Combine ela por fora (WhatsApp, presencialmente etc.),
// nunca a compartilhe no grupo geral da festa.
//
// IMPORTANTE — limitação real: como este é um site 100% front-end (sem
// servidor), essa senha fica dentro do código JavaScript que roda no
// navegador. Isso é o suficiente para impedir que um convidado curioso
// clicando por aí encontre a portaria/painel sem querer, mas NÃO impede
// alguém tecnicamente capaz de abrir o "inspecionar código" do navegador e
// ler a senha no bundle. Para uma festa entre amigos isso costuma ser
// proteção suficiente; se quiser algo à prova de gente mal-intencionada de
// verdade, é necessário um backend com autenticação real (posso ajudar a
// montar isso também).
// ============================================================================

export const ORGANIZER_PASSWORD = "Festahloween2024"
