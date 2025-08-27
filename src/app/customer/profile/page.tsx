import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CustomerProfilePage from "./CustomerProfile";

export async function generateMetadata() {
  const session = await getServerSession(authOptions);
  const username = session?.user?.name || "User";

  return {
    title: `${username.toUpperCase()}`,
    description: "Manage your profile effectively",
  };
}

export default function OrdersPage() {
  return <CustomerProfilePage />;
}
