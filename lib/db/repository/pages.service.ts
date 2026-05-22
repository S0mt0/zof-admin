import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";

import { db } from "../config";

type CardSection = "about" | "values";

const sortByOrder = <T extends { order: number; id?: string }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

const intro = (
  eyebrow: string,
  heading: string,
  description = ""
): SectionIntroContent => ({ eyebrow, heading, description });

const defaultLandingPageData = (): Omit<
  LandingPageDataContent,
  "id" | "createdAt" | "updatedAt"
> => ({
  hero: {
    title: "Care that reaches people where they are.",
    subtitle:
      "We support women, young people, and families with practical programs that create dignity, opportunity, and stronger community futures.",
    image: "",
  },
  about: {
    intro: intro(
      "Mission snapshot",
      "We turn care into practical pathways for growth.",
      "Zita Onyeka Foundation works with women, young people, and underserved families through education, relief outreach, skills development, and community-centered support."
    ),
    themePhoto: "",
    cards: [
      {
        id: randomUUID(),
        subject: "Empower",
        kicker: "Confidence",
        description:
          "Skills, mentorship, and community support that help women and families move with confidence.",
        order: 0,
        published: true,
      },
      {
        id: randomUUID(),
        subject: "Educate",
        kicker: "Opportunity",
        description:
          "Learning support and youth development programs that create stronger paths forward.",
        order: 1,
        published: true,
      },
      {
        id: randomUUID(),
        subject: "Relieve",
        kicker: "Dignity",
        description:
          "Timely outreach for households facing urgent needs, delivered with dignity and care.",
        order: 2,
        published: true,
      },
    ],
  },
  values: {
    intro: intro(
      "How change happens",
      "Simple principles, steady action.",
      "Our work is shaped by listening, collaboration, and practical support that remains valuable after the campaign, event, or photo."
    ),
    cards: [
      {
        id: randomUUID(),
        subject: "Listen first",
        kicker: "",
        description:
          "We begin with people, families, and local realities so support is useful from the start.",
        order: 0,
        published: true,
      },
      {
        id: randomUUID(),
        subject: "Build steadily",
        kicker: "",
        description:
          "We favor consistent programs, education, and skills over one-off moments of attention.",
        order: 1,
        published: true,
      },
      {
        id: randomUUID(),
        subject: "Partner well",
        kicker: "",
        description:
          "We work with volunteers, donors, and community leaders to make care go further.",
        order: 2,
        published: true,
      },
    ],
    closingText:
      "The goal is not just to respond to need, but to strengthen the systems of care around each person and community we serve.",
    ctaLabel: "Start a partnership",
    ctaHref: "/contact",
  },
  volunteers: {
    intro: intro(
      "Volunteer movement",
      "The hands that help care reach further.",
      "Our volunteers bring time, skill, logistics, encouragement, and presence to the work. They help turn planning into real support for families and communities."
    ),
    featuredVolunteerId: "",
    ctaHeading:
      "Your time and skills can help make support feel personal.",
    ctaLabel: "Volunteer with us",
    ctaHref: "/contact",
  },
  impact: {
    intro: intro(
      "Impact proof",
      "The numbers matter because people do.",
      "Our impact is measured through real support: outreach delivered, volunteers mobilized, meals shared, and communities strengthened through steady care."
    ),
    youtubeUrl: "https://youtu.be/CEzKcqI9X6E?si=hmtLsFor7P5KMa06",
    stats: [],
  },
  testimonials: {
    intro: intro(
      "Testimonials",
      "Trusted by the people closest to the work.",
      ""
    ),
    limit: 6,
  },
  featuredBlogs: {
    intro: intro(
      "Latest stories",
      "Stories from the work we are doing.",
      ""
    ),
    limit: 4,
  },
  featuredEvents: {
    intro: intro(
      "Upcoming events",
      "Join the moments that move the mission.",
      ""
    ),
    limit: 3,
  },
  faqs: {
    intro: intro(
      "FAQs",
      "Helpful answers before you reach out",
      "A quick guide to support, partnerships, programs, and the work we do with communities."
    ),
    items: [],
  },
});

