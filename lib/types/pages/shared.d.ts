interface SectionIntroContent {
  eyebrow: string;
  heading: string;
  description: string;
}

type CtaVariant = "primary" | "secondary";

interface CtaButtonContent {
  id: string;
  label: string;
  href: string;
  variant: CtaVariant;
  order: number;
  published: boolean;
}
