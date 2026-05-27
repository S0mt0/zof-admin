import { addAppActivity } from "@/lib/db/repository/app-activity.service";
import { capitalize } from "@/lib/utils";

export const sectionPath = (section: string) =>
  `/blogs-and-articles/${section}`;

export const logBlogsActivity = (
  title: string,
  userName: string,
  role: string,
  message?: string
) =>
  addAppActivity(
    title,
    message || `${capitalize(userName)} (${role}) updated blogs page content`
  );
