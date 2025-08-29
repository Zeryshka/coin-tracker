import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).login = (token as any).login;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.login = (user as any).login;
      } else {
        // fetch login from DB if missing
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub as string } });
        if (dbUser) {
          token.login = dbUser.login;
        }
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
