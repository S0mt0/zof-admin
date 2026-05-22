interface HeroSectionContent {
  title: string;
  subtitle: string;
  image?: string | null;
  ctas: CtaButtonContent[];
}

interface AboutSectionContent {
  intro: SectionIntroContent;
  themePhoto?: string | null;
  cards: SectionCardItemContent[];
  ctas: CtaButtonContent[];
}

interface ValuesSectionContent {
  intro: SectionIntroContent;
  cards: SectionCardItemContent[];
  closingText?: string | null;
  ctas: CtaButtonContent[];
}

interface VolunteersSectionContent {
  intro: SectionIntroContent;
  ctaHeading?: string | null;
  ctas: CtaButtonContent[];
}

interface ImpactSectionContent {
  intro: SectionIntroContent;
  youtubeUrl?: string | null;
  stats: LandingStatItemContent[];
  ctas: CtaButtonContent[];
}

interface TestimonialsSectionContent {
  intro: SectionIntroContent;
  limit: number;
  ctas: CtaButtonContent[];
}

interface FeaturedContentSectionContent {
  intro: SectionIntroContent;
  limit: number;
  ctas: CtaButtonContent[];
}

interface FaqSectionContent {
  intro: SectionIntroContent;
  items: FaqItemContent[];
  ctas: CtaButtonContent[];
}
