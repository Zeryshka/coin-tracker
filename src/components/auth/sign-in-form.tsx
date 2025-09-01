"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { redirect } from "next/navigation";
import { alert } from "@/components/alerts";
import Link from "next/link";

type SignInValues = {
  login?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignInForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const login = formData.get("login") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      login,
      password,
    });

    setLoading(false);

    if (res?.error) {
      alert.error("Invalid credentials");
    } else {
      redirect("/profile");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="text-lg font-semibold pb-2">Sign in to your account</div>
        <div className="flex flex-col gap-3">
          <Input name="login" type="text" placeholder="Email or username" />
          <Input name="password" type="password" placeholder="Password" />

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>

      <div className="my-2 border-t" />

      <Button variant="outline" onClick={() => signIn("google")} className="flex items-center gap-2">
        <FaGoogle className="w-5 h-5" />
        Sign in with Google
      </Button>

      <Link href="/auth/signup">Don't have an account? Sign up</Link>
    </div>
  );
}

// TODO: refactor similar to sign up form
// TODO: email confirmation
// TODO: resend confirmation code to email
// TODO: password recovery
// TODO: 2FA
