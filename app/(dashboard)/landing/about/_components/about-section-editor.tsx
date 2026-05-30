"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateLandingAboutAction } from "@/lib/actions/pages/landing/about-section.actions";
import { showActionResult, uploadSectionImage } from "@/lib/utils/pages";
import { ImagePicker, SaveButton } from "@/components/common/form-controls";

import { CardsManager } from "../../_components/cards-manager";
import { LandingSectionShell } from "../../_components/landing-section-shell";
import { LandingCtaButtonsManager } from "../../_components/landing-cta-buttons-manager";
import { SectionCopyCard } from "@/components/common/section-copy-card";

export function AboutSectionEditor({
  section,
}: {
  section: AboutSectionContent;
}) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    themePhoto: section.themePhoto || "",
  });
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = () => {
    startTransition(() => {
      updateLandingAboutAction(formData)
        .then(showActionResult("About section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <LandingSectionShell section="about">
      <SectionCopyCard
        title="Who We Are copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={
          <SaveButton
            onClick={onSubmit}
            pending={isPending}
            label="Save About"
          />
        }
      >
        <ImagePicker
          label="Theme photo"
          value={formData.themePhoto}
          inputRef={imageRef}
          onUpload={(event) =>
            uploadSectionImage(event, (url) =>
              setFormData((prev) => ({ ...prev, themePhoto: url }))
            )
          }
        />
      </SectionCopyCard>
      <LandingCtaButtonsManager section="about" items={section.ctas} />
      <CardsManager
        section="about"
        title="Reveal cards"
        description="Drag to arrange. Only 3 cards can be published at once."
        items={section.cards}
      />
    </LandingSectionShell>
  );
}
