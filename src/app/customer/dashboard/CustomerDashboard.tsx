import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ListOrdered } from "lucide-react";
import Link from "next/link";
import { getLatestAddedFarmProducts } from "@/app/actions/customer-actions/actions";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);
  const customerName = session?.user?.name || "Customer";

  const products = await getLatestAddedFarmProducts();

  return (
    <div className="min-h-screen bg-gray-50 p-8 px-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {customerName.toUpperCase()}
        </h1>
        <p className="text-gray-500">
          Discover fresh produce directly from farmers & manage your orders.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition rounded-2xl">
          <CardContent className="flex flex-col items-center p-6">
            <ShoppingCart className="w-10 h-10 text-green-600 mb-2" />
            <h2 className="font-semibold">Go to Marketplace</h2>
            <Link href="/customer/marketplace">
              <Button className="mt-3 w-full cursor-pointer">Browse</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition rounded-2xl">
          <CardContent className="flex flex-col items-center p-6">
            <ListOrdered className="w-10 h-10 text-blue-600 mb-2" />
            <h2 className="font-semibold">View My Orders</h2>
            <Link href="/customer/orders">
              <Button className="mt-3 w-full cursor-pointer">Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Product Feed */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Fresh Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products available right now.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product.id}
                className="rounded-2xl shadow-sm hover:shadow-lg transition"
              >
                <CardContent className="p-4 flex flex-col">
                  <Image
                    src={product.image || "/file.svg"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    width={160}
                    height={160}
                  />
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm">
                    by {product.farmer.name}
                  </p>
                  <p className="text-xl font-bold mt-2">
                    ₹{product.price.toString()}
                  </p>
                  <form action="/customer/cart/add">
                    <input type="hidden" name="productId" value={product.id} />
                    <Button type="submit" className="mt-3 cursor-pointer">
                      Add to Cart
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
