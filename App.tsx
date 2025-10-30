import { createMpCheckout } from './services/payments';
import { CREDIT_PACKAGES, SUBSCRIPTION_PACKAGE, INITIAL_FREE_CREDITS } from './constants';

// "29,90" -> 29.90
const toNumber = (v: string) => parseFloat(v.replace('.', '').replace(',', '.'));

async function purchaseCredits(amountCredits: number) {
  if (!currentUser) return;
  const pkg = CREDIT_PACKAGES.find(p => p.credits === amountCredits);
  if (!pkg) return;
  const price = toNumber(pkg.price);
  const url = await createMpCheckout(currentUser.email, `${pkg.credits} créditos`, price);
  if (url) window.location.href = url;
}

async function purchaseSubscription() {
  if (!currentUser || isSubscribed) return;
  const price = toNumber(SUBSCRIPTION_PACKAGE.price);
  const url = await createMpCheckout(currentUser.email, 'Plano mensal', price);
  if (url) window.location.href = url;
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
