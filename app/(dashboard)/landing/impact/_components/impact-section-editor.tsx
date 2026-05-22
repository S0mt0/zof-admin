"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateLandingImpactAction } from "@/lib/actions/pages/landing/impact-section.actions";
import { showActionResult } from "@/lib/pages/landing";
import { SaveButton, TextField } from "@/components/common/form-controls";

import { LandingSectionShell } from "../../_components/landing-section-shell";
import { SectionCopyCard } from "../../_components/section-copy-card";
import { StatsManager } from "./stats-manager";

export function ImpactSectionEditor({
  section,
}: {
  section: ImpactSectionContent;
}) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    youtubeUrl: section.youtubeUrl || "",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingImpactAction(formData)
        .then(showActionResult("Impact section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <LandingSectionShell section="impact">
      <SectionCopyCard
        title="Impact section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <TextField
          label="YouTube URL"
          value={formData.youtubeUrl}
          onChange={(youtubeUrl) =>
            setFormData((prev) => ({ ...prev, youtubeUrl }))
          }
        />
      </SectionCopyCard>
      <StatsManager items={section.stats} />
    </LandingSectionShell>
  );
}
