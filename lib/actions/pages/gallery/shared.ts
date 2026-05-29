import { addAppActivity } from "@/lib/db/repository/app-activity.service";
import { capitalize } from "@/lib/utils";

export const sectionPath = (section: string) => `/media/${section}`;

export const logGalleryActivity = (
  title: string,
  userName: string,
  role: string,
  message?: string
) =>
  addAppActivity(
    title,
    message || `${capitalize(userName)} (${role}) updated gallery page content`
  );
