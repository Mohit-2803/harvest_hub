// app/cart/page.tsx
import Image from "next/image";
import Link from "next/link";
import { QuantityControls } from "./quantity-controls";
import { formatCurrency } from "@/lib/formatCurrency";
import { getCart } from "@/app/actions/cart-actions/actions";
import { CheckoutButton } from "./CheckoutButton";
import { Receipt, ShoppingCartIcon } from "lucide-react";

export const metadata = {
  title: "My Cart",
  description: "View your shopping cart",
};

export default async function CartPage() {
  const cart = await getCart();

  const subtotal = Number(cart.subtotal);
  const shipping = Number(cart.shipping);
  const total = Number(cart.total);

  const items = cart.items.map((i) => ({
    productId: i.productId,
    quantity: i.quantity,
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 h-screen">
      <div className="text-3xl flex items-center mb-6 gap-2">
        <ShoppingCartIcon />
        <h1 className="font-medium tracking-tight ">My Cart</h1>
      </div>

      {cart.items.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-gray-600 font-bold">Cart is empty.</p>
          <Link
            href="/customer/marketplace"
            className="mt-4 text-lg inline-block text-indigo-600 font-medium hover:underline"
          >
            Continue shopping →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-xl border p-4">
                <div className="relative w-28 h-28 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-medium text-gray-700">{item.name}</h2>
                  <p className="text-gray-600 mt-1 font-bold">
                    {formatCurrency(Number(item.price))}
                  </p>
                  <div className="mt-3">
                    <QuantityControls
                      cartItemId={item.id}
                      initialQuantity={item.quantity}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(Number(item.lineTotal))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-xl border p-6 h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Receipt />
              <h3 className="text-lg font-semibold">Order Summary</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="font-medium text-green-600">Free</span>
                  ) : (
                    formatCurrency(shipping)
                  )}
                </span>
              </div>
              <div className="border-t my-2" />
              <div className="flex justify-between font-semibold">
                <span className="text-lg">Total</span>
                <span className="text-lg text-orange-600">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Use client button that posts to your /api/orders/checkout */}
            <CheckoutButton items={items} />
          </div>
        </div>
      )}
    </div>
  );
}
