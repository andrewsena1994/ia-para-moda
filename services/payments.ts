*** Begin Patch
*** Add File: services/payments.ts
+// services/payments.ts
+//
+// This module provides a helper to create a Mercado Pago checkout session via
+// your back‑end API. It posts to the Cloud Run endpoint and returns the URL
+// where the user can complete their purchase. If any error occurs (e.g.
+// network issues or missing configuration), the function returns null.
+
+export async function createMpCheckout(
+  userId: string,
+  title: string,
+  amount: number
+): Promise<string | null> {
+  try {
+    const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/mp/checkout`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ userId, title, amount }),
+    });
+    const data = await response.json();
+    if (data.ok && data.url) {
+      return data.url as string;
+    }
+    console.error('Mercado Pago returned an unexpected response:', data);
+    return null;
+  } catch (error) {
+    console.error('Failed to create Mercado Pago checkout', error);
+    return null;
+  }
+}
*** End Patch
*** Begin Patch
*** Update File: App.tsx
@@
-        return <Account credits={credits} onAddCredits={addCredits} onSubscribe={startSubscription} isSubscribed={isSubscribed} />;
+        return <Account
+          credits={credits}
+          onAddCredits={purchaseCredits}
+          onSubscribe={purchaseSubscription}
+          isSubscribed={isSubscribed}
+        />;
*** End Patch
