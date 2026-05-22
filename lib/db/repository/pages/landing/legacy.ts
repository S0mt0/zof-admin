import { randomUUID } from "crypto";

import { db } from "../../../config";
import { defaultLandingPageData } from "./defaults";

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

export const createInitialLandingPageData = async () => {
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
