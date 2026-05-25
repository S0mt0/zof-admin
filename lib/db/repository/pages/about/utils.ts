import { randomUUID } from "crypto";

export const aboutIntro = (
  eyebrow: string,
  heading: string,
  description = ""
): SectionIntroContent => ({ eyebrow, heading, description });

export const aboutCta = (
  label: string,
  href: string,
  order = 0,
  variant: CtaVariant = "primary"
): CtaButtonContent => ({
  id: randomUUID(),
  label,
  href,
  variant,
  order,
  published: true,
});

export const sortAboutItems = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

export const normalizeAboutTrustPoints = (
  items: AboutPageTrustPoint[] = []
): AboutPageTrustPoint[] => {
  let publishedCount = 0;

  return sortAboutItems(items).map((item, order) => {
    const published = item.published && publishedCount < 4;
    if (published) publishedCount += 1;

    return {
      ...item,
      order,
      published,
    };
  });
};
