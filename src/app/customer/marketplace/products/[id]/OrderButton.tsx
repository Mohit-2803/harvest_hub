// src/app/customer/marketplace/products/[id]/OrderButton.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import OrderModal from "@/components/OrderModal";

export default function OrderButton(props: {
  productId: string;
  productName: string;
}) {
  const { productId, productName } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Order Now
      </Button>
      <OrderModal
        productId={productId}
        productName={productName}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
