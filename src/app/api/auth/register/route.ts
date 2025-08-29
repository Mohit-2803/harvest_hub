import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";

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
  let email = 'unknown';
  
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn('Registration validation failed', {
        issues: parsed.error.format(),
        action: 'register_validation_failed'
      });
      
      return NextResponse.json(
        {
          error: "validation failed",
          issues: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { name, email: userEmail, password, role, farmName, farmLocation } = parsed.data;
    email = userEmail.toLowerCase().trim(); // Set for logging and sanitize

    // Check if user already exists
    logger.database.query('findUnique', 'User', { email });
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logger.auth.registerAttempt(email, role, false, { 
        reason: 'user_already_exists' 
      });
      
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    logger.database.query('create', 'User', { email, role });
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

    logger.auth.registerAttempt(email, role, true, { userId: user.id });
    
    return NextResponse.json({
      ...user,
      message: "User registered successfully"
    });
  } catch (error) {
    logger.auth.registerAttempt(email, 'unknown', false, { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    
    logger.error("Registration failed", error, { email });
    
    return NextResponse.json(
      { error: "Something went wrong, internal server error" },
      { status: 500 }
    );
  }
}
