import { updateLandingPageData, getLandingPageData } from "./core.service";

export const updateLandingHero = (hero: HeroSectionContent) =>
  updateLandingPageData({ hero: { set: hero } });

export const updateLandingAboutSettings = (
  values: Omit<AboutSectionContent, "cards">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      about: { set: { ...page.about, ...values } },
    })
  );

export const updateLandingValuesSettings = (
  values: Omit<ValuesSectionContent, "cards">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      values: { set: { ...page.values, ...values } },
    })
  );

export const updateLandingVolunteersSettings = (
  values: VolunteersSectionContent
) => updateLandingPageData({ volunteers: { set: values } });

export const updateLandingImpactSettings = (
  values: Omit<ImpactSectionContent, "stats">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      impact: { set: { ...page.impact, ...values } },
    })
  );

export const updateLandingTestimonialsSettings = (
  values: TestimonialsSectionContent
) => updateLandingPageData({ testimonials: { set: values } });

export const updateLandingFeaturedBlogsSettings = (
  values: FeaturedContentSectionContent
) => updateLandingPageData({ featuredBlogs: { set: values } });

export const updateLandingFeaturedEventsSettings = (
  values: FeaturedContentSectionContent
) => updateLandingPageData({ featuredEvents: { set: values } });

export const updateLandingFaqSettings = (
  values: Omit<FaqSectionContent, "items">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      faqs: { set: { ...page.faqs, ...values } },
    })
  );
