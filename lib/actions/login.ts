"use server";
import * as z from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "../schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "../constants";
import { getUserByEmail } from "../db/data";
import { generateVerificationToken } from "../utils";
import { MailService } from "../utils/mail.service";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string
) => {
  const validatedField = LoginSchema.safeParse(values);

  if (!validatedField.success) return { error: "Invalid fields, try again." };

  const { password, email } = validatedField.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser?.email) return { error: "Email does not exist!" };

  if (existingUser && !existingUser.password)
    return {
      error:
        "This email is already associated with a different account. Please sign in with the original method you used to create your account.",
    };

  if (!existingUser.emailVerified) {
    const token = (await generateVerificationToken(email)).token;
    const mailer = new MailService();

    await mailer.sendVerificationEmail(email, token);

    return { success: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Welcome back!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };

        default:
          return { error: "Something went wrong, please try again." };
      }
    }

    throw error;
  }
};
