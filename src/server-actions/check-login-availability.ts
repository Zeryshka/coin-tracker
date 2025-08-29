"use server";

import { getUserByLogin } from "@/services/userService";

export async function checkLoginAvailability(login: string): Promise<boolean> {
  if (!login) return false;
  const user = await getUserByLogin(login);
  return !user;
}
