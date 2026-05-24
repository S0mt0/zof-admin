import { randomUUID } from "crypto";

import { getAboutPageData, updateAboutPageData } from "./core.service";
import { sortAboutItems } from "./utils";

const getSection = (page: AboutPageContent, section: AboutCtaSection) =>
  page[section] as { ctas: CtaButtonContent[] };

const setSectionCtas = (
  page: AboutPageContent,
  section: AboutCtaSection,
  ctas: CtaButtonContent[]
) =>
  updateAboutPageData({
    [section]: {
      set: {
        ...(page[section] as object),
        ctas,
      },
    },
  });

export const createAboutCta = async (
  section: AboutCtaSection,
  data: Omit<CtaButtonContent, "id" | "order">
) => {
  const page = await getAboutPageData();
  const current = sortAboutItems(getSection(page, section).ctas || []);
  const item = { id: randomUUID(), ...data, order: current.length };

  return setSectionCtas(page, section, [...current, item]);
};

export const updateAboutCta = async (
  section: AboutCtaSection,
  id: string,
  data: Omit<CtaButtonContent, "id" | "order">
) => {
  const page = await getAboutPageData();
  const next = (getSection(page, section).ctas || []).map((item) =>
    item.id === id ? { ...item, ...data } : item
  );

  return setSectionCtas(page, section, next);
};

export const deleteAboutCta = async (section: AboutCtaSection, id: string) => {
  const page = await getAboutPageData();
  const next = sortAboutItems(
    (getSection(page, section).ctas || []).filter((item) => item.id !== id)
  ).map((item, order) => ({ ...item, order }));

  return setSectionCtas(page, section, next);
};

export const reorderAboutCtas = async (
  section: AboutCtaSection,
  ids: string[]
) => {
  const page = await getAboutPageData();
  const items = getSection(page, section).ctas || [];
  const next = ids
    .map((id, order) => {
      const item = items.find((current) => current.id === id);
      return item ? { ...item, order } : null;
    })
    .filter(Boolean) as CtaButtonContent[];

  return setSectionCtas(page, section, next);
};
