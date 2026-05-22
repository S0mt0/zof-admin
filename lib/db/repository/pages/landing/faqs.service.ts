import { randomUUID } from "crypto";

import { getLandingPageData, updateLandingPageData } from "./core.service";

export const createLandingFaqItem = async (
  data: Omit<FaqItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const items = page.faqs.items;
  return updateLandingPageData({
    faqs: {
      set: {
        ...page.faqs,
        items: [
          ...items,
          {
            ...data,
            id: randomUUID(),
            order:
              items.reduce((max, item) => Math.max(max, item.order), -1) + 1,
          },
        ],
      },
    },
  });
};

export const updateLandingFaqItem = async (
  id: string,
  data: Omit<FaqItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  return updateLandingPageData({
    faqs: {
      set: {
        ...page.faqs,
        items: page.faqs.items.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      },
    },
  });
};

export const deleteLandingFaqItem = async (id: string) => {
  const page = await getLandingPageData();
  return updateLandingPageData({
    faqs: {
      set: {
        ...page.faqs,
        items: page.faqs.items
          .filter((item) => item.id !== id)
          .map((item, index) => ({ ...item, order: index })),
      },
    },
  });
};

export const reorderLandingFaqItems = async (ids: string[]) => {
  const page = await getLandingPageData();
  const byId = new Map(page.faqs.items.map((item) => [item.id, item]));
  return updateLandingPageData({
    faqs: {
      set: {
        ...page.faqs,
        items: ids
          .map((id, index) => {
            const item = byId.get(id);
            return item ? { ...item, order: index } : null;
          })
          .filter(Boolean),
      },
    },
  });
};