const normalizeLandingPageData = (
  data: any
): LandingPageDataContent => {
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

const readLegacyCollection = async <T>(collection: string): Promise<T[]> => {
  try {
    const result = (await db.$runCommandRaw({
      find: collection,
      sort: { order: 1, createdAt: 1 },
    })) as any;

    return (result?.cursor?.firstBatch || []) as T[];
  } catch {
    return [];
  }
};

const createInitialLandingPageData = async () => {
  const fallback = defaultLandingPageData();
  const [legacyExtra] = await readLegacyCollection<any>("LandingExtra");
  const legacyFaqs = await readLegacyCollection<any>("LandingFaq");
  const legacyStats = await readLegacyCollection<any>("LandingStat");
  const legacyTestimonials = await readLegacyCollection<any>(
    "LandingTestimonial"
  );

  if (legacyTestimonials.length) {
    const existingTestimonials = await db.testimonial.count();
    if (!existingTestimonials) {
      await db.testimonial.createMany({
        data: legacyTestimonials.map((item: any, index: number) => ({
          name: item.name || "",
          role: item.role || "",
          quote: item.quote || "",
          avatar: item.avatar || "",
          order: item.order ?? index,
          published: item.published ?? true,
        })),
      });
    }
  }

  return {
    ...fallback,
    hero: {
      ...fallback.hero,
      image: legacyExtra?.heroImage || fallback.hero.image,
    },
    about: {
      ...fallback.about,
      themePhoto: legacyExtra?.aboutImage || fallback.about.themePhoto,
    },
    impact: {
      ...fallback.impact,
      youtubeUrl: legacyExtra?.themeVideo || fallback.impact.youtubeUrl,
      stats: legacyStats.map((item: any, index: number) => ({
        id: randomUUID(),
        value: item.value || "",
        title: item.title || "",
        order: item.order ?? index,
        published: item.published ?? true,
      })),
    },
    faqs: {
      ...fallback.faqs,
      items: legacyFaqs.map((item: any, index: number) => ({
        id: randomUUID(),
        question: item.question || "",
        answer: item.answer || "",
        order: item.order ?? index,
        published: item.published ?? true,
      })),
    },
  };
};

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

export const getLandingPageData = async (): Promise<LandingPageDataContent> => {
  const existing = await db.landingPageData.findFirst();
  if (existing) return normalizeLandingPageData(existing);

  const data = await createInitialLandingPageData();
  const created = await db.landingPageData.create({ data: data as any });
  return normalizeLandingPageData(created);
};

const updateLandingPageData = async (data: any) => {
  const page = await getLandingPageData();
  const updated = await db.landingPageData.update({
    where: { id: page.id },
    data,
  });
  return normalizeLandingPageData(updated);
};

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

const getCardItems = (page: LandingPageDataContent, section: CardSection) =>
  section === "about" ? page.about.cards : page.values.cards;

const setCardItems = (
  page: LandingPageDataContent,
  section: CardSection,
  cards: SectionCardItemContent[]
) => {
  if (section === "about") {
    return updateLandingPageData({
      about: { set: { ...page.about, cards: sortByOrder(cards) } },
    });
  }

  return updateLandingPageData({
    values: { set: { ...page.values, cards: sortByOrder(cards) } },
  });
};

export const createLandingSectionCard = async (
  section: CardSection,
  data: Omit<SectionCardItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const cards = getCardItems(page, section);
  const next = [
    ...cards,
    {
      ...data,
      id: randomUUID(),
      order: cards.reduce((max, card) => Math.max(max, card.order), -1) + 1,
    },
  ];
  return setCardItems(page, section, next);
};

export const updateLandingSectionCard = async (
  section: CardSection,
  id: string,
  data: Omit<SectionCardItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const cards = getCardItems(page, section).map((item) =>
    item.id === id ? { ...item, ...data } : item
  );
  return setCardItems(page, section, cards);
};

export const deleteLandingSectionCard = async (
  section: CardSection,
  id: string
) => {
  const page = await getLandingPageData();
  const cards = getCardItems(page, section)
    .filter((item) => item.id !== id)
    .map((item, index) => ({ ...item, order: index }));
  return setCardItems(page, section, cards);
};

export const reorderLandingSectionCards = async (
  section: CardSection,
  ids: string[]
) => {
  const page = await getLandingPageData();
  const byId = new Map(getCardItems(page, section).map((item) => [item.id, item]));
  const next = ids
    .map((id, index) => {
      const item = byId.get(id);
      return item ? { ...item, order: index } : null;
    })
    .filter(Boolean) as SectionCardItemContent[];
  return setCardItems(page, section, next);
};

export const createLandingImpactStat = async (
  data: Omit<LandingStatItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const stats = page.impact.stats;
  return updateLandingPageData({
    impact: {
      set: {
        ...page.impact,
        stats: [
          ...stats,
          {
            ...data,
            id: randomUUID(),
            order: stats.reduce((max, stat) => Math.max(max, stat.order), -1) + 1,
          },
        ],
      },
    },
  });
};

export const updateLandingImpactStat = async (
  id: string,
  data: Omit<LandingStatItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  return updateLandingPageData({
    impact: {
      set: {
        ...page.impact,
        stats: page.impact.stats.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      },
    },
  });
};

export const deleteLandingImpactStat = async (id: string) => {
  const page = await getLandingPageData();
  return updateLandingPageData({
    impact: {
      set: {
        ...page.impact,
        stats: page.impact.stats
          .filter((item) => item.id !== id)
          .map((item, index) => ({ ...item, order: index })),
      },
    },
  });
};

export const reorderLandingImpactStats = async (ids: string[]) => {
  const page = await getLandingPageData();
  const byId = new Map(page.impact.stats.map((item) => [item.id, item]));
  return updateLandingPageData({
    impact: {
      set: {
        ...page.impact,
        stats: ids
          .map((id, index) => {
            const item = byId.get(id);
            return item ? { ...item, order: index } : null;
          })
          .filter(Boolean),
      },
    },
  });
};

export const createLandingFaqItem = async (
  data: Omit<FaqItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const items = page.faqs.items;
  return updateLandingPageData({
    faqs: {
      set: {
        ...page.faqs,
        items: [
          ...items,
          {
            ...data,
            id: randomUUID(),
            order: items.reduce((max, item) => Math.max(max, item.order), -1) + 1,
          },
        ],
      },
    },
  });
};

export const updateLandingFaqItem = async (
  id: string,
  data: Omit<FaqItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  return updateLandingPageData({
    faqs: {
      set: {
        ...page.faqs,
        items: page.faqs.items.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      },
    },
  });
};

export const deleteLandingFaqItem = async (id: string) => {
  const page = await getLandingPageData();
  return updateLandingPageData({
    faqs: {
      set: {
        ...page.faqs,
        items: page.faqs.items
          .filter((item) => item.id !== id)
          .map((item, index) => ({ ...item, order: index })),
      },
    },
  });
};

export const reorderLandingFaqItems = async (ids: string[]) => {
  const page = await getLandingPageData();
  const byId = new Map(page.faqs.items.map((item) => [item.id, item]));
  return updateLandingPageData({
    faqs: {
      set: {
        ...page.faqs,
        items: ids
          .map((id, index) => {
            const item = byId.get(id);
            return item ? { ...item, order: index } : null;
          })
          .filter(Boolean),
      },
    },
  });
};

export const listTestimonials = async (
  options: {
    where?: Prisma.TestimonialWhereInput;
    select?: Prisma.TestimonialSelect;
    orderBy?: Prisma.TestimonialOrderByWithRelationInput;
  } = {}
): Promise<Testimonial[]> => {
  try {
    return (await db.testimonial.findMany({
      where: options.where,
      orderBy: options.orderBy || [{ order: "asc" }, { createdAt: "desc" }],
      ...(options.select ? { select: options.select } : {}),
    })) as Testimonial[];
  } catch (error) {
    console.error("Error listing testimonials: ", error);
    return [];
  }
};

export const createTestimonial = async (
  data: Prisma.TestimonialCreateInput
) => {
  try {
    return (await db.testimonial.create({ data })) as Testimonial;
  } catch (error) {
    console.error("Error creating testimonial: ", error);
    return null;
  }
};

export const updateTestimonial = async (
  id: string,
  data: Prisma.TestimonialUpdateInput
) => {
  try {
    return (await db.testimonial.update({ where: { id }, data })) as Testimonial;
  } catch (error) {
    console.error("Error updating testimonial: ", error);
    return null;
  }
};

export const deleteTestimonial = async (id: string) => {
  try {
    return (await db.testimonial.delete({ where: { id } })) as Testimonial;
  } catch (error) {
    console.error("Error deleting testimonial: ", error);
    return null;
  }
};

export const reorderTestimonials = async (ids: string[]) => {
  try {
    await Promise.all(
      ids.map((id, order) => db.testimonial.update({ where: { id }, data: { order } }))
    );
    return true;
  } catch (error) {
    console.error("Error reordering testimonials: ", error);
    return false;
  }
};
