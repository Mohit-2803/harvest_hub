// src/app/customer/marketplace/products/[id]/ProductInfo.tsx
import Image from "next/image";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderButton from "./OrderButton";

export default async function ProductInfoPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { farmer: true },
  });
  if (!product) return notFound();

  const priceStr = product.price.toString();
  const imageSrc = product.image || "/file.svg";
  const alt = product.name ? `${product.name} product photo` : "Product photo";

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <div className="relative overflow-hidden rounded-xl border bg-white shadow-sm">
            <Image
              src={imageSrc}
              alt={alt}
              width={1280}
              height={720}
              className="h-72 w-full object-cover md:h-[420px]"
              priority
            />
          </div>
        </div>

        <aside className="md:col-span-2">
          <div className="sticky top-6 space-y-4 rounded-xl border bg-white p-5 shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2">
              <span className="text-xl text-gray-500">Price</span>
              <span className="text-2xl text-green-700 font-bold tracking-tight">
                ₹{priceStr}
              </span>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-800">
                Farmer:{" "}
                <span className="font-semibold">
                  {product.farmer?.name ?? "—"}
                </span>
              </p>
              <dl className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Farm Name</dt>
                  <dd className="font-medium">
                    {product.farmer?.farmName ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Location</dt>
                  <dd className="font-medium">
                    {product.farmer?.farmLocation ?? "—"}
                  </dd>
                </div>
              </dl>
            </div>

            <OrderButton productId={product.id} productName={product.name} />
          </div>
        </aside>
      </div>

      {/* Details section */}
      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Details</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800">Overview</h3>
            <p className="mt-2 text-sm text-gray-600">
              {product.description || "No additional description provided."}
            </p>
          </div>

          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800">Pricing</h3>
            <p className="mt-2 text-sm text-gray-600">
              Transparent farm-direct pricing for this product.
            </p>
            <p className="mt-2 text-base font-semibold">
              ₹{priceStr} per quantity
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
