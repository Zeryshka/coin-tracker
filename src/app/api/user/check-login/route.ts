// app/api/auth/check-login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserByLogin } from "@/services/userService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const login = searchParams.get("login");

    if (!login) {
      return NextResponse.json({ error: "Login parameter is required" }, { status: 400 });
    }

    const LOGIN_REGEX = /^[a-zA-Z0-9_.-]{3,20}$/;
    if (!LOGIN_REGEX.test(login)) {
      return NextResponse.json({ available: false }, { status: 200 });
    }

    const existingUser = await getUserByLogin(login);

    return NextResponse.json({ available: !existingUser }, { status: 200 });
  } catch (error) {
    console.error("Check login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
