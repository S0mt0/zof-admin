"use server";
import * as z from "zod";

import { LoginSchema, SignUpSchema } from "../schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  console.log(values);

  const validatedField = LoginSchema.safeParse(values);

  if (!validatedField.success) return { error: "Invalid credentials" };

  return { success: "Welcome back!" };
};

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  console.log(values);

  const validatedField = SignUpSchema.safeParse(values);

  if (!validatedField.success) return { error: "Invalid credentials" };

  return { success: "Welcome back!" };
};
