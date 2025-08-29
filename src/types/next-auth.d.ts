import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      login?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    login?: string | null;
  }
}
