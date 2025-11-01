const API_BASE = 'https://mercadopago-backend-612654168617.europe-west1.run.app';

export const createPreference = async (amount: number, description: string) => {
  const response = await fetch(`${API_BASE}/api/create-payment-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: `${amount} Créditos`,
      quantity: 1,
      unit_price: 39.9, // ajuste se quiser
      description
    })
  });
  if (!response.ok) throw new Error('Falha ao criar preferência');
  return response.json(); // { checkoutUrl }
};

export const createSubscription = async (planId: string) => {
  const response = await fetch(`${API_BASE}/api/create-subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_id: planId })
  });
  if (!response.ok) throw new Error('Falha ao criar assinatura');
  return response.json(); // { checkoutUrl }
};
