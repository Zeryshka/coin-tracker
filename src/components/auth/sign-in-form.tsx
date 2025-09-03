"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { redirect } from "next/navigation";
import { alert } from "@/components/alerts";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInValues as SignInSchemaValues } from "@/schema/sign-in-schema";

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInSchemaValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInSchemaValues) {
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      login: values.login.trim(),
      password: values.password,
    });

    setLoading(false);

    if (res?.error) {
      alert.error("Invalid credentials");
    } else {
      redirect("/profile");
    }
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="text-lg font-semibold text-center">Sign in to your account</div>

          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email or username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7 text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="my-2 border-t" />

      <Button variant="outline" onClick={() => signIn("google")} className="flex items-center gap-2 w-full">
        <FaGoogle className="w-5 h-5" />
        Sign in with Google
      </Button>

      <div className="text-center">
        <Link href="/auth/signup" className="text-sm hover:underline">
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
