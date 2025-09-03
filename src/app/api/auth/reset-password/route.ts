import { NextRequest, NextResponse } from "next/server";
import { PasswordService } from "@/service/password.service";
import { z } from "zod";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Токен обязателен"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error.issues[0].message 
        },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    const result = await PasswordService.resetPassword(token, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Пароль успешно изменен"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
