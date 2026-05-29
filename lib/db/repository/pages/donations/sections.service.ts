import { getDonationsPageData, updateDonationsPageData } from "./core.service";

export const updateDonationAside = (values: DonationAsideSectionContent) =>
  getDonationsPageData().then((page) =>
    updateDonationsPageData({
      aside: { set: { ...page.aside, ...values } },
    })
  );
