"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateLandingVolunteersAction } from "@/lib/actions/pages/landing/volunteers.actions";
import { showActionResult } from "@/lib/utils/pages";
import { ResourcePanel } from "@/components/common/resource-panel";
import { SectionCopyCard } from "@/components/common/section-copy-card";
import { SaveButton, TextareaField } from "@/components/common/form-controls";
import { CtaButtonsManager } from "@/components/common/cta-buttons-manager";

import { LandingSectionShell } from "../../_components/landing-section-shell";

export function VolunteersSectionEditor({
  section,
  volunteers,
}: {
  section: VolunteersSectionContent;
  volunteers: Volunteer[];
}) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    ctaHeading: section.ctaHeading || "",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingVolunteersAction(formData)
        .then(showActionResult("Volunteers section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <LandingSectionShell section="volunteers">
      <SectionCopyCard
        title="Volunteer section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <TextareaField
          label="CTA heading"
          value={formData.ctaHeading || ""}
          maxLength={150}
          onChange={(ctaHeading) =>
            setFormData((prev) => ({ ...prev, ctaHeading }))
          }
        />
      </SectionCopyCard>
      <CtaButtonsManager section="volunteers" items={section.ctas} />
      <ResourcePanel
        title="Volunteer roster"
        description={`${volunteers.length} volunteers available for this section.`}
        href="/volunteers"
        label="Manage volunteers"
      />
    </LandingSectionShell>
  );
}
