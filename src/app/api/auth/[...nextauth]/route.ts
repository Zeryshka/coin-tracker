import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ login: credentials.login }, { email: credentials.login }],
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          login: user.login,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  events: {
    async createUser({ user }) {
      if (!(user as any).login) {
        await prisma.user.update({
          where: { id: user.id },
          data: { login: `Anonym${Date.now()}` },
        });
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.login = user.login;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        return token;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            login: true,
            role: true,
            emailVerified: true,
            email: true,
            name: true,
          },
        });

        if (dbUser) {
          token.login = dbUser.login;
          token.role = dbUser.role;
          token.emailVerified = dbUser.emailVerified;
        } else {
          return { ...token, error: "User not found" };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.login = token.login as string | null;
        session.user.role = token.role as string | null;
        session.user.emailVerified = token.emailVerified as Date | null;

        if (token.error) {
          session.error = token.error as string;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
