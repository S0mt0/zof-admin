"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { showActionResult } from "@/lib/pages/landing";
import { SaveButton, TextField } from "@/components/common/form-controls";

import { ResourcePanel } from "./resource-panel";
import { CtaButtonsManager } from "./landing-cta-buttons-manager";
import { SectionCopyCard } from "../../../../components/common/section-copy-card";

export function FeaturedContentEditor({
  type,
  section,
  action,
}: {
  type: "blogs" | "events";
  section: FeaturedContentSectionContent;
  action: (
    values: Omit<FeaturedContentSectionContent, "ctas">
  ) => Promise<{ error?: string; success?: string }>;
}) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    limit: section.limit,
  });
  const [isPending, startTransition] = useTransition();
  const href = type === "blogs" ? "/blogs" : "/events";
  const sectionKey = type === "blogs" ? "featuredBlogs" : "featuredEvents";

  const onSubmit = () => {
    startTransition(() => {
      action(formData)
        .then(showActionResult("Featured section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="grid gap-5">
      <SectionCopyCard
        title={`Featured ${type} copy`}
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <TextField
          label="Display limit"
          type="number"
          value={String(formData.limit)}
          onChange={(limit) =>
            setFormData((prev) => ({ ...prev, limit: Number(limit) }))
          }
        />
      </SectionCopyCard>
      <CtaButtonsManager section={sectionKey} items={section.ctas} />
      <ResourcePanel
        title={`Featured ${type}`}
        description={`Featured ${type} come from the published ${type} collection.`}
        href={href}
        label={`Manage ${type}`}
      />
    </div>
  );
}
