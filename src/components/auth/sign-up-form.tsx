"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { alert } from "@/components/alerts";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpValues } from "@/schema/sign-up-schema";
import { signIn } from "next-auth/react";

export function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      login: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: values.login.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password.trim(),
          confirmPassword: values.confirmPassword.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert.error(data.error || "Registration error");
        return;
      }

      alert.success("A confirmation email has been sent to your email address");
      router.push("/auth/signin");
    } catch (error) {
      alert.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <div className="text-lg font-semibold text-center">Create a new account</div>

          <FormField
            control={form.control}
            name="login"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input type={showConfirm ? "text" : "password"} placeholder="Confirm Password" {...field} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-7 w-7 text-gray-600"
                      onClick={() => setShowConfirm(!showConfirm)}
                      tabIndex={-1}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>
      </Form>

      <div className="my-2 border-t" />

      <Button variant="outline" onClick={() => signIn("google")} className="flex items-center gap-2 w-full">
        <FaGoogle className="w-5 h-5" />
        Sign up with Google
      </Button>

      <div className="text-center">
        <Link href="/auth/signin" className="text-sm hover:underline">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
