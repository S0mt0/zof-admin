export const defaultBlogsPageData = (): Omit<
  BlogsPageContent,
  "id" | "createdAt" | "updatedAt"
> => {
  return {
    hero: {
      intro: {
        eyebrow: "Latest stories",
        heading: "Blog and articles",
        description:
          "Read field notes, reflections, and updates from our outreach, education support, and community care programs.",
      },
      heroBackgroundColor: "#183F35",
    },
  };
};
