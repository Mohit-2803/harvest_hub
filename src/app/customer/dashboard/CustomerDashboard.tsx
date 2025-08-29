// app/customer/dashboard/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ListOrdered, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { getLatestAddedFarmProducts } from "@/app/actions/customer-actions/actions";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatCurrency } from "@/lib/formatCurrency";
import { Decimal } from "@/prisma/generated/prisma/runtime/library";
import { AddToCartButton } from "../marketplace/AddToCartButton";

interface Product {
  id: string;
  name: string;
  image: string | null;
  price: Decimal;
  description: string | null;
  farmer: {
    name: string | null;
    id: string;
    email: string;
    farmName: string | null;
    farmLocation: string | null;
  };
}

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);
  const customerName =
    typeof session?.user?.name === "string" && session.user.name.trim() !== ""
      ? session.user.name
      : "Customer";

  const productsRaw = await getLatestAddedFarmProducts();
  const products = Array.isArray(productsRaw) ? productsRaw : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="px-4 md:px-16 pt-6 md:pt-10">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border bg-white p-4 md:p-8 shadow-sm">
              <p className="text-sm text-gray-500">Welcome back</p>
              <h1 className="mt-1 text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-gray-900">
                {customerName.toUpperCase()}
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                Discover fresh, farm-direct produce and manage orders with ease.
              </p>

              {/* Quick actions */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/customer/marketplace" className="group">
                  <Card className="rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-2px] transition">
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                          <ShoppingCart className="h-4 w-4" />
                        </span>
                        <div>
                          <h2 className="font-semibold text-sm md:text-base text-gray-900">
                            Go to Marketplace
                          </h2>
                          <p className="text-xs text-gray-500">
                            Browse fresh products
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition" />
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/customer/orders" className="group">
                  <Card className="rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-2px] transition">
                    <CardContent className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                          <ListOrdered className="h-4 w-4" />
                        </span>
                        <div>
                          <h2 className="font-semibold text-sm md:text-base text-gray-900">
                            View My Orders
                          </h2>
                          <p className="text-xs text-gray-500">
                            Track and manage orders
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>

          {/* Side promo */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border bg-emerald-600 text-white p-4 md:p-6 shadow-sm overflow-hidden relative">
              <div className="absolute right-[-36px] top-[-36px] h-36 w-36 rounded-full bg-emerald-500/30 blur-2xl" />
              <h3 className="text-lg font-semibold">Farm-to-Table</h3>
              <p className="mt-2 text-sm">
                Support local farmers and enjoy fresher produce delivered
                faster.
              </p>
              <Link
                href="/customer/marketplace"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/20 transition"
              >
                Explore now <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Feed */}
      <section className="px-4 md:px-16 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900">
              Fresh Products
            </h2>
            <Link
              href="/customer/marketplace"
              className="text-xs md:text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              View all →
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              No products available right now.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product: Product) => {
                const price = Number(product?.price ?? 0);
                const farmerName = product?.farmer?.farmName ?? "—";

                return (
                  <Card
                    key={product?.id ?? Math.random().toString(36).slice(2)}
                    className="group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    <CardContent className="p-0">
                      <Link
                        href={`/customer/marketplace/products/${product?.id}`}
                        className="block relative h-28 sm:h-32 md:h-40 w-full overflow-hidden cursor-pointer md:cursor-default md:pointer-events-none"
                      >
                        <Image
                          src={product?.image || "/file.svg"}
                          alt={product?.name ?? "Product image"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 639px) 50vw, (min-width: 640px) 50vw, (min-width: 768px) 33vw, (min-width: 1024px) 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute left-2 bottom-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-900 shadow-sm max-w-[120px] truncate">
                            <MapPin className="h-3 w-3" />
                            {farmerName}
                          </span>
                        </div>
                      </Link>

                      <div className="p-3">
                        <h3
                          className="truncate text-sm font-semibold text-gray-900"
                          title={product?.name ?? ""}
                        >
                          {product?.name ?? "Untitled product"}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2 break-words">
                          {product?.description ||
                            "Freshly sourced from local farms."}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-bold text-emerald-700">
                              {formatCurrency(price)}
                            </span>
                            <span className="text-xs font-medium text-red-400 line-through">
                              {formatCurrency(price * 1.2)}
                            </span>
                          </div>

                          {/* Hide details link on mobile, show on md+ */}
                          <Link
                            href={`/customer/marketplace/products/${product?.id}`}
                            className="hidden md:inline-block text-xs font-medium text-emerald-700 hover:text-emerald-800"
                          >
                            Details →
                          </Link>
                        </div>

                        <div className="mt-2">
                          <AddToCartButton productId={String(product?.id)} />
                        </div>
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
