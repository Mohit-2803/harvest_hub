// app/farmer/orders/OrderRowClient.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";

const STATUS_OPTIONS = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderProp = {
  id: string;
  customer?: { name?: string | null } | null;
  status: string;
  totalAmount: string | number;
  createdAt: string;
};

export default function OrderRowClient({ order }: { order: OrderProp }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/farmer/update-order", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data?.error || "Failed to update order");
      } else {
        router.refresh();
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TableRow key={order.id}>
      <TableCell className="font-medium">{order.id.slice(0, 8)}...</TableCell>
      <TableCell className="font-medium">
        {order.customer?.name || "Guest"}
      </TableCell>
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
      <TableCell className="font-medium">
        {new Date(order.createdAt).toLocaleDateString("en-IN")}
      </TableCell>

      <TableCell>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <input type="hidden" name="orderId" value={order.id} />
          <select
            name="status"
            defaultValue={order.status}
            className="rounded-md border px-2 py-1 cursor-pointer"
            disabled={loading}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-3 py-1 rounded-md cursor-pointer bg-slate-700 text-white hover:opacity-90 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </TableCell>
    </TableRow>
  );
}
