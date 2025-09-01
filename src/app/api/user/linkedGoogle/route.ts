import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const accounts = await prisma.account.findMany({
      where: {
        userId: userId,
        provider: "google",
      },
      select: {
        provider: true,
        providerAccountId: true,
      },
    });

    const hasGoogleAccount = accounts.length > 0;

    return NextResponse.json({ hasGoogleAccount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch account information" }, { status: 500 });
  }
}
