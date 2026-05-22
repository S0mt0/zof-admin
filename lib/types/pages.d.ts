interface AboutPageContent {
  id: string;
  aboutUs: string;
  vision: string;
  mission: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SectionIntroContent {
  eyebrow: string;
  heading: string;
  description: string;
}

interface HeroSectionContent {
  title: string;
  subtitle: string;
  image?: string | null;
}

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
