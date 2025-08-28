import {
  getLatestAddedFarmProducts,
  getSearchedProducts,
} from "@/app/actions/customer-actions/actions";
import SearchBar from "@/components/searchbar";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "./AddToCartButton";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const searchTerm = searchParams?.q || "";
  const products = searchTerm
    ? await getSearchedProducts(searchTerm)
    : await getLatestAddedFarmProducts();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Marketplace</h1>
        <SearchBar defaultValue={searchTerm} />
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-56">
                <Image
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold group-hover:text-green-600 transition">
                  {product.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>
                <Separator className="my-3" />
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <p className="text-lg font-medium text-gray-900">
                      <span className="font-medium text-base">Price</span> : ₹
                      {product.price.toString()}.00
                    </p>
                    {/* cut the price */}
                    <p className="text-red-500 text-sm line-through font-medium">
                      ₹
                      {(
                        Number(product.price) * 0.2 +
                        Number(product.price)
                      ).toString()}
                      .00
                    </p>
                  </div>

                  <Link
                    href={`/customer/marketplace/products/${product.id}`}
                    className="text-md font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    View →
                  </Link>
                </div>

                {/* Client Component button */}
                <AddToCartButton productId={product.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
