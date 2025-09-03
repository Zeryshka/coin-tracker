import { NextRequest, NextResponse } from "next/server";
import { PasswordService } from "@/service/password.service";
import { z } from "zod";

const validateTokenSchema = z.object({
  token: z.string().min(1, "Токен обязателен"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateTokenSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error.issues[0].message 
        },
        { status: 400 }
      );
    }

    const { token } = validation.data;

    const result = await PasswordService.validateResetToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      email: result.email
    });

  } catch (error) {
    console.error("Validate token error:", error);
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
