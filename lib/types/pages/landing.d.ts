// Landing Page
interface LandingPageDataContent {
  id: string;
  hero: HeroSectionContent;
  about: AboutSectionContent;
  values: ValuesSectionContent;
  volunteers: VolunteersSectionContent;
  impact: ImpactSectionContent;
  testimonials: TestimonialsSectionContent;
  featuredBlogs: FeaturedContentSectionContent;
  featuredEvents: FeaturedContentSectionContent;
  faqs: FaqSectionContent;
  createdAt: Date;
  updatedAt: Date;
}

// Sections Types
type LandingSection =
  | "hero"
  | "about"
  | "values"
  | "volunteers"
  | "impact"
  | "testimonials"
  | "featuredBlogs"
  | "featuredEvents"
  | "faqs";

// Sections
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

// Items
interface SectionCardItemContent {
  id: string;
  subject: string;
  kicker?: string | null;
  description: string;
  order: number;
  published: boolean;
}

interface LandingStatItemContent {
  id: string;
  value: string;
  title: string;
  order: number;
  published: boolean;
}

interface FaqItemContent {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role?: string | null;
  quote: string;
  avatar?: string | null;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
