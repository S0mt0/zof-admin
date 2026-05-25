import { randomUUID } from "crypto";

import { defaultAboutPageData } from "./defaults";
import { normalizeAboutTrustPoints, sortAboutItems } from "./utils";

const normalizeIntro = (
  current: Partial<SectionIntroContent> | undefined,
  fallback: SectionIntroContent
): SectionIntroContent => ({
  eyebrow: current?.eyebrow ?? fallback.eyebrow,
  heading: current?.heading ?? fallback.heading,
  description: current?.description ?? fallback.description,
});

const normalizeCtas = (
  current: any,
  fallback: CtaButtonContent[]
): CtaButtonContent[] => {
  if (!Array.isArray(current?.ctas)) return fallback;

  return sortAboutItems(
    current.ctas.map((cta: Partial<CtaButtonContent>, index: number) => ({
      id: cta.id || randomUUID(),
      label: cta.label || "",
      href: cta.href || "#",
      variant: cta.variant === "secondary" ? "secondary" : "primary",
      order: typeof cta.order === "number" ? cta.order : index,
      published: cta.published !== false,
    }))
  );
};

const normalizeTrustPoints = (
  current: any,
  fallback: AboutPageTrustPoint[]
): AboutPageTrustPoint[] => {
  if (!Array.isArray(current)) return fallback;

  return normalizeAboutTrustPoints(
    current.map((trustPoint: Partial<AboutPageTrustPoint>, index: number) => ({
      id: trustPoint.id || randomUUID(),
      point: trustPoint.point || "",
      order: typeof trustPoint.order === "number" ? trustPoint.order : index,
      published: trustPoint.published !== false,
    }))
  );
};

export const normalizeAboutPageData = (data: any): AboutPageContent => {
  const fallback = defaultAboutPageData({
    aboutUs: data.aboutUs,
    mission: data.mission,
    vision: data.vision,
  });

  return {
    id: data.id,
    aboutUs: data.aboutUs || fallback.aboutUs,
    mission: data.mission || fallback.mission,
    vision: data.vision || fallback.vision,
    hero: {
      ...fallback.hero,
      ...(data.hero || {}),
      intro: normalizeIntro(data.hero?.intro, fallback.hero.intro),
    },
    story: {
      ...fallback.story,
      ...(data.story || {}),
      intro: normalizeIntro(data.story?.intro, fallback.story.intro),
      body: data.story?.body || data.aboutUs || fallback.story.body,
      trustPoints: normalizeTrustPoints(
        data.story?.trustPoints,
        fallback.story.trustPoints
      ),
    },
    team: {
      ...fallback.team,
      ...(data.team || {}),
      intro: normalizeIntro(data.team?.intro, fallback.team.intro),
    },
    foundersMessage: {
      ...fallback.foundersMessage,
      ...(data.foundersMessage || {}),
      intro: normalizeIntro(
        data.foundersMessage?.intro,
        fallback.foundersMessage.intro
      ),
      ctas: normalizeCtas(data.foundersMessage, fallback.foundersMessage.ctas),
    },
    cta: {
      ...fallback.cta,
      ...(data.cta || {}),
      intro: normalizeIntro(data.cta?.intro, fallback.cta.intro),
      ctas: normalizeCtas(data.cta, fallback.cta.ctas),
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};
