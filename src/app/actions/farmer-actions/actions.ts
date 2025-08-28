"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { ProductFormValues } from "@/lib/validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Product } from "@/prisma/generated/prisma";
import { revalidatePath } from "next/cache";

interface UploadResult {
  secure_url: string;
}

export async function addProduct(data: ProductFormValues) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    let imageUrl: string | undefined = undefined;
    if (data.imageFile) {
      const arrayBuffer = await data.imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult: UploadResult = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "farm-products" }, (error, result) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error("Image upload result not undefined"));
            })
            .end(buffer);
        }
      );

      imageUrl = uploadResult.secure_url;
    }

    await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        quantity: data.quantity,
        image: imageUrl,
        description: data.description,
        farmerId: session.user.id,
      },
    });
    revalidatePath("/farmer/manage-inventory");
    return { success: true };
  } catch (err) {
    console.error("Add product error:", err);
    return { success: false, error: "Failed to add product" };
  }
}

export async function deleteProduct(formData: FormData) {
  const productId = String(formData.get("id") || "");

  if (!productId) {
    throw new Error("Missing product id");
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/farmer/manage-inventory");
  } catch (err) {
    console.error("Delete product error:", err);
    throw new Error("Failed to delete product");
  }
}

export type GetFarmerProductsResult =
  | { ok: true; data: Product[] }
  | { ok: false; error: string };

export async function getFarmerProducts(): Promise<GetFarmerProductsResult> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { ok: false, error: "Not authenticated" };
    }
    const products = await prisma.product.findMany({
      where: { farmerId: session.user.id },
    });
    return { ok: true, data: products };
  } catch (err) {
    console.error("Get farmer products error:", err);
    return { ok: false, error: "Failed to get farmer products" };
  }
}

export async function farmerDashboardInfo() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { ok: false, error: "Not authenticated" };
    }

    const productsCount = await prisma.product.count({
      where: { farmerId: session.user.id },
    });

    const ordersCount = await prisma.order.count({
      where: {
        status: { not: "DELIVERED" },
        orderItems: {
          some: {
            product: {
              farmerId: session.user.id,
            },
          },
        },
      },
    });

    const earningsAgg = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: { in: ["DELIVERED"] },
        orderItems: {
          some: { product: { farmerId: session.user.id } },
        },
      },
    });

    const earnings = Number(earningsAgg._sum.totalAmount ?? 0);

    return { ok: true, data: { productsCount, ordersCount, earnings } };
  } catch (err) {
    console.error("Farmer dashboard info error:", err);
    return { ok: false, error: "Failed to get dashboard info" };
  }
}

export async function getFarmerRecentOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const farmerId = session.user.id;

  const recentOrders = await prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          product: {
            farmerId,
          },
        },
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return recentOrders.map((order) => ({
    id: order.id,
    status: order.status,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt,
    items: order.orderItems.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      amount: Number(item.product.price) * item.quantity,
    })),
  }));
}

export async function getFarmerOrders() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    const farmerId = session.user.id;

    const orders = await prisma.order.findMany({
      where: {
        orderItems: {
          some: {
            product: {
              farmerId,
            },
          },
        },
      },
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (err) {
    console.error("Get farmer orders error:", err);
    return [];
  }
}

export async function updateOrderStatus(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Not authenticated");

    const farmerId = session.user.id;
    const orderId = String(formData.get("orderId") || "");
    const status = String(formData.get("status") || "");

    const allowed = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!allowed.includes(status)) {
      throw new Error("Invalid status");
    }
    if (!orderId) throw new Error("Missing orderId");

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) throw new Error("Order not found");

    const belongsToFarmer = order.orderItems.some(
      (item) => item.product.farmerId === farmerId
    );

    if (!belongsToFarmer) {
      throw new Error("You are not authorized to update this order");
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as import("@/prisma/generated/prisma").orderStatus,
      },
    });

    revalidatePath("/farmer/orders");

    return { ok: true };
  } catch (err) {
    console.error("Update order status error:", err);
    throw err;
  }
}
