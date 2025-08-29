import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user profile setup status
    logger.database.query('findUnique', 'User', { userId: session.user.id });
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        profileSetupCompleted: true,
        farmName: true,
        farmLocation: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profileSetupCompleted: user.profileSetupCompleted,
      role: user.role,
      needsSetup: !user.profileSetupCompleted && user.role === 'CUSTOMER',
      isOAuthUser: !user.farmName && !user.farmLocation && user.role === 'CUSTOMER',
      createdAt: user.createdAt,
    });

  } catch (error) {
    logger.error("Failed to get profile status", error, {
      userId: (await getServerSession(authOptions))?.user?.id,
      action: "get_profile_status_error"
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
