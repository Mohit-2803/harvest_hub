// src/app/actions/cart.ts
"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getOrCreateCartId(userId: string) {
  const existing = await prisma.cart.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (existing) return existing.id;

  const created = await prisma.cart.create({
    data: { userId },
    select: { id: true },
  });
  return created.id;
}

// Add or increment product in cart
export async function addToCart(productId: string, qty: number = 1) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;
  const cartId = await getOrCreateCartId(userId);

  await prisma.$transaction(async (tx) => {
    // Optional: validate product exists and has stock
    const product = await tx.product.findUnique({
      where: { id: productId },
      select: { id: true, quantity: true },
    });
    if (!product) throw new Error("Product not found");
    if (product.quantity <= 0) throw new Error("Out of stock");

    // Upsert line
    const existing = await tx.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
      select: { id: true, quantity: true },
    });

    if (existing) {
      await tx.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + qty },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId,
          productId,
          quantity: Math.max(1, qty),
        },
      });
    }
  });

  // Revalidate cart and marketplace pages you show counts on
  revalidatePath("/cart");
  revalidatePath("/customer/marketplace");
}

// Update a single cart item’s quantity
export async function updateCartItem(cartItemId: string, qty: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (qty < 1) {
    // treat <1 as remove
    await removeFromCart(cartItemId);
    return;
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: qty },
  });

  revalidatePath("/cart");
}

// Remove an item from cart
export async function removeFromCart(cartItemId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  revalidatePath("/cart");
}

// Fetch cart with computed totals
export async function getCart() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    select: {
      id: true,
      items: {
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              image: true,
              price: true, // Decimal
            },
          },
        },
      },
    },
  });

  if (!cart) {
    return {
      id: null,
      items: [],
      subtotal: "0",
      shipping: "0",
      total: "0",
    };
  }

  // Compute totals (as strings to avoid JS float drift)
  const subtotal = cart.items.reduce((sum, i) => {
    const price = Number(i.product.price);
    return sum + price * i.quantity;
  }, 0);

  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;

  return {
    id: cart.id,
    items: cart.items.map((i) => ({
      id: i.id,
      productId: i.product.id,
      name: i.product.name,
      image: i.product.image,
      price: i.product.price.toString(),
      quantity: i.quantity,
      lineTotal: (Number(i.product.price) * i.quantity).toString(),
    })),
    subtotal: subtotal.toString(),
    shipping: shipping.toString(),
    total: total.toString(),
  };
}

export async function getCartCount(): Promise<number> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return 0;

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    select: { items: { select: { quantity: true } } },
  });

  if (!cart) return 0;
  return cart.items.reduce((sum, i) => sum + i.quantity, 0);
}
