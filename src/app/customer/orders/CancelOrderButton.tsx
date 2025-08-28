"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cancelOrder } from "@/app/actions/customer-actions/actions";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      try {
        await cancelOrder(orderId);
        toast.success("Order cancelled successfully!");
      } catch {
        toast.error("Failed to cancel order.");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <Button variant="destructive">Cancel Order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to cancel?</DialogTitle>
          <p className="text-sm text-gray-500">
            The order once cancelled cannot be undone.
          </p>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleCancel}
            className="cursor-pointer"
          >
            {isPending ? "Cancelling..." : "Yes, Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
