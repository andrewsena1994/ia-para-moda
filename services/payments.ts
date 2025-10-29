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
