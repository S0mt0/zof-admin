import { defaultGalleryPageData } from "./defaults";

const normalizeIntro = (
  current: Partial<SectionIntroContent> | undefined,
  fallback: SectionIntroContent
): SectionIntroContent => ({
  eyebrow: current?.eyebrow ?? fallback.eyebrow,
  heading: current?.heading ?? fallback.heading,
  description: current?.description ?? fallback.description,
});

export const normalizeGalleryPageData = (data: any): GalleryPageContent => {
  const fallback = defaultGalleryPageData();

  return {
    id: data.id,
    hero: {
      ...fallback.hero,
      ...(data.hero || {}),
      intro: normalizeIntro(data.hero?.intro, fallback.hero.intro),
    },
    archive: {
      ...fallback.archive,
      ...(data.archive || {}),
      intro: normalizeIntro(data.archive?.intro, fallback.archive.intro),
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
