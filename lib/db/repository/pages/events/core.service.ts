import { db } from "../../../config";
import { defaultEventsPageData } from "./defaults";
import { normalizeEventsPageData } from "./normalize";

export const getEventsPageData = async (): Promise<EventsPageContent> => {
  const existing = await db.eventsPage.findFirst();
  if (existing) return normalizeEventsPageData(existing);

  const created = await db.eventsPage.create({
    data: defaultEventsPageData() as any,
  });
  return normalizeEventsPageData(created);
};

export const updateEventsPageData = async (data: any) => {
  const page = await getEventsPageData();
  const updated = await db.eventsPage.update({
    where: { id: page.id },
    data,
  });
  return normalizeEventsPageData(updated);
};
