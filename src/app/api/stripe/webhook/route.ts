// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import prisma from "@/lib/prisma";
import UpdateCartContextForWebhook from "./updateCartContext";

// This webhook is called by Stripe when an event occurs
export const runtime = "nodejs";

export async function POST(req: Request) {
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature") || "";

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentIntentId = session.payment_intent;

      if (!orderId) {
        console.warn("Webhook: checkout.session.completed without orderId");
        return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
      }

      // Update the order status
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            stripePaymentIntentId:
              typeof paymentIntentId === "string" ? paymentIntentId : undefined,
            stripeSessionId: session.id,
          },
        });

        // Get the order with its items
        const orderWithItems = await prisma.order.findUnique({
          where: { id: orderId },
          include: { orderItems: true },
        });

        if (orderWithItems?.orderItems) {
          for (const item of orderWithItems.orderItems) {
            await tx.product.update({
              where: { id: item.productId },
              data: { quantity: { decrement: item.quantity } },
            });
          }
        }

        // Clear cart items for the user and also cart count from context
        await tx.cartItem.deleteMany({
          where: { cart: { userId: orderWithItems?.customerId ?? "" } },
        });

        UpdateCartContextForWebhook();
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.log(`Error: ${errorMessage}`);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }
}
