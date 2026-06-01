// About Page
interface AboutPageContent {
  id: string;
  aboutUs: string;
  vision: string;
  mission: string;
  hero: AboutHeroSectionContent;
  story: AboutStorySectionContent;
  team: AboutTeamSectionContent;
  foundersMessage: AboutFoundersMessageSectionContent;
  cta: AboutCtaSectionContent;
  createdAt: Date;
  updatedAt: Date;
}

// Section types
type AboutSection = "hero" | "story" | "team" | "foundersMessage" | "cta";

interface AboutHeroSectionContent {
  intro: SectionIntroContent;
  image?: string | null;
  mission: string;
  vision: string;
  calloutTitle?: string | null;
  calloutText?: string | null;
  heroBackgroundColor?: string | null;
  calloutBackgroundColor?: string | null;
}

interface AboutPageTrustPoint {
  id: string;
  point: string;
  published: boolean;
  order: number;
}

interface AboutStorySectionContent {
  intro: SectionIntroContent;
  body: string;
  image?: string | null;
  captionTitle?: string | null;
  captionText?: string | null;
  trustPoints: AboutPageTrustPoint[];
}

interface AboutTeamSectionContent {
  intro: SectionIntroContent;
  members?: Partial<TeamMember>[];
}

interface AboutFoundersMessageSectionContent {
  intro: SectionIntroContent;
  quote: string;
  body: string;
  image?: string | null;
  ctas: CtaButtonContent[];
}

interface AboutCtaSectionContent {
  intro: SectionIntroContent;
  backgroundImage?: string | null;
  ctas: CtaButtonContent[];
}

type AboutCtaSection = "foundersMessage" | "cta";
