import { db } from "../config";

export const getUserByEmail = async (email: string) => {
  try {
    return (await db.user.findUnique({
      where: {
        email,
      },
    })) as IUser;
  } catch (e) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return (await db.user.findUnique({
      where: {
        id,
      },
    })) as IUser;
  } catch (e) {
    return null;
  }
};

export const updateUser = async (id: string, data: Partial<IUser>) => {
  try {
    return (await db.user.update({
      where: {
        id,
      },
      data,
    })) as IUser;
  } catch (e) {
    return null;
  }
};

export const deleteUser = async (id: string) => {
  try {
    return (await db.user.delete({
      where: {
        id,
      },
    })) as IUser;
  } catch (e) {
    return null;
  }
};
