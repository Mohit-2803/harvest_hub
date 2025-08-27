import type { Metadata } from "next";
import MarketplacePage from "./MarketPlace";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Explore a variety of products from local farmers.",
};

export default function MarketPlacePage() {
  return <MarketplacePage />;
}
