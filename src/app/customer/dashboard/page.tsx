import type { Metadata } from "next";
import CustomerDashboard from "./CustomerDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Connecting farmers, buyers, and experts",
};

export default function CustomerDashboardPage() {
  return <CustomerDashboard />;
}
