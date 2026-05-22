import type { ReactNode } from "react";

const sectionMeta: Record<
  LandingSection,
  {
    eyebrow: string;
    title: string;
    description: string;
    accent: string;
  }
> = {
  hero: {
    eyebrow: "First impression",
    title: "Hero Section",
    description: "Control the opening headline, supporting line, and image.",
    accent: "from-emerald-500 to-teal-700",
  },
  about: {
    eyebrow: "Mission snapshot",
    title: "Who We Are Section",
    description: "Manage the intro, theme photo, and three reveal cards.",
    accent: "from-orange-400 to-rose-500",
  },
  values: {
    eyebrow: "How change happens",
    title: "Values Section",
    description: "Shape the principle cards and final partnership callout.",
    accent: "from-slate-800 to-slate-950",
  },
  volunteers: {
    eyebrow: "Volunteer movement",
    title: "Volunteers Section",
    description: "Edit the volunteer section copy and call-to-action.",
    accent: "from-green-500 to-emerald-800",
  },
  impact: {
    eyebrow: "Impact proof",
    title: "Impact Section",
    description: "Manage the stats and video that prove the work.",
    accent: "from-yellow-400 to-orange-500",
  },
  testimonials: {
    eyebrow: "Community voices",
    title: "Testimonials Section",
    description: "Edit the section copy and testimonial roster.",
    accent: "from-indigo-500 to-violet-700",
  },
  featuredBlogs: {
    eyebrow: "Latest stories",
    title: "Featured Blogs Section",
    description: "Edit featured blog section copy and display settings.",
    accent: "from-cyan-500 to-blue-700",
  },
  featuredEvents: {
    eyebrow: "Upcoming moments",
    title: "Featured Events Section",
    description: "Edit featured events section copy and display settings.",
    accent: "from-lime-500 to-green-700",
  },
  faqs: {
    eyebrow: "Helpful answers",
    title: "FAQ Section",
    description: "Manage FAQ intro copy and ordered questions.",
    accent: "from-pink-400 to-orange-500",
  },
};

export function LandingSectionShell({
  section,
  children,
}: {
  section: LandingSection;
  children: ReactNode;
}) {
  const meta = sectionMeta[section];

  return (
    <div className="grid gap-5">
      <div
        className={`overflow-hidden rounded-xl bg-gradient-to-br ${meta.accent} p-6 text-white shadow-sm`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
          {meta.eyebrow}
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
          {meta.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
          {meta.description}
        </p>
      </div>

      {children}
    </div>
  );
}
