// app/api/stripe/checkout/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid cart items" },
          { status: 400 }
        );
      }
    }

    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    for (const item of items) {
      const p = products.find((prod) => prod.id === item.productId)!;
      if (p.quantity < item.quantity) {
        return NextResponse.json(
          { error: "Insufficient product quantity" },
          { status: 400 }
        );
      }
      totalAmount += Number(p.price) * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        customerId: session.user.id,
        totalAmount,
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    const customers = await stripe.customers.list({
      email: session.user.email ?? undefined,
      limit: 1,
    });

    const stripeCustomer =
      customers.data[0] ??
      (await stripe.customers.create({
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
      }));

    const line_items = order.orderItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      const unit_amount = Math.round(Number(prod.price) * 100); // Convert to cents
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: prod.name,
            description: prod.description ?? undefined,
            images: prod.image ? [prod.image] : undefined,
          },
          unit_amount: unit_amount,
        },
        quantity: item.quantity,
      };
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: line_items,
      customer: stripeCustomer.id,
      metadata: {
        orderId: order.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/customer/orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/customer/cart`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Cart checkout failed" },
      { status: 500 }
    );
  }
}
