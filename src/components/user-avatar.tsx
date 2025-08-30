"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserAvatar() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <Avatar>
        <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? "User"} />
        <AvatarFallback>{session.user.name ?? "U"}</AvatarFallback>
      </Avatar>
    );
  }

  return <></>;
}
