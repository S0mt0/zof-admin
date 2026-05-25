import { randomUUID } from "crypto";

import { getAboutPageData, updateAboutPageData } from "./core.service";
import { normalizeAboutTrustPoints, sortAboutItems } from "./utils";

const setStoryTrustPoints = (
  page: AboutPageContent,
  trustPoints: AboutPageTrustPoint[]
) =>
  updateAboutPageData({
    story: {
      set: {
        ...page.story,
        trustPoints: normalizeAboutTrustPoints(trustPoints),
      },
    },
  });

export const createAboutTrustPoint = async (
  data: Omit<AboutPageTrustPoint, "id" | "order">
) => {
  const page = await getAboutPageData();
  const current = normalizeAboutTrustPoints(page.story.trustPoints || []);
  const item = { id: randomUUID(), ...data, order: current.length };

  return setStoryTrustPoints(page, [...current, item]);
};

export const updateAboutTrustPoint = async (
  id: string,
  data: Omit<AboutPageTrustPoint, "id" | "order">
) => {
  const page = await getAboutPageData();
  const next = (page.story.trustPoints || []).map((item) =>
    item.id === id ? { ...item, ...data } : item
  );

  return setStoryTrustPoints(page, next);
};

export const deleteAboutTrustPoint = async (id: string) => {
  const page = await getAboutPageData();
  const next = sortAboutItems(
    (page.story.trustPoints || []).filter((item) => item.id !== id)
  ).map((item, order) => ({ ...item, order }));

  return setStoryTrustPoints(page, next);
};

export const reorderAboutTrustPoints = async (ids: string[]) => {
  const page = await getAboutPageData();
  const items = page.story.trustPoints || [];
  const next = ids
    .map((id, order) => {
      const item = items.find((current) => current.id === id);
      return item ? { ...item, order } : null;
    })
    .filter(Boolean) as AboutPageTrustPoint[];

  return setStoryTrustPoints(page, next);
};
