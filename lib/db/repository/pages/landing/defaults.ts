import { randomUUID } from "crypto";

import { intro } from "./utils";

const cta = (
  label: string,
  href: string,
  order = 0,
  variant: CtaVariant = "primary"
): CtaButtonContent => ({
  id: randomUUID(),
  label,
  href,
  variant,
  order,
  published: true,
});

export const defaultLandingPageData = (): Omit<
  LandingPageDataContent,
  "id" | "createdAt" | "updatedAt"
> => ({
  hero: {
    title: "Care that reaches people where they are.",
    subtitle:
      "We support women, young people, and families with practical programs that create dignity, opportunity, and stronger community futures.",
    image: "",
    ctas: [
      cta("Donate now", "/donate", 0, "primary"),
      cta("Learn about us", "/about", 1, "secondary"),
    ],
  },
  about: {
    intro: intro(
      "Mission snapshot",
      "We turn care into practical pathways for growth.",
      "Zita Onyeka Foundation works with women, young people, and underserved families through education, relief outreach, skills development, and community-centered support."
    ),
    themePhoto: "",
    ctas: [cta("Learn more about us", "/about")],
    cards: [
      {
        id: randomUUID(),
        subject: "Empower",
        kicker: "Confidence",
        description:
          "Skills, mentorship, and community support that help women and families move with confidence.",
        order: 0,
        published: true,
      },
      {
        id: randomUUID(),
        subject: "Educate",
        kicker: "Opportunity",
        description:
          "Learning support and youth development programs that create stronger paths forward.",
        order: 1,
        published: true,
      },
      {
        id: randomUUID(),
        subject: "Relieve",
        kicker: "Dignity",
        description:
          "Timely outreach for households facing urgent needs, delivered with dignity and care.",
        order: 2,
        published: true,
      },
    ],
  },
  values: {
    intro: intro(
      "How change happens",
      "Simple principles, steady action.",
      "Our work is shaped by listening, collaboration, and practical support that remains valuable after the campaign, event, or photo."
    ),
    cards: [
      {
        id: randomUUID(),
        subject: "Listen first",
        kicker: "",
        description:
          "We begin with people, families, and local realities so support is useful from the start.",
        order: 0,
        published: true,
      },
      {
        id: randomUUID(),
        subject: "Build steadily",
        kicker: "",
        description:
          "We favor consistent programs, education, and skills over one-off moments of attention.",
        order: 1,
        published: true,
      },
      {
        id: randomUUID(),
        subject: "Partner well",
        kicker: "",
        description:
          "We work with volunteers, donors, and community leaders to make care go further.",
        order: 2,
        published: true,
      },
    ],
    closingText:
      "The goal is not just to respond to need, but to strengthen the systems of care around each person and community we serve.",
    ctas: [cta("Start a partnership", "/contact")],
  },
  volunteers: {
    intro: intro(
      "Volunteer movement",
      "The hands that help care reach further.",
      "Our volunteers bring time, skill, logistics, encouragement, and presence to the work. They help turn planning into real support for families and communities."
    ),
    ctaHeading: "Your time and skills can help make support feel personal.",
    ctas: [cta("Volunteer with us", "/contact")],
  },
  impact: {
    intro: intro(
      "Impact proof",
      "The numbers matter because people do.",
      "Our impact is measured through real support: outreach delivered, volunteers mobilized, meals shared, and communities strengthened through steady care."
    ),
    youtubeUrl: "https://youtu.be/CEzKcqI9X6E?si=hmtLsFor7P5KMa06",
    stats: [],
    ctas: [cta("See our work", "/about")],
  },
  testimonials: {
    intro: intro(
      "Testimonials",
      "Trusted by the people closest to the work.",
      ""
    ),
    limit: 6,
    ctas: [],
  },
  featuredBlogs: {
    intro: intro("Latest stories", "Stories from the work we are doing.", ""),
    limit: 4,
    heroBackgroundColor: "#173f35",
    ctas: [cta("View all stories", "/blogs")],
  },
  featuredEvents: {
    intro: intro(
      "Upcoming events",
      "Join the moments that move the mission.",
      ""
    ),
    limit: 3,
    ctas: [cta("View all events", "/events")],
  },
  faqs: {
    intro: intro(
      "FAQs",
      "Helpful answers before you reach out",
      "A quick guide to support, partnerships, programs, and the work we do with communities."
    ),
    items: [],
    ctas: [],
  },
});
