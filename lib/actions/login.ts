"use server";
import * as z from "zod";
import { AuthError } from "next-auth";

import { LoginSchema } from "../schemas";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "../constants";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedField = LoginSchema.safeParse(values);

  if (!validatedField.success) return { error: "Invalid fields, try again." };

  const { password, email } = validatedField.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Welcome back!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };

        default:
          console.error("[LOGIN ERROR]: ", error);
          return { error: "Something went wrong, please try again." };
      }
    }

    throw error;
  }
};
