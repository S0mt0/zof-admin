import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "../db/data";
import { db } from "../db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
}

export function getInitials(name: string = "Admin") {
  const initials = name
    .split(" ")
    .map((el) => el.charAt(0).toUpperCase())
    .join("");
  return initials;
}

export function capitalize(name: string = "Admin User") {
  const capitalized = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return capitalized;
}
