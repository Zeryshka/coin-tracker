import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { signUpSchema } from "@/schema/sign-up-schema";

export async function POST(req: Request) {
  try {
    const { login, email, password } = await req.json();

    const validationResult = signUpSchema.safeParse({
      login,
      email,
      password,
    });

    if (!validationResult.success) {
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

    return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email, login: newUser.login } });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
