import { defaultBlogsPageData } from "./defaults";

const normalizeIntro = (
  current: Partial<SectionIntroContent> | undefined,
  fallback: SectionIntroContent
): SectionIntroContent => ({
  eyebrow: current?.eyebrow ?? fallback.eyebrow,
  heading: current?.heading ?? fallback.heading,
  description: current?.description ?? fallback.description,
});

export const normalizeBlogsPageData = (data: any): BlogsPageContent => {
  const fallback = defaultBlogsPageData();

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
