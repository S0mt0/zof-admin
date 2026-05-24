"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateLandingTestimonialsSectionAction } from "@/lib/actions/pages/landing/testimonials-section.actions";
import { showActionResult } from "@/lib/pages/landing";
import { SaveButton, TextField } from "@/components/common/form-controls";

import { LandingSectionShell } from "../../_components/landing-section-shell";
import { CtaButtonsManager } from "../../_components/landing-cta-buttons-manager";
import { SectionCopyCard } from "@/components/common/section-copy-card";
import { TestimonialsManager } from "./testimonials-manager";

export function TestimonialsSectionEditor({
  section,
  testimonials,
}: {
  section: TestimonialsSectionContent;
  testimonials: Testimonial[];
}) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    limit: section.limit,
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingTestimonialsSectionAction(formData)
        .then(showActionResult("Testimonials section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <LandingSectionShell section="testimonials">
      <SectionCopyCard
        title="Testimonials section copy"
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
      <CtaButtonsManager section="testimonials" items={section.ctas} />
      <TestimonialsManager items={testimonials} />
    </LandingSectionShell>
  );
}
