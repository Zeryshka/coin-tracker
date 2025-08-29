import prisma from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUserProfile(userId: string, data: { login?: string | null; image?: string | null }) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}
