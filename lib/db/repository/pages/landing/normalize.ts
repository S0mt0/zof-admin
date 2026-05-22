import { defaultLandingPageData } from "./defaults";
import { sortByOrder } from "./utils";

export const normalizeLandingPageData = (data: any): LandingPageDataContent => {
  const fallback = defaultLandingPageData();

  return {
    id: data.id,
    hero: { ...fallback.hero, ...(data.hero || {}) },
    about: {
      ...fallback.about,
      ...(data.about || {}),
      intro: { ...fallback.about.intro, ...(data.about?.intro || {}) },
      cards: sortByOrder(data.about?.cards || fallback.about.cards),
    },
    values: {
      ...fallback.values,
      ...(data.values || {}),
      intro: { ...fallback.values.intro, ...(data.values?.intro || {}) },
      cards: sortByOrder(data.values?.cards || fallback.values.cards),
    },
    volunteers: {
      ...fallback.volunteers,
      ...(data.volunteers || {}),
      intro: {
        ...fallback.volunteers.intro,
        ...(data.volunteers?.intro || {}),
      },
    },
    impact: {
      ...fallback.impact,
      ...(data.impact || {}),
      intro: { ...fallback.impact.intro, ...(data.impact?.intro || {}) },
      stats: sortByOrder(data.impact?.stats || fallback.impact.stats),
    },
    testimonials: {
      ...fallback.testimonials,
      ...(data.testimonials || {}),
      intro: {
        ...fallback.testimonials.intro,
        ...(data.testimonials?.intro || {}),
      },
    },
    featuredBlogs: {
      ...fallback.featuredBlogs,
      ...(data.featuredBlogs || {}),
      intro: {
        ...fallback.featuredBlogs.intro,
        ...(data.featuredBlogs?.intro || {}),
      },
    },
    featuredEvents: {
      ...fallback.featuredEvents,
      ...(data.featuredEvents || {}),
      intro: {
        ...fallback.featuredEvents.intro,
        ...(data.featuredEvents?.intro || {}),
      },
    },
    faqs: {
      ...fallback.faqs,
      ...(data.faqs || {}),
      intro: { ...fallback.faqs.intro, ...(data.faqs?.intro || {}) },
      items: sortByOrder(data.faqs?.items || fallback.faqs.items),
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
