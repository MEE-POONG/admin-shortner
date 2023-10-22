import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { AuthOptions, Session } from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Logger from "@/lib/logger";

const prisma = new PrismaClient();
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 24 hours
    updateAge: 15 * 60, // 15 minutes
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24, // 24 hours
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  callbacks: {
    session: async ({ session }) => {
      if (!session || !session.user) return;

      const res = await prisma.user.findUnique({
        where: { email: session.user.email! },
      });

      return {
        session: {
          user: res,
        },
      };
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { email, password } = credentials;

        const res = await prisma.user.findUnique({
          where: { email: email, password: password },
        });

        if (!res) {
          throw new Error("Invalid credentials");
        }

        const user = res;

        if (user) {
          Logger(`Auth success: email: ${email}  password: ${password}`);
          return user;
        }
        Logger(`Auth failed: email: ${email} password: ${password}`);
        return null;
      },
    }),
  ],
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
