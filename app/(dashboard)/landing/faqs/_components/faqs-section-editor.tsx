"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateLandingFaqSectionAction } from "@/lib/actions/pages/landing/faq-section.actions";
import { showActionResult } from "@/lib/pages/landing";
import { SaveButton } from "@/components/common/form-controls";

import { FaqItemsManager } from "./faq-items-manager";
import { CtaButtonsManager } from "../../_components/landing-cta-buttons-manager";
import { LandingSectionShell } from "../../_components/landing-section-shell";
import { SectionCopyCard } from "@/components/common/section-copy-card";

export function FaqsSectionEditor({ section }: { section: FaqSectionContent }) {
  const [formData, setFormData] = useState({ intro: section.intro });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingFaqSectionAction(formData)
        .then(showActionResult("FAQ section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <LandingSectionShell section="faqs">
      <SectionCopyCard
        title="FAQ section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData({ intro })}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      />
      <CtaButtonsManager section="faqs" items={section.ctas} />
      <FaqItemsManager items={section.items} />
    </LandingSectionShell>
  );
}
