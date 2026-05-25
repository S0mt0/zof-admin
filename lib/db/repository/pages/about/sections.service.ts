import { getAboutPageData, updateAboutPageData } from "./core.service";
import { normalizeAboutTrustPoints } from "./utils";

export const updateAboutHeroSettings = (
  values: AboutHeroSectionContent
) =>
  getAboutPageData().then((page) =>
    updateAboutPageData({
      aboutUs: values.intro.description || page.aboutUs,
      mission: values.mission,
      vision: values.vision,
      hero: { set: { ...page.hero, ...values } },
    })
  );

export const updateAboutStorySettings = (
  values: AboutStorySectionContent
) =>
  getAboutPageData().then((page) =>
    updateAboutPageData({
      aboutUs: values.body,
      story: {
        set: {
          ...page.story,
          ...values,
          trustPoints: normalizeAboutTrustPoints(page.story.trustPoints),
        },
      },
    })
  );

export const updateAboutTeamSettings = (values: AboutTeamSectionContent) =>
  getAboutPageData().then((page) =>
    updateAboutPageData({
      team: { set: { ...page.team, ...values } },
    })
  );

export const updateAboutFoundersMessageSettings = (
  values: Omit<AboutFoundersMessageSectionContent, "ctas">
) =>
  getAboutPageData().then((page) =>
    updateAboutPageData({
      foundersMessage: {
        set: { ...page.foundersMessage, ...values },
      },
    })
  );

export const updateAboutCtaSettings = (
  values: Omit<AboutCtaSectionContent, "ctas">
) =>
  getAboutPageData().then((page) =>
    updateAboutPageData({
      cta: { set: { ...page.cta, ...values } },
    })
  );
