"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateLandingValuesAction } from "@/lib/actions/pages/landing/values.actions";
import { showActionResult } from "@/lib/pages/landing";
import { SaveButton, TextareaField } from "@/components/common/form-controls";

import { CardsManager } from "../../_components/cards-manager";
import { CtaButtonsManager } from "@/components/common/cta-buttons-manager";
import { LandingSectionShell } from "../../_components/landing-section-shell";
import { SectionCopyCard } from "@/components/common/section-copy-card";

export function ValuesSectionEditor({
  section,
}: {
  section: ValuesSectionContent;
}) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    closingText: section.closingText || "",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingValuesAction(formData)
        .then(showActionResult("Values section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <LandingSectionShell section="values">
      <SectionCopyCard
        title="Values section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <TextareaField
          label="Closing note"
          value={formData.closingText}
          maxLength={220}
          onChange={(closingText) =>
            setFormData((prev) => ({ ...prev, closingText }))
          }
        />
      </SectionCopyCard>
      <CtaButtonsManager section="values" items={section.ctas} />
      <CardsManager
        section="values"
        title="Principle cards"
        description="Drag to arrange. Only 3 cards can be published at once."
        items={section.cards}
      />
    </LandingSectionShell>
  );
}
