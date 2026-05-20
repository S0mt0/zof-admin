interface AboutPageContent {
  id: string;
  aboutUs: string;
  vision: string;
  mission: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LandingFaq {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface LandingTestimonial {
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

interface LandingStat {
  id: string;
  value: string;
  title: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface LandingExtraContent {
  id: string;
  heroImage?: string | null;
  themeVideo?: string | null;
  themeVideoPoster?: string | null;
  themeVideoFile?: string | null;
  aboutImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
