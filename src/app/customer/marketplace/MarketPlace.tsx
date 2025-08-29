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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
          Marketplace
        </h1>
        <div className="w-full sm:w-auto">
          <SearchBar defaultValue={searchTerm} />
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600 text-sm">No products found.</p>
      ) : (
        // mobile: 2 columns, keep sm:2 and lg:3
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              {/* Clickable image on mobile; disabled on md+ so desktop uses "View" link */}
              <Link
                href={`/customer/marketplace/products/${product.id}`}
                className="relative w-full block md:pointer-events-none md:cursor-default"
                aria-label={`View details for ${product.name}`}
              >
                <div className="relative w-full h-44 md:h-56">
                  <Image
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 639px) 50vw, (min-width: 640px) 33vw, (min-width: 1024px) 25vw"
                  />
                </div>
              </Link>

              <div className="p-4 md:p-5 flex flex-col flex-grow">
                <h2
                  className="text-sm md:text-lg font-semibold group-hover:text-green-600 transition break-words"
                  title={product.name}
                >
                  {product.name}
                </h2>

                <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2 break-words">
                  {product.description || "Freshly sourced from local farms."}
                </p>

                <Separator className="my-3" />

                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <p className="text-sm md:text-base font-medium text-gray-900 leading-tight">
                      <span className="font-medium text-xs md:text-sm">
                        Price
                      </span>{" "}
                      : ₹{product.price.toString()}.00
                    </p>
                    <p className="text-red-500 text-xs line-through font-medium mt-0.5">
                      ₹
                      {(
                        Number(product.price) * 0.2 +
                        Number(product.price)
                      ).toString()}
                      .00
                    </p>
                  </div>

                  {/* Hide View on mobile, show on md+ */}
                  <Link
                    href={`/customer/marketplace/products/${product.id}`}
                    className="hidden md:inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
                  >
                    View →
                  </Link>
                </div>

                {/* Client Component button */}
                <div className="mt-3">
                  <AddToCartButton productId={product.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
