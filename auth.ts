import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import { db } from "./lib/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    signIn({ user, account }) {
      console.log({ user });
      // Not everyone is supposed to signup on this dashboard, so check whitelist for allowed emails
      const allowedAccountEmailsString = process.env.ALLOWED_ACCOUNT_EMAILS;
      const allowedAccountEmailsArray =
        allowedAccountEmailsString?.split(",") || [];

      // Allow OAuth without email verification
      if (
        account?.provider !== "credentials" &&
        allowedAccountEmailsArray.includes(user.email!)
      )
        return true;

      if (!allowedAccountEmailsArray.includes(user.email!))
        throw new Error("Email not allowed");

      // Prevent signin without verification
      if (!user?.emailVerified) return false;

      return true;
    },

    jwt({ token, user }) {
      if (user) {
        token.role = user.role!;
        token.id = user.id!;
      }
      return token;
    },

    session({ session, token }) {
      if (token.role && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 604800, // 1 Week
  },
  ...authConfig,
});
