import { randomUUID } from "crypto";

import { getLandingPageData, updateLandingPageData } from "./core.service";

export const createLandingImpactStat = async (
  data: Omit<LandingStatItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const stats = page.impact.stats;
  return updateLandingPageData({
    impact: {
      set: {
        ...page.impact,
        stats: [
          ...stats,
          {
            ...data,
            id: randomUUID(),
            order:
              stats.reduce((max, stat) => Math.max(max, stat.order), -1) + 1,
          },
        ],
      },
    },
  });
};

export const updateLandingImpactStat = async (
  id: string,
  data: Omit<LandingStatItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  return updateLandingPageData({
    impact: {
      set: {
        ...page.impact,
        stats: page.impact.stats.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      },
    },
  });
};

export const deleteLandingImpactStat = async (id: string) => {
  const page = await getLandingPageData();
  return updateLandingPageData({
    impact: {
      set: {
        ...page.impact,
        stats: page.impact.stats
          .filter((item) => item.id !== id)
          .map((item, index) => ({ ...item, order: index })),
      },
    },
  });
};

export const reorderLandingImpactStats = async (ids: string[]) => {
  const page = await getLandingPageData();
  const byId = new Map(page.impact.stats.map((item) => [item.id, item]));
  return updateLandingPageData({
    impact: {
      set: {
        ...page.impact,
        stats: ids
          .map((id, index) => {
            const item = byId.get(id);
            return item ? { ...item, order: index } : null;
          })
          .filter(Boolean),
      },
    },
  });
};
