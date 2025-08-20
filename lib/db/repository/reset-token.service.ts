import { db } from "../config";

export const getResetPasswordTokenByToken = async (token: string) => {
  try {
    return await db.resetPasswordToken.findUnique({
      where: {
        token,
      },
    });
  } catch (e) {
    return null;
  }
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    return await db.resetPasswordToken.findFirst({
      where: {
        email,
      },
    });
  } catch (e) {
    return null;
  }
};
