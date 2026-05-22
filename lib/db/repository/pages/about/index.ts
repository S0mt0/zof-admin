import { Prisma } from "@prisma/client";

import { db } from "../../../config";

export const getAboutPage = async (
  select?: Prisma.AboutPageSelect
): Promise<AboutPageContent | null> => {
  try {
    return (await db.aboutPage.findFirst({ select })) as AboutPageContent | null;
  } catch (error) {
    console.error("Error fetching about page: ", error);
    return null;
  }
};

export const upsertAboutPage = async (
  data: Prisma.AboutPageCreateInput
): Promise<AboutPageContent | null> => {
  try {
    const existing = await db.aboutPage.findFirst({ select: { id: true } });

    if (existing) {
      return (await db.aboutPage.update({
        where: { id: existing.id },
        data,
      })) as AboutPageContent;
    }

    return (await db.aboutPage.create({ data })) as AboutPageContent;
  } catch (error) {
    console.error("Error saving about page: ", error);
    return null;
  }
};
