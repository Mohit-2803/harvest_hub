import type { Metadata } from "next";
import ProductInfoPage from "./productInfo";

export const metadata: Metadata = {
  title: "Product Details",
  description: "Explore the details of a specific product.",
};

export default function MarketPlacePage({
  params,
}: {
  params: { id: string };
}) {
  return <ProductInfoPage params={params} />;
}
