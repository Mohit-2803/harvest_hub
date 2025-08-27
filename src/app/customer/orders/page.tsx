import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cancelOrder } from "@/app/actions/customer-actions/actions";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";

export default async function CustomerOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border bg-white p-6 text-center shadow-sm">
          <p className="text-gray-600">Please login to view your orders.</p>
        </div>
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          My Orders
        </h1>
        <p className="text-gray-600">
          Track status, view items, and manage orders.
        </p>
      </div>

      {orders.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-500 shadow-sm">
          No orders found.
        </div>
      )}

      <div className="space-y-5">
        {orders.map((order) => {
          const created = order.createdAt.toDateString();
          const totalStr = order.totalAmount.toString();
          const isPending = order.status === "PENDING";
          const isCancelled = order.status === "CANCELLED";

          const statusClass = isPending
            ? "bg-yellow-100 text-yellow-800 ring-yellow-200"
            : isCancelled
            ? "bg-red-100 text-red-800 ring-red-200"
            : "bg-emerald-100 text-emerald-800 ring-emerald-200";

          const statusLabel = isPending
            ? "Pending"
            : isCancelled
            ? "Cancelled"
            : "Completed";

          return (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle className="text-base font-semibold text-gray-900">
                  <span className="text-gray-500">Order</span> #{order.id}
                </CardTitle>
                <Badge className={statusClass}>{statusLabel}</Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Placed on</p>
                    <p className="text-sm font-medium text-gray-800">
                      {created}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{totalStr}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Items</p>
                    <p className="text-sm font-medium text-gray-800">
                      {order.orderItems.length}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border">
                  <div className="divide-y">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isPending && (
                  <div className="flex justify-end">
                    <form
                      action={async () => {
                        "use server";
                        await cancelOrder(order.id);
                      }}
                    >
                      <Button variant="destructive">Cancel Order</Button>
                    </form>
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
