// app/customer/cart/CheckoutButton.tsx
"use client";

import { useTransition } from "react";

export function CheckoutButton({
  items,
}: {
  items: { productId: string; quantity: number }[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/orders/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const json = await res.json();
        if (!res.ok || !json?.url)
          throw new Error(json?.error || "Checkout failed");
        window.location.href = json.url as string;
      } catch (e) {
        console.error(e);
        alert("Failed to start checkout. Please try again.");
      }
    });
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isPending || items.length === 0}
      className="cursor-pointer mt-6 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
    >
      {isPending ? "Redirecting..." : "Proceed to Checkout"}
    </button>
  );
}
