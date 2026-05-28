import { defaultEventsPageData } from "./defaults";

const normalizeIntro = (
  current: Partial<SectionIntroContent> | undefined,
  fallback: SectionIntroContent
): SectionIntroContent => ({
  eyebrow: current?.eyebrow ?? fallback.eyebrow,
  heading: current?.heading ?? fallback.heading,
  description: current?.description ?? fallback.description,
});

export const normalizeEventsPageData = (data: any): EventsPageContent => {
  const fallback = defaultEventsPageData();

  return {
    id: data.id,
    hero: {
      ...fallback.hero,
      ...(data.hero || {}),
      intro: normalizeIntro(data.hero?.intro, fallback.hero.intro),
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
