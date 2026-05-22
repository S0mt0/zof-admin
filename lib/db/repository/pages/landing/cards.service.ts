import { randomUUID } from "crypto";

import { getLandingPageData, updateLandingPageData } from "./core.service";
import { sortByOrder, type CardSection } from "./utils";

const getCardItems = (page: LandingPageDataContent, section: CardSection) =>
  section === "about" ? page.about.cards : page.values.cards;

const setCardItems = (
  page: LandingPageDataContent,
  section: CardSection,
  cards: SectionCardItemContent[]
) => {
  if (section === "about") {
    return updateLandingPageData({
      about: { set: { ...page.about, cards: sortByOrder(cards) } },
    });
  }

  return updateLandingPageData({
    values: { set: { ...page.values, cards: sortByOrder(cards) } },
  });
};

export const createLandingSectionCard = async (
  section: CardSection,
  data: Omit<SectionCardItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const cards = getCardItems(page, section);
  const next = [
    ...cards,
    {
      ...data,
      id: randomUUID(),
      order: cards.reduce((max, card) => Math.max(max, card.order), -1) + 1,
    },
  ];
  return setCardItems(page, section, next);
};

export const updateLandingSectionCard = async (
  section: CardSection,
  id: string,
  data: Omit<SectionCardItemContent, "id" | "order">
) => {
  const page = await getLandingPageData();
  const cards = getCardItems(page, section).map((item) =>
    item.id === id ? { ...item, ...data } : item
  );
  return setCardItems(page, section, cards);
};

export const deleteLandingSectionCard = async (
  section: CardSection,
  id: string
) => {
  const page = await getLandingPageData();
  const cards = getCardItems(page, section)
    .filter((item) => item.id !== id)
    .map((item, index) => ({ ...item, order: index }));
  return setCardItems(page, section, cards);
};

export const reorderLandingSectionCards = async (
  section: CardSection,
  ids: string[]
) => {
  const page = await getLandingPageData();
  const byId = new Map(
    getCardItems(page, section).map((item) => [item.id, item])
  );
  const next = ids
    .map((id, index) => {
      const item = byId.get(id);
      return item ? { ...item, order: index } : null;
    })
    .filter(Boolean) as SectionCardItemContent[];
  return setCardItems(page, section, next);
};
