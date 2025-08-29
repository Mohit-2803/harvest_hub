// components/marketplace/AddToCartButton.tsx
"use client";

import { useTransition } from "react";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/app/actions/cart-actions/actions";
import { toast } from "sonner";
import { useCartCount } from "@/app/context/CartProvider";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();
  const { setCartCount } = useCartCount();

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart(productId, 1);
        toast.success("Item added to cart");
        setCartCount((count) => count + 1);
      } catch (err) {
        console.error("Failed to add to cart:", err);
        toast.error("Failed to add item to cart");
      }
    });
  };

  return (
    <Button
      type="button"
      onClick={handleAddToCart}
      disabled={isPending}
      aria-label="Add item to cart"
      className="mt-4 w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 font-medium text-white hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <ShoppingCart size={18} />
      {isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
