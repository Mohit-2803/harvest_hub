import {
  deleteProduct,
  getFarmerProducts,
} from "@/app/actions/farmer-actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";

export default async function ManageInventory() {
  const result = await getFarmerProducts();

  if (!result.ok) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📦 Manage Inventory</h1>
        <p className="text-red-600">{result.error}</p>
      </div>
    );
  }

  const products = result.data;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Inventory</h1>

      {products.length === 0 ? (
        <div>
          <p className="text-gray-500">No products found. Add some products!</p>
          <Link href="/farmer/add-product">
            <Button className="mt-4 cursor-pointer" variant="outline">
              Add Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="shadow-md hover:shadow-lg transition"
            >
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {product.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <p className="text-sm text-gray-600 mb-2">
                  {product.description}
                </p>
                <p className="font-semibold">₹{product.price.toString()}</p>
                <p className="text-sm text-gray-500">
                  Stock: {product.quantity}
                </p>

                <div className="flex justify-between mt-4">
                  <Link href={`/farmer/edit-product/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <Button type="submit" variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
