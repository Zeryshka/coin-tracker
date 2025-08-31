import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { login, email, password } = await req.json();

    if (!email || !password || !login) {
      return NextResponse.json({ error: "Login, email, password - обязательны" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { login }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким email или login уже существует" }, { status: 400 });
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
    console.error("Ошибка регистрации:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
