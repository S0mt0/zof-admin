interface SectionIntroContent {
  eyebrow: string;
  heading: string;
  description: string;
}

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
