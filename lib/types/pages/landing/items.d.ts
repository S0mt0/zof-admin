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
