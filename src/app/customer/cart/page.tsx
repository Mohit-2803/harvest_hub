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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCartIcon className="h-6 w-6" />
        <h1 className="text-2xl sm:text-3xl font-medium tracking-tight">
          My Cart
        </h1>
      </div>

      {cart.items.length === 0 ? (
        <div className="rounded-lg border p-6 sm:p-8 text-center">
          <p className="text-gray-600 font-semibold">Your cart is empty.</p>
          <Link
            href="/customer/marketplace"
            className="mt-4 inline-block text-sm sm:text-base text-indigo-600 font-medium hover:underline"
          >
            Continue shopping →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Items column (spans 2 on desktop) */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 rounded-xl border p-3 sm:p-4"
                >
                  <div className="flex-shrink-0 w-full sm:w-28 h-40 sm:h-auto relative rounded-md overflow-hidden bg-gray-50">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 200px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h2
                        className="font-medium text-sm sm:text-base text-gray-800 truncate"
                        title={item.name}
                      >
                        {item.name}
                      </h2>

                      <div className="mt-3 flex items-center gap-3">
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {formatCurrency(Number(item.price))}
                        </p>

                        <p className="text-xs text-red-500 line-through font-medium">
                          {formatCurrency(
                            Number(item.price) + Number(item.price) * 0.2
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <QuantityControls
                          cartItemId={item.id}
                          initialQuantity={item.quantity}
                        />
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-sm sm:text-base">
                          {formatCurrency(Number(item.lineTotal))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary panel */}
            <aside className="rounded-xl border p-4 sm:p-6 h-fit bg-white lg:sticky lg:top-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Order Summary</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                <div className="border-t my-2" />

                <div className="flex justify-between items-center font-semibold">
                  <span className="text-lg">Total</span>
                  <span className="text-lg text-orange-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Desktop/large checkout button */}
              <div className="mt-4 hidden md:block">
                <CheckoutButton items={items} />
              </div>

              {/* Small helper text */}
              <p className="mt-3 text-xs text-gray-500">
                You can modify quantities in the list above. Shipping calculated
                at checkout.
              </p>
            </aside>
          </div>

          {/* Mobile fixed checkout bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 p-3">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Total</span>
                <span className="font-semibold">{formatCurrency(total)}</span>
              </div>

              <div className="w-1/2">
                {/* Keep CheckoutButton as client component; on mobile we show it here */}
                <CheckoutButton items={items} />
              </div>
            </div>
          </div>

          {/* Add bottom padding so page content isn't hidden behind the fixed bar */}
          <div className="md:hidden h-20" />
        </>
      )}
    </div>
  );
}
