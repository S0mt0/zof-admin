import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

import { getVerificationTokenByEmail } from "../db/repository";
import { db } from "../db";
import { auth } from "@/auth";
import { getUploadUrl } from "../actions/s3";

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

export async function generateResetPasswordToken(email: string) {
  const token = uuidv4();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.resetPasswordToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const resetToken = await db.resetPasswordToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return resetToken;
}

export function getInitials(name: string = "Admin") {
  const initials = name
    .split(" ")
    .map((el) => el.charAt(0).toUpperCase())
    .join("");
  return initials;
}

export function capitalize(name: string = "") {
  const capitalized = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  return capitalized;
}

export function obscureEmail(email: string): string {
  const [localPart, domain] = email.split("@");

  if (!domain || localPart.length <= 3) {
    return email;
  }

  const firstTwo = localPart.slice(0, 2);
  const lastChar = localPart.slice(-1);
  const obscuredMiddle = "*".repeat(Math.max(0, localPart.length - 3));

  return `${firstTwo}${obscuredMiddle}${lastChar}@${domain}`;
}

export const currentUser = async () => (await auth())?.user;
export const currentUserRole = async () => (await auth())?.user.role;

export async function prismaPaginate<M, A = any>({
  page = 1,
  limit,
  defaultLimit = 10,
  maxLimit = 20,
  args = {} as A,
  model,
}: PrismaPaginationOptions<M, A>) {
  const cappedLimit = Math.min(limit || defaultLimit, maxLimit);
  const skip = (Math.max(page, 1) - 1) * cappedLimit;

  const [count, rows] = await Promise.all([
    model.count({ where: (args as any)?.where }),
    model.findMany({ ...(args as any), skip, take: cappedLimit }),
  ]);

  return {
    data: rows,
    pagination: {
      total: count,
      page: Math.max(page, 1),
      limit: cappedLimit,
      totalPages: Math.ceil(count / cappedLimit) || 1,
    },
  } as const;
}

export const handleFileUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  folder: S3FileFolders
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const { url } = await getUploadUrl(file.name, file.type, folder);

  try {
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "multipart/form-data" },
      body: file,
    });

    const objectUrl = url.split("?")[0];
    return objectUrl;
  } catch (error) {
    console.log("Error Uploading to S3: ", error);
  }
};
