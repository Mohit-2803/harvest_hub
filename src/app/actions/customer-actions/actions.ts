// app/actions/customer-actions/actions.ts
"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getSearchedProducts(searchTerm: string) {
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    include: {
      farmer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return products;
}

export async function getLatestAddedFarmProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      farmer: {
        select: {
          id: true,
          name: true,
          email: true,
          farmName: true,
          farmLocation: true,
        },
      },
    },
    take: 5,
  });

  return products;
}

export async function placeOrder(productId: string, quantity: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) throw new Error("Product not found");

  const totalAmount = product.price.mul(quantity);

  const order = await prisma.order.create({
    data: {
      customerId: session.user.id,
      totalAmount,
      orderItems: {
        create: {
          productId: product.id,
          quantity,
        },
      },
    },
    include: {
      orderItems: true,
    },
  });

  return {
    ...order,
    totalAmount: order.totalAmount.toNumber(),
    orderItems: order.orderItems.map((item) => ({
      ...item,
    })),
  };
}

export async function cancelOrder(orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.customerId !== session.user.id) throw new Error("Unauthorized");
  if (order.status !== "PENDING")
    throw new Error("Only pending orders can be cancelled");

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
  revalidatePath(`/customer/orders`);

  return { success: true };
}
