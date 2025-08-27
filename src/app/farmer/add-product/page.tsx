import type { Metadata } from "next";
import AddProductForm from "./AddProduct";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Add a new product to your inventory",
};

export default function AddProductPage() {
  return <AddProductForm />;
}
