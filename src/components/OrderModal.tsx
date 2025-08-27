"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { placeOrder } from "@/app/actions/customer-actions/actions";

type OrderModalProps = {
  productId: string;
  productName: string;
  open: boolean;
  onClose: () => void;
};

export default function OrderModal({
  productId,
  productName,
  open,
  onClose,
}: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleOrder() {
    setLoading(true);
    try {
      await placeOrder(productId, quantity);
      toast.success(`Order placed for ${quantity} × ${productName}`);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to place order";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order {productName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <label className="text-sm font-medium">Quantity</label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleOrder} disabled={loading}>
            {loading ? "Placing..." : "Place Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
