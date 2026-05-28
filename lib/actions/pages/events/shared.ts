import { addAppActivity } from "@/lib/db/repository/app-activity.service";
import { capitalize } from "@/lib/utils";

export const sectionPath = (section: string) =>
  `/events-and-articles/${section}`;

export const logEventsActivity = (
  title: string,
  userName: string,
  role: string,
  message?: string
) =>
  addAppActivity(
    title,
    message || `${capitalize(userName)} (${role}) updated events page content`
  );
