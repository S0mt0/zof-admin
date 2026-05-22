interface HeroSectionContent {
  title: string;
  subtitle: string;
  image?: string | null;
}

interface AboutSectionContent {
  intro: SectionIntroContent;
  themePhoto?: string | null;
  cards: SectionCardItemContent[];
}

interface ValuesSectionContent {
  intro: SectionIntroContent;
  cards: SectionCardItemContent[];
  closingText?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

interface VolunteersSectionContent {
  intro: SectionIntroContent;
  featuredVolunteerId?: string | null;
  ctaHeading?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

interface ImpactSectionContent {
  intro: SectionIntroContent;
  youtubeUrl?: string | null;
  stats: LandingStatItemContent[];
}

interface TestimonialsSectionContent {
  intro: SectionIntroContent;
  limit: number;
}

interface FeaturedContentSectionContent {
  intro: SectionIntroContent;
  limit: number;
}

interface FaqSectionContent {
  intro: SectionIntroContent;
  items: FaqItemContent[];
}
