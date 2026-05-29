import type { ReactNode } from "react";

const sectionMeta: Record<DonationSection, { eyebrow: string; title: string; description: string; accent: string }> = {
  aside: {
    eyebrow: "Donation page copy",
    title: "Donation Aside",
    description: "Edit the copy shown beside the donation form on the website.",
    accent: "from-emerald-500 to-teal-700",
  },
};

export function DonationsSectionShell({ section, children }: { section: DonationSection; children: ReactNode }) {
  const meta = sectionMeta[section];
  return (
    <div className="grid min-w-0 gap-5 overflow-hidden">
      <div className={`min-w-0 overflow-hidden rounded-xl bg-gradient-to-br ${meta.accent} p-6 text-white shadow-sm`}>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">{meta.eyebrow}</p>
        <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{meta.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">{meta.description}</p>
      </div>
      {children}
    </div>
  );
}
