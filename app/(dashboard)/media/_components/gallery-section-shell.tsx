import type { ReactNode } from "react";

const sectionMeta: Record<
  GallerySection,
  {
    eyebrow: string;
    title: string;
    description: string;
    accent: string;
  }
> = {
  hero: {
    eyebrow: "Gallery opening",
    title: "Gallery Hero Section",
    description: "Control the gallery page heading, copy, and two hero images.",
    accent: "from-emerald-700 to-slate-950",
  },
  archive: {
    eyebrow: "Gallery archive",
    title: "Gallery Archive Section",
    description: "Control the intro text shown above the media archive.",
    accent: "from-orange-400 to-rose-600",
  },
};

export function GallerySectionShell({
  section,
  children,
}: {
  section: GallerySection;
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
