import { db } from "../../../config";
import { createInitialLandingPageData } from "./legacy";
import { normalizeLandingPageData } from "./normalize";

export const getLandingPageData = async (): Promise<LandingPageDataContent> => {
  const existing = await db.landingPageData.findFirst();
  if (existing) return normalizeLandingPageData(existing);

  const data = await createInitialLandingPageData();
  const created = await db.landingPageData.create({ data: data as any });
  return normalizeLandingPageData(created);
};

export const updateLandingPageData = async (data: any) => {
  const page = await getLandingPageData();
  const updated = await db.landingPageData.update({
    where: { id: page.id },
    data,
  });
  return normalizeLandingPageData(updated);
};
