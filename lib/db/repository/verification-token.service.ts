import { db } from "../config";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await db.verificationToken.findUnique({
      where: {
        token,
      },
    });
  } catch (e) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await db.verificationToken.findFirst({
      where: {
        email,
      },
    });
  } catch (e) {
    return null;
  }
};
