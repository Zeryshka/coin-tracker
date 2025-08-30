"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";

export function SignInForm() {
  return (
    <div>
      <div className="text-lg font-semibold pb-2">Sign in to your account</div>
      <div className="flex flex-col gap-3">
        <Input type="email" placeholder="Email or username" />
        <Input type="password" placeholder="Password" />

        <div className="my-2 border-t" />

        <Button variant="outline" onClick={() => signIn("google")} className="flex items-center gap-2">
          <FaGoogle className="w-5 h-5" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
