// app/cart/quantity-controls.tsx
"use client";

import { useState, useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  updateCartItem,
  removeFromCart,
} from "@/app/actions/cart-actions/actions";
import { useCartCount } from "@/app/context/CartProvider";

type Props = {
  cartItemId: string;
  initialQuantity: number;
};

export function QuantityControls({ cartItemId, initialQuantity }: Props) {
  const [qty, setQty] = useState(initialQuantity);
  const [isPending, startTransition] = useTransition();
  const { setCartCount } = useCartCount();

  const updateQty = (next: number) => {
    if (next < 1) return;
    const delta = next - qty;
    const prev = qty;
    setQty(next);
    startTransition(async () => {
      try {
        await updateCartItem(cartItemId, next);
        if (delta !== 0) setCartCount((n) => n + delta);
      } catch {
        setQty(prev);
      }
    });
  };

  const remove = () => {
    const prev = qty;
    setQty(0);
    startTransition(async () => {
      try {
        await removeFromCart(cartItemId);
        setCartCount((n) => Math.max(0, n - prev));
      } catch {
        setQty(prev);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center rounded-md border">
        <button
          className="px-2 py-1 hover:bg-gray-50"
          onClick={() => updateQty(qty - 1)}
          disabled={isPending || qty <= 1}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="w-10 text-center font-medium">{qty}</span>
        <button
          className="px-2 py-1 hover:bg-gray-50"
          onClick={() => updateQty(qty + 1)}
          disabled={isPending}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        onClick={remove}
        className="inline-flex items-center gap-1 font-medium cursor-pointer text-red-600 hover:text-red-700 disabled:opacity-60"
        disabled={isPending}
        aria-label="Remove item"
      >
        <Trash2 size={16} />
        Remove
      </button>
    </div>
  );
}
