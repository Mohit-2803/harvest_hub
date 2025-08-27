import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["FARMER", "CUSTOMER"], {
    message: "Role is required",
  }),
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
});

export async function POST(request: NextRequest) {
  console.log("Registering user", request.body);
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "validation failed",
          issues: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { name, email, password, role, farmName, farmLocation } = parsed.data;

    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        farmName,
        farmLocation,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        farmName: true,
        farmLocation: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json(
      { error: "Something went wrong, internal server error" },
      { status: 500 }
    );
  }
}
