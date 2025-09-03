import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { randomBytes } from "crypto";

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
      const updateData: any = {};

      // Устанавливаем логин, если его нет
      if (!user.login) {
        updateData.login = `Anonym${Date.now()}`;
      }

      // Генерируем пароль для OAuth пользователей и email автоматически подтверждён
      if (!user.password) {
        const randomPassword = randomBytes(32).toString("hex");
        updateData.password = await hash(randomPassword, 12);
        updateData.emailVerified = new Date();
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
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
        token.email = user.email;
        token.emailVerified = user.emailVerified;
        token.name = user.name || null;
        return token;
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            login: true,
            role: true,
            email: true,
            emailVerified: true,
            name: true,
          },
        });

        if (dbUser) {
          token.login = dbUser.login;
          token.role = dbUser.role;
          token.email = dbUser.email;
          token.emailVerified = dbUser.emailVerified;
          token.name = dbUser.name;
        } else {
          return { ...token, error: "User not found" };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.login = token.login as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date;

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
