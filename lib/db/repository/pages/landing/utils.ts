export type CardSection = "about" | "values";

export const sortByOrder = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

export const intro = (
  eyebrow: string,
  heading: string,
  description = ""
): SectionIntroContent => ({ eyebrow, heading, description });
