import { addAppActivity } from "@/lib/db/repository/app-activity.service";

export const sectionPath = (section: string) => `/about/${section}`;

export const logAboutActivity = (
  title: string,
  userName: string,
  role: string
) => addAppActivity(title, `${userName} (${role}) updated about page content`);
