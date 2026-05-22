import { randomUUID } from "crypto";

import { defaultLandingPageData } from "./defaults";
import { sortByOrder } from "./utils";

const normalizeCtas = (
  current: any,
  fallback: CtaButtonContent[]
): CtaButtonContent[] => {
  if (Array.isArray(current?.ctas)) {
    return sortByOrder(
      current.ctas.map((cta: Partial<CtaButtonContent>, index: number) => ({
        id: cta.id || randomUUID(),
        label: cta.label || "",
        href: cta.href || "#",
        variant: cta.variant === "secondary" ? "secondary" : "primary",
        order: typeof cta.order === "number" ? cta.order : index,
        published: cta.published !== false,
      }))
    );
  }

  if (current?.ctaLabel && current?.ctaHref) {
    return [
      {
        id: randomUUID(),
        label: current.ctaLabel,
        href: current.ctaHref,
        variant: "primary",
        order: 0,
        published: true,
      },
    ];
  }

  return fallback;
};

const stripLegacyFields = (section: any = {}) => {
  const { ctaLabel, ctaHref, featuredVolunteerId, ...rest } = section;
  return rest;
};

export const normalizeLandingPageData = (data: any): LandingPageDataContent => {
  const fallback = defaultLandingPageData();

  return {
    id: data.id,
    hero: {
      ...fallback.hero,
      ...stripLegacyFields(data.hero),
      ctas: normalizeCtas(data.hero, fallback.hero.ctas),
    },
    about: {
      ...fallback.about,
      ...stripLegacyFields(data.about),
      intro: { ...fallback.about.intro, ...(data.about?.intro || {}) },
      cards: sortByOrder(data.about?.cards || fallback.about.cards),
      ctas: normalizeCtas(data.about, fallback.about.ctas),
    },
    values: {
      ...fallback.values,
      ...stripLegacyFields(data.values),
      intro: { ...fallback.values.intro, ...(data.values?.intro || {}) },
      cards: sortByOrder(data.values?.cards || fallback.values.cards),
      ctas: normalizeCtas(data.values, fallback.values.ctas),
    },
    volunteers: {
      ...fallback.volunteers,
      ...stripLegacyFields(data.volunteers),
      intro: {
        ...fallback.volunteers.intro,
        ...(data.volunteers?.intro || {}),
      },
      ctas: normalizeCtas(data.volunteers, fallback.volunteers.ctas),
    },
    impact: {
      ...fallback.impact,
      ...stripLegacyFields(data.impact),
      intro: { ...fallback.impact.intro, ...(data.impact?.intro || {}) },
      stats: sortByOrder(data.impact?.stats || fallback.impact.stats),
      ctas: normalizeCtas(data.impact, fallback.impact.ctas),
    },
    testimonials: {
      ...fallback.testimonials,
      ...stripLegacyFields(data.testimonials),
      intro: {
        ...fallback.testimonials.intro,
        ...(data.testimonials?.intro || {}),
      },
      ctas: normalizeCtas(data.testimonials, fallback.testimonials.ctas),
    },
    featuredBlogs: {
      ...fallback.featuredBlogs,
      ...stripLegacyFields(data.featuredBlogs),
      intro: {
        ...fallback.featuredBlogs.intro,
        ...(data.featuredBlogs?.intro || {}),
      },
      ctas: normalizeCtas(data.featuredBlogs, fallback.featuredBlogs.ctas),
    },
    featuredEvents: {
      ...fallback.featuredEvents,
      ...stripLegacyFields(data.featuredEvents),
      intro: {
        ...fallback.featuredEvents.intro,
        ...(data.featuredEvents?.intro || {}),
      },
      ctas: normalizeCtas(data.featuredEvents, fallback.featuredEvents.ctas),
    },
    faqs: {
      ...fallback.faqs,
      ...stripLegacyFields(data.faqs),
      intro: { ...fallback.faqs.intro, ...(data.faqs?.intro || {}) },
      items: sortByOrder(data.faqs?.items || fallback.faqs.items),
      ctas: normalizeCtas(data.faqs, fallback.faqs.ctas),
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
