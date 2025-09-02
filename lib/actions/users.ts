"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { addAppActivity, deleteUser, updateUser } from "../db/repository";
import { capitalize, currentUser } from "../utils";
import { MailService } from "../utils/mail.service";

export const changeUserRoleAction = async (userId: string, role: Role) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };
  if (user.role !== "admin") return { error: "Unauthorized" };

  try {
    const existing = await (async () => {
      try {
        const user = await (
          await import("../db/repository/user.service")
        ).getUserById(userId);

        return user;
      } catch {
        return null;
      }
    })();

    if (!existing) {
      return { error: "User not found" };
    }

    if (existing.role === role) {
      return { error: "No changes detected" };
    }

    const updated = await updateUser(existing.id, { role });

    if (updated) {
      await addAppActivity(
        "User Role Update",
        `${capitalize(user.name!)} (${user.role}) has updated ${capitalize(
          existing.name
        )}'s user role from "${capitalize(existing.role)}" to "${capitalize(
          updated.role
        )}"`
      );

      revalidateTag("users");
      revalidatePath("/");
    }

    return { success: "User role updated" };
  } catch (error) {
    return { error: "Something went wrong, try again." };
  }
};

export const deleteUserAccountAction = async (userId: string) => {
  const user = await currentUser();
  if (!user) return { error: "Invalid session, please login again." };
  if (user.role !== "admin") return { error: "Unauthorized" };

  try {
    const existing = await (async () => {
      try {
        const user = await (
          await import("../db/repository/user.service")
        ).getUserById(userId);

        return user;
      } catch {
        return null;
      }
    })();

    if (!existing) {
      return { error: "User not found" };
    }

    const deleted = await deleteUser(userId);

    if (deleted) {
      await addAppActivity(
        "User Account Deleted",
        `${capitalize(user.name!)} (${user.role}) has removed ${capitalize(
          deleted.name
        )}from the board`
      );

      const mailer = new MailService();
      await mailer.send({
        to: deleted.email,
        subject: "Account deleted",
        text: `Your account has been deleted by the admin. If you believe this was a mstake, please contact admin or support.`,
      });

      revalidateTag("users");
      revalidatePath("/");
    }

    return { success: "User account removed" };
  } catch (error) {
    return { error: "Something went wrong, try again." };
  }
};
