// converte "19,90" → 19.90
const toNumber = (v: string | number) =>
  typeof v === 'number'
    ? v
    : Number(String(v).replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, ''));

    // Número de créditos gratuitos ao criar uma conta
export const INITIAL_FREE_CREDITS = 5;

// Pacotes de créditos avulsos (quantidade e preço)
export const CREDIT_PACKAGES = [
  { credits: 10, price: 'R$ 19,90' },
  { credits: 20, price: 'R$ 29,90' },
];

// Pacote da assinatura mensal (40 créditos renovados por mês)
export const SUBSCRIPTION_PACKAGE = {
  credits: 40,
  price: 'R$ 39,90',
  interval: 'mês',
};

    const pack = CREDIT_PACKAGES[packId];
    const amount = toNumber(pack.priceBRL); // preço em R$
    const title = `Créditos ${pack.credits} – ${pack.name}`;

    const r = await createMpCheckout(user.email, title, amount);
    if (r?.ok && r?.url) {
      window.location.href = r.url; // redireciona para o MP
    } else {
      console.error('Falha ao criar checkout:', r);
      // toast?.('Não foi possível iniciar o pagamento');
      alert('Não foi possível iniciar o pagamento.');
    }
    catch (e) {
    console.error(e);
    alert('Erro ao iniciar pagamento.');
  }
}

