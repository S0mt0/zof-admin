import { addAppActivity } from "@/lib/db/repository/app-activity.service";
import { capitalize } from "@/lib/utils";

import { getUserById } from "@/lib/db/repository/user.service";
import { currentUser } from "@/lib/utils";

export const sectionPath = (section: string) => `/donations/${section}`;

export const getAuthorizedDonationAdmin = async () => {
  const sessionUser = await currentUser();
  const user = await getUserById(sessionUser?.id || "");

  if (!user) return { error: "Invalid session, please login again." } as const;
  if (user.role !== "admin") return { error: "Only administrators can manage donations." } as const;

  return { user } as const;
};

export const logDonationActivity = (
  title: string,
  userName: string,
  role: string,
  message?: string
) =>
  addAppActivity(
    title,
    message || `${capitalize(userName)} (${role}) updated donations content`
  );
