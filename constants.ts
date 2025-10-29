// converte "19,90" → 19.90
const toNumber = (v: string | number) =>
  typeof v === 'number'
    ? v
    : Number(String(v).replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, ''));

// Comprar CRÉDITOS por pacote (ex.: 'starter', 'pro', etc.)
async function purchaseCredits(packId: keyof typeof CREDIT_PACKAGES) {
  try {
    if (!user) {
      // se você tiver modal de login, abra aqui
      // setShowAuth(true);
      // toast?.('Faça login para continuar');
      return;
    }

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
  } catch (e) {
    console.error(e);
    alert('Erro ao iniciar pagamento.');
  }
}

// Assinatura MENSAL (ex.: Plano PRO a R$ 29,90)
async function purchaseSubscription() {
  try {
    if (!user) {
      // setShowAuth(true);
      return;
    }
    const amount = toNumber('29,90'); // ajuste se você tiver isso em constants.ts
    const title = 'Plano PRO Mensal';

    const r = await createMpCheckout(user.email, title, amount);
    if (r?.ok && r?.url) {
      window.location.href = r.url;
    } else {
      console.error('Falha ao criar checkout:', r);
      alert('Não foi possível iniciar o pagamento.');
    }
  } catch (e) {
    console.error(e);
    alert('Erro ao iniciar pagamento.');
  }
}
