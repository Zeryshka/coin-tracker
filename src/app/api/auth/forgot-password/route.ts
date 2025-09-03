import { NextRequest, NextResponse } from "next/server";
import { PasswordService } from "@/service/password.service";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email обязателен" },
        { status: 400 }
      );
    }

    await PasswordService.generateResetToken(email);

    return NextResponse.json({
      success: true,
      message: "Если пользователь с таким email существует, письмо отправлено"
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
