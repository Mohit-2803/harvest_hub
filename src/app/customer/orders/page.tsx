import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CancelOrderButton from "./CancelOrderButton";

export default async function CustomerOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border bg-white p-6 text-center shadow-md">
          <p className="text-gray-600">Please login to view your orders.</p>
        </div>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 min-h-screen">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          My Orders
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Track status, view items, and manage orders.
        </p>
      </div>

      {/* No orders */}
      {orders.length === 0 && (
        <div className="rounded-xl border font-semibold bg-white p-8 sm:p-10 text-center text-gray-500 shadow-sm">
          <p>No orders found.</p>
          <Link href="/customer/marketplace">
            <Button variant="outline" className="mt-4 cursor-pointer">
              Browse Marketplace
            </Button>
          </Link>
        </div>
      )}

      {/* Orders list */}
      <div className="space-y-6">
        {orders.map((order) => {
          const created = order.createdAt.toLocaleDateString();
          const totalStr = order.totalAmount.toFixed(2);

          let statusClass = "";
          let statusLabel = "";

          switch (order.status) {
            case "PENDING":
              statusClass = "bg-yellow-100 text-yellow-800";
              statusLabel = "Pending";
              break;
            case "PAID":
              statusClass = "bg-blue-100 text-blue-800";
              statusLabel = "Paid";
              break;
            case "SHIPPED":
              statusClass = "bg-purple-100 text-purple-800";
              statusLabel = "Shipped";
              break;
            case "DELIVERED":
              statusClass = "bg-emerald-100 text-emerald-800";
              statusLabel = "Delivered";
              break;
            case "CANCELLED":
              statusClass = "bg-red-100 text-red-800";
              statusLabel = "Cancelled";
              break;
            default:
              statusClass = "bg-gray-100 text-gray-800";
              statusLabel = order.status;
          }

          return (
            <Card
              key={order.id}
              className="overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              {/* Header */}
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <CardTitle className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  <span className="text-gray-500">Order ID -</span> #{order.id}
                </CardTitle>
                <Badge className={`${statusClass} w-fit text-xs sm:text-sm`}>
                  {statusLabel}
                </Badge>
              </CardHeader>

              {/* Content */}
              <CardContent className="space-y-5 pt-2 sm:pt-4">
                {/* Order Summary */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500">
                      Placed On
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {created}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500">Total</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{totalStr}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500">Items</p>
                    <p className="text-sm font-medium text-gray-800">
                      {order.orderItems.length}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="rounded-lg border divide-y">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-gray-50">
                          <Image
                            src={item.product.image || "/placeholder.png"}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-medium text-gray-900"
                            title={item.product.name}
                          >
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{item.product.price.toString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Cancel Button */}
                {order.status !== "DELIVERED" &&
                  order.status !== "CANCELLED" && (
                    <div className="flex justify-end">
                      <CancelOrderButton orderId={order.id} />
                    </div>
                  )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
