Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, OPTIONS


// services/payments.ts
export async function createMpCheckout(
  userId: string,
  title: string,
  amount: number
): Promise<string | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/payments/mp/checkout`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, amount }),
      }
    );
    const data = await response.json();
    if (data.ok && data.url) {
      return data.url as string;
    }
    console.error('Erro no Mercado Pago:', data);
    return null;
  } catch (error) {
    console.error('Falha ao criar checkout', error);
    return null;
  }
}
// middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// endpoint
app.post('/payments/mp/checkout', async (req, res) => {
  const { userid, title, amount } = req.body; // amount em número
  // gere preferência do Mercado Pago aqui...
  // ex.: const preference = await mp.preferences.create({...});
  // res.json({ url: preference.init_point });
  res.json({ url: 'https://www.mercadopago.com.br/checkout/v1/...'}); // <- precisa devolver {url}
});
