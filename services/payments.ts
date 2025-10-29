*** Begin Patch
*** Add File: services/payments.ts
// services/payments.ts
// Utility to create a checkout session with the back‑end.
// It sends a POST request to your Cloud Run API and returns the Mercado Pago checkout URL.
export async function createMpCheckout(userId: string, title: string, amount: number): Promise<string | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/mp/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, title, amount }),
    });
    const data = await response.json();
    if (data.ok && data.url) {
      return data.url;
    }
    console.error('Mercado Pago error', data);
    return null;
  } catch (error) {
    console.error('Error creating Mercado Pago checkout', error);
    return null;
  }
}
