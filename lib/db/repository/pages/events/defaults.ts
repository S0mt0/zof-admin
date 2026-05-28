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
  };
};
