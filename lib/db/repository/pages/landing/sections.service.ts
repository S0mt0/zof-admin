import { updateLandingPageData, getLandingPageData } from "./core.service";

export const updateLandingHero = (
  values: Omit<HeroSectionContent, "ctas">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      hero: { set: { ...page.hero, ...values } },
    })
  );

export const updateLandingAboutSettings = (
  values: Omit<AboutSectionContent, "cards" | "ctas">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      about: { set: { ...page.about, ...values } },
    })
  );

export const updateLandingValuesSettings = (
  values: Omit<ValuesSectionContent, "cards" | "ctas">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      values: { set: { ...page.values, ...values } },
    })
  );

export const updateLandingVolunteersSettings = (
  values: Omit<VolunteersSectionContent, "ctas">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      volunteers: { set: { ...page.volunteers, ...values } },
    })
  );

export const updateLandingImpactSettings = (
  values: Omit<ImpactSectionContent, "stats" | "ctas">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      impact: { set: { ...page.impact, ...values } },
    })
  );

export const updateLandingTestimonialsSettings = (
  values: Omit<TestimonialsSectionContent, "ctas">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      testimonials: { set: { ...page.testimonials, ...values } },
    })
  );

export const updateLandingFeaturedBlogsSettings = (
  values: Omit<FeaturedContentSectionContent, "ctas">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      featuredBlogs: { set: { ...page.featuredBlogs, ...values } },
    })
  );

export const updateLandingFeaturedEventsSettings = (
  values: Omit<FeaturedContentSectionContent, "ctas">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      featuredEvents: { set: { ...page.featuredEvents, ...values } },
    })
  );

export const updateLandingFaqSettings = (
  values: Omit<FaqSectionContent, "items" | "ctas">
) =>
  getLandingPageData().then((page) =>
    updateLandingPageData({
      faqs: { set: { ...page.faqs, ...values } },
    })
  );
