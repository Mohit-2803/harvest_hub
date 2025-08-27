import {
  getLatestAddedFarmProducts,
  getSearchedProducts,
} from "@/app/actions/customer-actions/actions";
import SearchBar from "@/components/searchbar";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const searchTerm = searchParams?.q || "";
  console.log("Search Term in marketplace:", searchTerm);
  const products = searchTerm
    ? await getSearchedProducts(searchTerm)
    : await getLatestAddedFarmProducts();

  return (
    <div className="max-w-6xl mx-auto p-6 h-screen">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>

      <SearchBar defaultValue={searchTerm} />

      {products.length === 0 ? (
        <p className="text-gray-500 mt-6">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                width={300}
                height={200}
                className="object-cover rounded-md"
              />

              <Separator className="my-2" />

              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 mt-1">{product.description}</p>
              <p className="text-gray-600 mt-1">
                Price: ₹{product.price.toString()}
              </p>

              <Link
                href={`/customer/marketplace/products/${product.id}`}
                className="mt-4 inline-block font-medium text-indigo-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
