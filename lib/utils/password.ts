import { hash, verify } from "argon2";

export const hashPassword = async (password: string) => hash(password);

export const verifyPassword = async (password: string, passwordHash: string) =>
  verify(passwordHash, password);
