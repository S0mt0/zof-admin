import { getEventsPageData, updateEventsPageData } from "./core.service";

export const updateEventsHeroSettings = (values: EventsHeroSectionContent) =>
  getEventsPageData().then((page) =>
    updateEventsPageData({
      hero: { set: { ...page.hero, ...values } },
    })
  );
