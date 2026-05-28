export const defaultEventsPageData = (): Omit<
  EventsPageContent,
  "id" | "createdAt" | "updatedAt"
> => {
  return {
    hero: {
      intro: {
        eyebrow: "Events and programmes",
        heading: " Gatherings built around practical care.",
        description:
          "Outreaches, community programs, learning sessions, and volunteer moments organized around support people can use.",
      },
      heroBackgroundColor: "#183F35",
    },
    archive: {
      intro: {
        eyebrow: "Event calendar",
        heading: "More events and field moments",
        description:
          "Browse the wider event list. Each item includes the essentials: date, time, location, status, and what the gathering is about.",
      },
    },
  };
};
