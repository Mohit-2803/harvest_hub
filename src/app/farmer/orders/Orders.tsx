// app/farmer/orders/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFarmerOrders } from "@/app/actions/farmer-actions/actions";
import OrderRowClient from "./OrderRowClient";

export default async function Orders() {
  const orders = await getFarmerOrders();

  // make objects serializable for client component (Dates -> strings)
  const safeOrders = orders.map((o) => ({
    ...o,
    createdAt:
      o.createdAt instanceof Date
        ? o.createdAt.toISOString()
        : String(o.createdAt),
    totalAmount: o.totalAmount?.toString?.() ?? String(o.totalAmount ?? ""),
  }));

  return (
    <div className="max-w-5xl mx-auto p-6 h-[80vh]">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {safeOrders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {safeOrders.map((order) => (
                  <OrderRowClient key={order.id} order={order} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
