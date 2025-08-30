"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SignInForm } from "@/components/sign-in-form";

export function SignInDialogButton() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Sign In</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            <SignInForm />
          </DialogTitle>
        </DialogContent>
      </Dialog>
    );
  }

  return <></>;
}
