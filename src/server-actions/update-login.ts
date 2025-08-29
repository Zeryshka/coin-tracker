"use server";

import { checkLoginAvailability } from "./check-login-availability";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { updateUserProfile } from "@/services/userService";

export async function updateLogin(newLogin: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const available = await checkLoginAvailability(newLogin);

  if (!available) {
    throw new Error("Login is already taken");
  }

  const user = await updateUserProfile(session.user.id, { login: newLogin });

  return user;
}
