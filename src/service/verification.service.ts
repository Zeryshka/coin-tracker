import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

export class VerificationService {
  static async createVerificationToken(email: string) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    try {
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });

      const verificationToken = await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      return verificationToken;
    } catch (error) {
      console.error("Error creating verification token:", error);
      throw new Error("Failed to create verification token");
    }
  }

  static async verifyToken(token: string) {
    try {
      const verificationToken = await prisma.verificationToken.findFirst({
        where: { token },
      });

      if (!verificationToken) {
        return { success: false, error: "Invalid token" };
      }

      if (verificationToken.expires < new Date()) {
        await prisma.verificationToken.deleteMany({
          where: { token: verificationToken.token },
        });
        return { success: false, error: "Token expired" };
      }

      const user = await prisma.user.findUnique({
        where: { email: verificationToken.identifier },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });

      await prisma.verificationToken.deleteMany({
        where: { token: verificationToken.token },
      });

      return { success: true, user };
    } catch (error) {
      console.error("Error verifying token:", error);
      return { success: false, error: "Server error" };
    }
  }

  static async resendVerificationEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return { success: false, error: "User not found" };
      }

      if (user.emailVerified) {
        return { success: false, error: "Email already verified" };
      }

      const verificationToken = await this.createVerificationToken(email);

      return { success: true, token: verificationToken.token };
    } catch (error) {
      console.error("Error resending verification email:", error);
      return { success: false, error: "Server error" };
    }
  }
}
