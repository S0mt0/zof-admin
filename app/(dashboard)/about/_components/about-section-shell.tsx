import type { ReactNode } from "react";

const sectionMeta: Record<
  AboutSection,
  {
    eyebrow: string;
    title: string;
    description: string;
    accent: string;
  }
> = {
  hero: {
    eyebrow: "First impression",
    title: "About Hero Section",
    description: "Control the opening copy, mission, vision, and hero image.",
    accent: "from-emerald-500 to-teal-700",
  },
  story: {
    eyebrow: "Foundation story",
    title: "Story Section",
    description: "Manage the main story copy, supporting image, and trust points.",
    accent: "from-orange-400 to-rose-500",
  },
  team: {
    eyebrow: "People",
    title: "Team Section",
    description: "Edit the copy above the team member grid.",
    accent: "from-cyan-500 to-blue-700",
  },
  foundersMessage: {
    eyebrow: "Founder voice",
    title: "Founder Message Section",
    description: "Shape the founder quote, message, image, and CTA.",
    accent: "from-slate-800 to-slate-950",
  },
  cta: {
    eyebrow: "Final action",
    title: "About CTA Section",
    description: "Manage the closing call-to-action copy, image, and buttons.",
    accent: "from-green-500 to-emerald-800",
  },
};

export function AboutSectionShell({
  section,
  children,
}: {
  section: AboutSection;
  children: ReactNode;
}) {
  const meta = sectionMeta[section];

  return (
    <div className="grid min-w-0 gap-5 overflow-hidden">
      <div
        className={`min-w-0 overflow-hidden rounded-xl bg-gradient-to-br ${meta.accent} p-6 text-white shadow-sm`}
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
