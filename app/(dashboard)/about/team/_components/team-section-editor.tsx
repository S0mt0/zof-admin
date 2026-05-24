"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateAboutTeamAction } from "@/lib/actions/pages/about";
import { showActionResult } from "@/lib/pages/landing";
import { SaveButton } from "@/components/common/form-controls";

import { SectionCopyCard } from "@/components/common/section-copy-card";
import { AboutSectionShell } from "../../_components/about-section-shell";

export function TeamSectionEditor({
  section,
}: {
  section: AboutTeamSectionContent;
}) {
  const [formData, setFormData] = useState(section);
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateAboutTeamAction(formData)
        .then(showActionResult("Team section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <AboutSectionShell section="team">
      <SectionCopyCard
        title="Team section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      />
    </AboutSectionShell>
  );
}
