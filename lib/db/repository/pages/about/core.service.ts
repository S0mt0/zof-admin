import { db } from "../../../config";
import { defaultAboutPageData } from "./defaults";
import { normalizeAboutPageData } from "./normalize";

export const getAboutPageData = async (): Promise<AboutPageContent> => {
  const existing = await db.aboutPage.findFirst();
  if (existing) return normalizeAboutPageData(existing);

  const created = await db.aboutPage.create({
    data: defaultAboutPageData() as any,
  });
  return normalizeAboutPageData(created);
};

export const updateAboutPageData = async (data: any) => {
  const page = await getAboutPageData();
  const updated = await db.aboutPage.update({
    where: { id: page.id },
    data,
  });
  return normalizeAboutPageData(updated);
};
