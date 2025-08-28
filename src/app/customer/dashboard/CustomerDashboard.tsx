import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ListOrdered, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { getLatestAddedFarmProducts } from "@/app/actions/customer-actions/actions";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/formatCurrency";

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);
  const customerName = session?.user?.name || "Customer";
  const products = await getLatestAddedFarmProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="px-6 md:px-16 pt-10">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border bg-white p-6 md:p-8 shadow-sm">
              <p className="text-sm text-gray-500">Welcome back</p>
              <h1 className="mt-1 text-3xl md:text-4xl font-medium tracking-tight text-gray-900">
                {customerName.toUpperCase()}
              </h1>
              <p className="mt-3 text-gray-600">
                Discover fresh, farm-direct produce and manage orders with ease.
              </p>

              {/* Quick actions */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/customer/marketplace" className="group">
                  <Card className="rounded-2xl shadow-sm hover:shadow-md hover:translate-y-[-2px] transition">
                    <CardContent className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                          <ShoppingCart className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            Go to Marketplace
                          </h2>
                          <p className="text-sm text-gray-500">
                            Browse fresh products
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition" />
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/customer/orders" className="group">
                  <Card className="rounded-2xl shadow-sm hover:shadow-md hover:translate-y-[-2px] transition">
                    <CardContent className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                          <ListOrdered className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            View My Orders
                          </h2>
                          <p className="text-sm text-gray-500">
                            Track and manage orders
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>

          {/* Side promo or info */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border bg-emerald-600 text-white p-6 md:p-8 shadow-sm overflow-hidden relative">
              <div className="absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-emerald-500/30 blur-2xl" />
              <h3 className="text-xl font-semibold">Farm-to-Table</h3>
              <p className="mt-2 text-emerald-50">
                Support local farmers and enjoy fresher produce delivered
                faster.
              </p>
              <Link
                href="/customer/marketplace"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
              >
                Explore now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Feed */}
      <section className="px-6 md:px-16 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Fresh Products
            </h2>
            <Link
              href="/customer/marketplace"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all →
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No products available right now.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const price =
                  typeof product.price === "number"
                    ? product.price
                    : Number(product.price);
                const farmerName = product.farmer?.farmName ?? "—";
                const farmerLoc = product.farmer?.farmLocation ?? "";
                return (
                  <Card
                    key={product.id}
                    className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
                  >
                    <CardContent className="p-0">
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={product.image || "/file.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute left-3 bottom-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-900 shadow-sm">
                            {farmerName}
                            {farmerLoc && (
                              <span className="inline-flex items-center gap-1 text-gray-500">
                                <MapPin className="h-3 w-3" />
                                {farmerLoc}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {product.description ||
                            "Freshly sourced from local farms."}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex flex-row items-center gap-2">
                            <span className="text-lg font-bold text-emerald-700">
                              {formatCurrency(price)}
                            </span>
                            <span className="text-sm font-medium text-red-400 line-through">
                              {formatCurrency(Number(price) * 1.2)}
                            </span>
                          </div>
                          <Link
                            href={`/customer/marketplace/products/${product.id}`}
                            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                          >
                            Details →
                          </Link>
                        </div>

                        {/* Server-action friendly Add to Cart form */}
                        <form action="/customer/cart/add" className="mt-3">
                          <input
                            type="hidden"
                            name="productId"
                            value={product.id}
                          />
                          <Button
                            type="submit"
                            className="w-full cursor-pointer inline-flex items-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
