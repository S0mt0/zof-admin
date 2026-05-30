import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import { LoginSchema } from "./lib/schemas";
import { DEFAULT_ADMIN_EMAILS } from "./lib/constants";
import { getUserByEmail, getUserById, updateUser } from "./lib/db/repository/user.service";
import { db } from "./lib/db/config";
import { verifyPassword } from "./lib/utils/password";

const providers = [
  ...(authConfig.providers ?? []),
  Credentials({
    async authorize(credentials) {
      const validatedField = LoginSchema.safeParse(credentials);

      if (validatedField.success) {
        const { password, email } = validatedField.data;
        const user = await getUserByEmail(email);

        if (!user?.password) return null;

        const isMatch = await verifyPassword(password, user.password);
        if (isMatch) return user;
      }

      return null;
    },
  }),
];

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await updateUser(user.id!, {
        emailVerified: new Date(),
        role: DEFAULT_ADMIN_EMAILS.includes(user.email!) ? "admin" : "user",
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers (I'm using only Google in the app), allow sign in
      if (account?.provider !== "credentials") {
        return true;
      }

      // For credentials provider, check email verification
      if (!user?.emailVerified) {
        return false;
      }

      return true;
    },

    async jwt({ token }) {
      const existingUser = await getUserById(token.sub!);

      if (existingUser) {
        token.role = existingUser.role;
        token.id = existingUser.id;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.image = existingUser.image;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        if (token.role) session.user.role = token.role;
        if (token.id) session.user.id = token.id;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email;
        if (token.image) session.user.image = token.image;
      }

      return session;
    },
  },
  ...authConfig,
  providers,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    // maxAge: 604800, // 1 Week
  },
});
