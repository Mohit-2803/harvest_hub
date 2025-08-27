import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";

export default async function Orders() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6 h-[80vh]">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{order.customer.name || "Guest"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "PENDING"
                            ? "secondary"
                            : order.status === "SHIPPED"
                            ? "outline"
                            : order.status === "DELIVERED"
                            ? "success"
                            : order.status === "CANCELLED"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{order.totalAmount.toString()}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
