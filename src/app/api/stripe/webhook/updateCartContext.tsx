"use client";

import { useCartCount } from "@/app/context/CartProvider";

export default function UpdateCartContextForWebhook() {
  const { setCartCount } = useCartCount();
  setCartCount(0);
}
