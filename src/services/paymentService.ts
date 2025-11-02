/**
 * ATENÇÃO: Esta é uma simulação de como você chamaria seu backend.
 * Você precisará criar um servidor (backend) que se comunique com a API do Mercado Pago
 * de forma segura para gerar links de pagamento reais.
 * 
 * Por que um backend é necessário?
 * 1. Segurança: Sua chave de acesso secreta (Access Token) do Mercado Pago nunca deve ser exposta no frontend.
 * 2. Lógica de Negócio: O backend valida o pedido, registra a tentativa de pagamento no seu banco de dados
 *    e associa o pagamento ao usuário correto.
 */

interface PreferenceResponse {
  checkoutUrl: string;
}

interface SubscriptionResponse {
  checkoutUrl: string;
}

/**
 * Simula a criação de uma preferência de pagamento no Mercado Pago através do seu backend.
 * @param amount - O número de créditos que o usuário está comprando.
 * @param description - Uma descrição do item.
 * @returns Uma promessa que resolve com a URL de checkout.
 */
export const createPreference = async (amount: number, description: string): Promise<PreferenceResponse> => {
  console.log(`Solicitando link de pagamento para: ${description}`);
  
  // ----- INÍCIO DA LÓGICA REAL -----
  // No mundo real, você faria uma chamada `fetch` para o seu backend aqui.
  // Exemplo:
  /*
  const API_ENDPOINT = 'https://SEU_BACKEND.com/api/create-payment-preference';
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Você pode enviar o ID do usuário, o pacote de créditos, etc.
    body: JSON.stringify({ amount, description }) 
  });
  if (!response.ok) {
    throw new Error('Falha ao criar preferência de pagamento.');
  }
  const data = await response.json(); // Espera-se que seu backend retorne { checkoutUrl: '...' }
  return data;
  */
  // ----- FIM DA LÓGICA REAL -----

  // Como não temos um backend, vamos continuar simulando a resposta para que o app funcione.
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simula a latência da rede

  const fakePreferenceId = `FAKE_PREF_${amount}_${Date.now()}`;
  const fakeCheckoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${fakePreferenceId}`;
  
  console.log(`Link de pagamento gerado (simulado): ${fakeCheckoutUrl}`);
  return {
    checkoutUrl: fakeCheckoutUrl,
  };
};

/**
 * Simula a criação de um plano de assinatura no Mercado Pago através do seu backend.
 * @param planId - O ID do plano de assinatura que você criou no painel do Mercado Pago.
 * @returns Uma promessa que resolve com a URL de checkout da assinatura.
 */
export const createSubscription = async (planId: string): Promise<SubscriptionResponse> => {
    console.log(`Solicitando link de assinatura para o plano: ${planId}`);
  
  // ----- INÍCIO DA LÓGICA REAL -----
  // No mundo real, você faria uma chamada `fetch` para o seu backend.
  // Exemplo:
  /*
  const API_ENDPOINT = 'https://SEU_BACKEND.com/api/create-subscription';
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId }) // Envie o ID do plano para seu backend
  });
  if (!response.ok) {
    throw new Error('Falha ao criar link de assinatura.');
  }
  const data = await response.json(); // Espera-se que seu backend retorne { checkoutUrl: '...' }
  return data;
  */
  // ----- FIM DA LÓGICA REAL -----

  // Continuamos simulando a resposta.
  await new Promise(resolve => setTimeout(resolve, 1500));

  // IMPORTANTE: O `plan_id` aqui deve ser um ID real que você criou na sua conta do Mercado Pago.
  // O erro na sua imagem (SUB04-WOODPRVPTXML) indica que o plan_id é inválido ou não pertence
  // à aplicação configurada com suas credenciais.
  const fakeCheckoutUrl = `https://www.mercadopago.com.br/subscriptions/v1/redirect?plan_id=${planId}`;

  console.log(`Link de assinatura gerado (simulado): ${fakeCheckoutUrl}`);
  return {
    checkoutUrl: fakeCheckoutUrl,
  };
};
