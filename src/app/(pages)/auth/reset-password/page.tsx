"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { alert } from "@/components/alerts";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { passwordSchema, type PasswordValues } from "@/schema/password-schema";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      alert.error("Неверная ссылка для сброса пароля");
      return;
    }

    // Проверяем валидность токена
    const checkToken = async () => {
      try {
        const response = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        setTokenValid(data.success);

        if (!data.success) {
          alert.error(data.error || "Неверная или просроченная ссылка");
        }
      } catch (error) {
        setTokenValid(false);
        alert.error("Ошибка при проверке ссылки");
      }
    };

    checkToken();
  }, [token]);

  async function onSubmit(values: PasswordValues) {
    if (!token) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await response.json();

      if (data.success) {
        alert.success("Пароль успешно изменен");
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      } else {
        alert.error(data.error || "Произошла ошибка");
      }
    } catch (error) {
      alert.error("Произошла ошибка при сбросе пароля");
    } finally {
      setLoading(false);
    }
  }

  if (tokenValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">Проверка ссылки...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Неверная ссылка</CardTitle>
            <CardDescription className="text-center">
              Ссылка для сброса пароля недействительна или просрочена.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/forgot-password" className="text-primary hover:underline">
              Запросить новую ссылку
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Новый пароль</CardTitle>
          <CardDescription className="text-center">Введите новый пароль для вашего аккаунта</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="Новый пароль" type={showPassword ? "text" : "password"} {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-7 w-7 text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Подтвердите пароль"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-7 w-7 text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Смена пароля..." : "Сменить пароль"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Link href="/auth/signin" className="text-sm text-primary hover:underline">
              Вернуться к входу
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
