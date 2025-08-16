import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";

import { LoginSchema } from "./lib/schemas";
import { getUserByEmail } from "./lib/db/data";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedField = LoginSchema.safeParse(credentials);

        if (validatedField.success) {
          const { password, email } = validatedField.data;

          const user = await getUserByEmail(email);

          if (!user || !user?.password) return null;

          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
