import { getEventsPageData, updateEventsPageData } from "./core.service";

export const updateEventsHeroContent = (values: EventsHeroSectionContent) =>
  getEventsPageData().then((page) =>
    updateEventsPageData({
      hero: { set: { ...page.hero, ...values } },
    })
  );

export const updateEventsArchiveContent = (
  values: EventsArchiveSectionContent
) =>
  getEventsPageData().then((page) =>
    updateEventsPageData({
      team: { set: { ...page.archive, ...values } },
    })
  );
