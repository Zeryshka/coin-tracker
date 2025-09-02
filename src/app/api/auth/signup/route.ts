import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signUpSchema } from "@/schema/sign-up-schema";
import { VerificationService } from "@/service/verification.service";
import { EmailService } from "@/service/email.service";

export async function POST(req: Request) {
  try {
    const { login, email, password, confirmPassword } = await req.json();

    const validationResult = signUpSchema.safeParse({
      login,
      email,
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      console.log(validationResult);

      const firstError = validationResult.error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { login }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or login already exists" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        login: login,
        password: hashedPassword,
      },
    });

    // Создаем токен подтверждения и отправляем email
    try {
      const verificationToken = await VerificationService.createVerificationToken(email);
      const emailSent = await EmailService.sendVerificationEmail(email, verificationToken.token);

      if (!emailSent) {
        console.warn("Failed to send verification email, but user was created");
      }
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        login: newUser.login,
      },
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
