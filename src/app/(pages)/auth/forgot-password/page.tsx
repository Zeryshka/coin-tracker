"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { alert } from "@/components/alerts";

const forgotPasswordSchema = z.object({
  email: z.string().email("Введите корректный email"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        setEmailSent(true);
        alert.success("Письмо отправлено");
      } else {
        alert.error(data.error || "Произошла ошибка");
      }
    } catch (error) {
      alert.error("Произошла ошибка при отправке запроса");
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Проверьте почту</CardTitle>
            <CardDescription className="text-center">
              Мы отправили письмо с инструкциями по сбросу пароля на {form.getValues("email")}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Не получили письмо? Проверьте папку "Спам" или
              <button type="button" onClick={() => setEmailSent(false)} className="text-primary hover:underline">
                попробуйте еще раз
              </button>
            </div>
            <div className="text-center">
              <Link href="/auth/signin" className="text-sm text-primary hover:underline">
                Вернуться к входу
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Забыли пароль?</CardTitle>
          <CardDescription className="text-center">
            Введите ваш email, и мы вышлем инструкции по сбросу пароля
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Отправка..." : "Отправить инструкции"}
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
