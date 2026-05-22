import { randomUUID } from "crypto";

import { getLandingPageData, updateLandingPageData } from "./core.service";
import { sortByOrder } from "./utils";

const getSection = (page: LandingPageDataContent, section: LandingSection) =>
  page[section] as { ctas: CtaButtonContent[] };

const setSectionCtas = (
  page: LandingPageDataContent,
  section: LandingSection,
  ctas: CtaButtonContent[]
) =>
  updateLandingPageData({
    [section]: {
      set: {
        ...(page[section] as object),
        ctas,
      },
    },
  });

export const createLandingCta = async (
  section: LandingSection,
  data: Omit<CtaButtonContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const current = sortByOrder(getSection(page, section).ctas || []);
  const item = {
    id: randomUUID(),
    ...data,
    order: current.length,
  };

  return setSectionCtas(page, section, [...current, item]);
};

export const updateLandingCta = async (
  section: LandingSection,
  id: string,
  data: Omit<CtaButtonContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const current = getSection(page, section).ctas || [];
  const next = current.map((item) =>
    item.id === id ? { ...item, ...data } : item
  );

  return setSectionCtas(page, section, next);
};

export const deleteLandingCta = async (
  section: LandingSection,
  id: string
) => {
  const page = await getLandingPageData();
  const next = sortByOrder(
    (getSection(page, section).ctas || []).filter((item) => item.id !== id)
  ).map((item, order) => ({ ...item, order }));

  return setSectionCtas(page, section, next);
};

export const reorderLandingCtas = async (
  section: LandingSection,
  ids: string[]
) => {
  const page = await getLandingPageData();
  const items = getSection(page, section).ctas || [];
  const next = ids
    .map((id, order) => {
      const item = items.find((current) => current.id === id);
      return item ? { ...item, order } : null;
    })
    .filter(Boolean) as CtaButtonContent[];

  return setSectionCtas(page, section, next);
};
