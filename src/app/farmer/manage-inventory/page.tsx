import type { Metadata } from "next";
import ManageInventory from "./ManageInventory";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Manage your inventory effectively",
};

export default function ManageInventoryPage() {
  return <ManageInventory />;
}
