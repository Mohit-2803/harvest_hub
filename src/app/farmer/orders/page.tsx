import type { Metadata } from "next";
import Orders from "./Orders";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Manage your orders effectively",
};

export default function OrdersPage() {
  return <Orders />;
}
