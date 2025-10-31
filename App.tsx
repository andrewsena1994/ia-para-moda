import { createMpCheckout } from './services/payments';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGE, INITIAL_FREE_CREDITS } from './constants';

*** Begin Patch
*** Update File: App.tsx
@@
-// "29,90" -> 29.90
-const toNumber = (v: string) => parseFloat(v.replace('.', '').replace(',', '.'));
+// Converts price strings like "R$ 19,90" or "19,90" to numeric values.
+// Remove currency symbols and thousands separators, then replace decimal comma with a dot.
+const toNumber = (v: string) => {
+  // Remove anything that is not a digit, comma, dot or minus sign
+  let cleaned = v.replace(/[^0-9,.-]/g, '');
+  // Remove thousand separators (dots) and convert comma decimal separator to dot
+  cleaned = cleaned.replace(/\./g, '').replace(',', '.');
+  const num = parseFloat(cleaned);
+  return isNaN(num) ? 0 : num;
+};
*** End Patch

// Assinatura de créditos avulsos
async function purchaseCredits(amountCredits: number) {
  console.log('[purchaseCredits] clicou:', amountCredits);
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
  console.log('[purchaseSubscription] clicou');
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
