"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import {
  farmerDashboardInfo,
  getFarmerRecentOrders,
} from "@/app/actions/farmer-actions/actions";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  items: { productName: string; quantity: number; amount: number }[];
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [dashboardInfo, setDashboardInfo] = useState<
    { productsCount: number; ordersCount: number } | undefined
  >(undefined);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await farmerDashboardInfo();
      if (result.ok) {
        setDashboardInfo(result.data);
      }

      const orders = await getFarmerRecentOrders();
      setRecentOrders(orders);
    };

    fetchData();
  }, []);

  const farmerName = user?.name || "Farmer";

  return (
    <div className="min-h-screen bg-gray-50 p-8 px-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {farmerName.toUpperCase()}!
        </h1>
        <p className="text-gray-500">
          Manage your farm products, orders, and earnings here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition rounded-2xl">
          <CardContent className="flex flex-col items-center p-6">
            <Package className="w-10 h-10 text-green-600 mb-2" />
            <h2 className="font-semibold">Add a new Product</h2>
            <Link href="/farmer/add-product">
              <Button className="mt-3 w-full cursor-pointer">Add</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition rounded-2xl">
          <CardContent className="flex flex-col items-center p-6">
            <BarChart3 className="w-10 h-10 text-blue-600 mb-2" />
            <h2 className="font-semibold">Manage your Inventory</h2>
            <Link href="/farmer/manage-inventory">
              <Button className="mt-3 w-full cursor-pointer">Manage</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition rounded-2xl">
          <CardContent className="flex flex-col items-center p-6">
            <ShoppingCart className="w-10 h-10 text-orange-600 mb-2" />
            <h2 className="font-semibold">Manage your Orders</h2>
            <Link href="/farmer/orders">
              <Button className="mt-3 w-full cursor-pointer">View</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition rounded-2xl">
          <CardContent className="flex flex-col items-center p-6">
            <DollarSign className="w-10 h-10 text-yellow-600 mb-2" />
            <h2 className="font-semibold">Earnings</h2>
            <Button className="mt-3 w-full">Check</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 rounded-2xl shadow-sm">
          <h3 className="text-gray-500 font-semibold">Total Products</h3>
          <p className="text-2xl font-bold text-gray-800">
            {dashboardInfo?.productsCount || 0}
          </p>
        </Card>
        <Card className="p-6 rounded-2xl shadow-sm">
          <h3 className="text-gray-500 font-semibold">Pending Orders</h3>
          <p className="text-2xl font-bold text-gray-800">
            {dashboardInfo?.ordersCount || 0}
          </p>
        </Card>
        <Card className="p-6 rounded-2xl shadow-sm">
          <h3 className="text-gray-500 font-semibold">This Month Earnings</h3>
          <p className="text-2xl font-bold text-gray-800">₹ 25,300</p>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders found.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) =>
                  order.items.map(
                    (
                      item: {
                        productName: string;
                        quantity: number;
                        amount: number;
                      },
                      idx: number
                    ) => (
                      <tr
                        key={`${order.id}-${idx}`}
                        className="border-b hover:bg-gray-50"
                      >
                        <td>#{order.id.slice(0, 12)}</td>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.amount}</td>
                        <td>
                          <Badge
                            variant={
                              order.status === "PENDING"
                                ? "secondary"
                                : order.status === "DELIVERED"
                                ? "success"
                                : order.status === "CANCELLED"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
