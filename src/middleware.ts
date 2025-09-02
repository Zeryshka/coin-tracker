import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const pathname = req.nextUrl.pathname;

    // Правило 1: Авторизованные пользователи не могут попасть на страницы регистрации/авторизации
    if (token && (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // Правило 2: Пользователи с подтвержденным email не могут попасть на страницу верификации
    if (token && token.emailVerified && pathname.startsWith("/auth/verify-email")) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    // Правило 3: Неавторизованные пользователи не могут попасть на страницу верификации
    if (!token && pathname.startsWith("/auth/verify-email")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Правило 4: Неавторизованные пользователи не могут попасть на защищенные страницы
    if (!token && pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Правило 5: Авторизованные пользователи без подтвержденного email не могут попасть на защищенные страницы
    if (token && !token.emailVerified && pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/auth/verify-email", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Для публичных маршрутов всегда разрешаем доступ
        // Защищенные маршруты обрабатываются в функции middleware
        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/profile/:path*", "/auth/signin/:path*", "/auth/signup/:path*", "/auth/verify-email/:path*"],
};
