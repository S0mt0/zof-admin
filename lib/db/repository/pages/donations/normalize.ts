import { defaultDonationsPageData } from "./defaults";

export const normalizeDonationsPageData = (data: any): DonationPageContent => ({
  id: data.id,
  aside: {
    intro: {
      ...defaultDonationsPageData.aside.intro,
      ...(data.aside?.intro || {}),
    },
  },
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
