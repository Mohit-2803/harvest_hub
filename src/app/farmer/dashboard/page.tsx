import type { Metadata } from "next";
import ClientDashboard from "./ClientDashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Connecting farmers, buyers, and experts",
};

export default function FarmerDashboard() {
  return <ClientDashboard />;
}
