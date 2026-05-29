import { db } from "@/lib/db/config";

import { defaultDonationsPageData } from "./defaults";
import { normalizeDonationsPageData } from "./normalize";

export const getDonationsPageData = async (): Promise<DonationPageContent> => {
  const existing = await db.donationsPage.findFirst();
  if (existing) return normalizeDonationsPageData(existing);

  const created = await db.donationsPage.create({
    data: defaultDonationsPageData as any,
  });
  return normalizeDonationsPageData(created);
};

export const updateDonationsPageData = async (data: any) => {
  const page = await getDonationsPageData();
  const updated = await db.donationsPage.update({
    where: { id: page.id },
    data,
  });
  return normalizeDonationsPageData(updated);
};
