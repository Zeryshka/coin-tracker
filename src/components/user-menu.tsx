"use client";

import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";

export function UserMenu() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserAvatar />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return <></>;
}
