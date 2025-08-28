// app/api/farmer/update-order/route.ts
import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/app/actions/farmer-actions/actions";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    await updateOrderStatus(formData);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("API update-order error:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update order";
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    );
  }
}
