import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      login?: string | null;
      role?: string | null;
      emailVerified?: Date | null;
    } & DefaultSession["user"];
    error?: string;
  }

  interface User extends DefaultUser {
    id: string;
    login?: string | null;
    role?: string | null;
    emailVerified?: Date | null;
  }
}
