export const defaultGalleryPageData = (): Omit<
  GalleryPageContent,
  "id" | "createdAt" | "updatedAt"
> => ({
  hero: {
    intro: {
      eyebrow: "Gallery",
      heading: "Field moments, not stock moments.",
      description:
        "A visual archive of outreach, learning support, volunteer work, and community care captured as the work happens.",
    },
    primaryImage: "/assets/img/zof_led_community.jpg",
    secondaryImage: "/assets/img/ZOF_WOMEN_SKILL_AQ.jpg",
    heroBackgroundColor: "#fbfcf8",
  },
  archive: {
    intro: {
      eyebrow: "Media archive",
      heading: "Browse the work visually",
      description:
        "Photos and videos from programmes, outreach, and community moments.",
    },
  },
});
