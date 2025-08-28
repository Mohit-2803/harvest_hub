"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import {
  BarChart3,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import {
  farmerDashboardInfo,
  getFarmerRecentOrders,
} from "@/app/actions/farmer-actions/actions";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatCurrency";
import Spinner from "@/components/Spinner";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
  items: { productName: string; quantity: number; amount: number }[];
}

const statusVariant = (status: string) => {
  switch (status) {
    case "PENDING":
      return "secondary" as const;
    case "DELIVERED":
      return "success" as const;
    case "CANCELLED":
      return "destructive" as const;
    case "PAID":
      return "success" as const;
    case "SHIPPED":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const [dashboardInfo, setDashboardInfo] = useState<
    { productsCount: number; ordersCount: number; earnings: number } | undefined
  >(undefined);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await farmerDashboardInfo();
        if (result.ok) setDashboardInfo(result.data);

        const orders = await getFarmerRecentOrders();
        setRecentOrders(orders);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const farmerName = user?.name || "Farmer";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="px-6 md:px-16 pt-10 pb-4">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-gray-500">Welcome back</p>
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-gray-900">
            {farmerName.toUpperCase()}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage farm products, orders, and earnings in one place.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="px-6 md:px-16">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/farmer/add-product" className="group">
            <Card className="rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Package className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Add a Product
                    </h2>
                    <p className="text-sm text-gray-500">
                      Create a new listing
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-emerald-700" />
                </div>
                <Button className="mt-4 w-full cursor-pointer">Add</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/farmer/manage-inventory" className="group">
            <Card className="rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <BarChart3 className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-gray-900">Inventory</h2>
                    <p className="text-sm text-gray-500">Stock and pricing</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-indigo-700" />
                </div>
                <Button className="mt-4 w-full cursor-pointer">Manage</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/farmer/orders" className="group">
            <Card className="rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                    <ShoppingCart className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-gray-900">Orders</h2>
                    <p className="text-sm text-gray-500">Manage requests</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-orange-700" />
                </div>
                <Button className="mt-4 w-full cursor-pointer">View</Button>
              </CardContent>
            </Card>
          </Link>

          <div className="group">
            <Card className="rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                    <DollarSign className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-semibold text-gray-900">Earnings</h2>
                    <p className="text-sm text-gray-500">This month so far</p>
                  </div>
                </div>
                <div className="mt-3 text-2xl font-bold text-gray-900">
                  <CountUp
                    end={dashboardInfo?.earnings ?? 0}
                    duration={3.5}
                    separator=","
                  />
                </div>
                <Button
                  className="mt-4 w-full cursor-pointer"
                  variant="outline"
                >
                  Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-16 mt-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 rounded-2xl shadow-sm bg-white">
            <h3 className="text-gray-500 font-semibold">Total Products</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              <CountUp
                end={dashboardInfo?.productsCount ?? 0}
                duration={3.5}
                separator=","
              />
            </p>
          </Card>
          <Card className="p-6 rounded-2xl shadow-sm bg-white">
            <h3 className="text-gray-500 font-semibold">Pending Orders</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              <CountUp
                end={dashboardInfo?.ordersCount ?? 0}
                duration={3.5}
                separator=","
              />
            </p>
          </Card>
          <Card className="p-6 rounded-2xl shadow-sm bg-white">
            <h3 className="text-gray-500 font-semibold">This Month Earnings</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              <CountUp
                end={dashboardInfo?.earnings ?? 0}
                duration={3.5}
                separator=","
              />
            </p>
          </Card>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="px-6 md:px-16 my-8 pb-12">
        <div className="mx-auto max-w-7xl">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link
                  href="/farmer/orders"
                  className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                >
                  View all →
                </Link>
              </div>

              {loading ? (
                <Spinner />
              ) : recentOrders.length === 0 ? (
                <p className="mt-4 text-gray-500">No recent orders found.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-sm text-gray-500">
                        <th className="pb-2 pr-2">Order ID</th>
                        <th className="pb-2 pr-2">Product</th>
                        <th className="pb-2 pr-2">Qty</th>
                        <th className="pb-2 pr-2">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {recentOrders.map((order) =>
                        order.items.map((item, idx) => (
                          <tr
                            key={`${order.id}-${idx}`}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 pr-2 font-mono text-gray-700">
                              #{order.id.slice(0, 12)}
                            </td>
                            <td className="py-3 pr-2 font-medium">
                              {item.productName}
                            </td>
                            <td className="py-3 pr-2 font-medium">
                              {item.quantity}
                            </td>
                            <td className="py-3 pr-2 font-medium">
                              {formatCurrency(item.amount)}
                            </td>
                            <td className="py-3">
                              <Badge variant={statusVariant(order.status)}>
                                {order.status}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
