"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { alert } from "@/components/alerts";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const token = searchParams.get("token");

  useEffect(() => {
    if (token && verificationStatus === "idle") {
      verifyEmailToken();
    }
  }, [token]);

  const verifyEmailToken = async () => {
    if (!token) {
      return;
    }

    setVerificationStatus("loading");

    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();

      if (data.success) {
        setVerificationStatus("success");
        alert.success("Ваш email успешно подтвержден!");
        await update();
        router.push("/profile");
      } else {
        setVerificationStatus("error");
        alert.error(data.error || "Ошибка подтверждения email");
      }
    } catch (err) {
      setVerificationStatus("error");
      alert.error("Произошла ошибка при подтверждении email");
      console.error("Verification error:", err);
    }
  };

  const resendVerificationEmail = async () => {
    if (!session?.user?.email) return;
    setVerificationStatus("loading");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      const data = await response.json();

      if (data.success) {
        alert.success("Письмо с подтверждением отправлено повторно!");
        setTimeout(() => setVerificationStatus("idle"), 30 * 1000);
      } else {
        alert.error(data.error || "Ошибка при отправке письма");
        setTimeout(() => setVerificationStatus("idle"), 1000);
      }
    } catch (err) {
      alert.error("Произошла ошибка при отправке письма");
      console.error("Resend error:", err);
      setTimeout(() => setVerificationStatus("idle"), 1000);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <CardTitle>Подтверждение Email</CardTitle>
          <CardDescription>{token ? "Подтверждаем ваш email адрес..." : "Подтвердите ваш email адрес"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === "loading" && (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Подтверждаем ваш email...</p>
            </div>
          )}

          {(!token || verificationStatus === "error") && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Мы отправили письмо с подтверждением на адрес <strong>{session?.user?.email}</strong>. Пожалуйста,
                проверьте вашу почту и перейдите по ссылке в письме.
              </p>

              <div className="space-y-2">
                <Button
                  onClick={resendVerificationEmail}
                  className="w-full"
                  disabled={verificationStatus === "loading"}
                >
                  {verificationStatus === "loading" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Отправить письмо повторно
                </Button>

                <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                  Вернуться на главную
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
