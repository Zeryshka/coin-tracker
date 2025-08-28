"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FaGoogle } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SignInDialog() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? "User"} />
            <AvatarFallback>{session.user.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => signOut()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Sign In</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in to your account</DialogTitle>
          <DialogDescription>Choose a provider to sign in.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Email or Username"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="my-2 border-t" />

          <Button
            variant="outline"
            onClick={() => signIn("google")}
            className="flex items-center gap-2"
          >
            <FaGoogle className="w-5 h-5" />
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
