import { createMpCheckout } from './services/payments';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGE, INITIAL_FREE_CREDITS } from './constants';

// "29,90" -> 29.90
const toNumber = (v: string) => parseFloat(v.replace('.', '').replace(',', '.'));

// Assinatura de créditos avulsos
async function purchaseCredits(amountCredits: number) {
  if (!currentUser) return;
  const pkg = CREDIT_PACKAGES.find(p => p.credits === amountCredits);
  if (!pkg) return;
  const price = toNumber(pkg.price); // converte "R$ 19,90" em número
  // chama o backend, passando e‑mail, descrição e valor numérico
  const url = await createMpCheckout(currentUser.email, `${pkg.credits} créditos`, price);
  console.log('URL recebida do backend:', url);
  if (url) {
    // redireciona para a página de pagamento do Mercado Pago
    window.location.href = url;
  }
}

// Assinatura mensal (já está correto)
async function purchaseSubscription() {
  if (!currentUser || isSubscribed) return;
  const price = toNumber(SUBSCRIPTION_PACKAGE.price);
  const url = await createMpCheckout(currentUser.email, 'Plano mensal', price);
  if (url) {
    window.location.href = url;
  }
}
<Account
  credits={credits}
  onAddCredits={purchaseCredits}
  onSubscribe={purchaseSubscription}
  isSubscribed={isSubscribed}
/>

<PricingModal
  isOpen={isPricingModalOpen}
  onClose={() => setIsPricingModalOpen(false)}
  onAddCredits={purchaseCredits}
  onSubscribe={purchaseSubscription}
/>
