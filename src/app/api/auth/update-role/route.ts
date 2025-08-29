import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";
import * as z from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["FARMER", "CUSTOMER"], {
    message: "Role must be either FARMER or CUSTOMER",
  }),
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
}).refine(
  (data) => {
    if (data.role === "FARMER") {
      return data.farmName && data.farmLocation;
    }
    return true;
  },
  {
    message: "Farm name and location are required for farmers",
    path: ["farmName"],
  }
);

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      logger.warn("Unauthorized role update attempt", {
        action: "update_role_unauthorized"
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = updateRoleSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn("Role update validation failed", {
        issues: parsed.error.format(),
        userId: session.user.id,
        action: "update_role_validation_failed"
      });
      
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { role, farmName, farmLocation } = parsed.data;

    // Update user in database
    logger.database.query('update', 'User', { 
      userId: session.user.id, 
      newRole: role 
    });

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role,
        farmName: role === "FARMER" ? farmName : null,
        farmLocation: role === "FARMER" ? farmLocation : null,
        profileSetupCompleted: true, // Mark profile setup as completed
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        farmName: true,
        farmLocation: true,
        profileSetupCompleted: true,
      },
    });

    logger.info("User role updated successfully", {
      userId: session.user.id,
      oldRole: session.user.role,
      newRole: role,
      action: "role_updated"
    });

    return NextResponse.json({
      message: "Role updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    logger.error("Failed to update user role", error, {
      userId: (await getServerSession(authOptions))?.user?.id,
      action: "update_role_error"
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
