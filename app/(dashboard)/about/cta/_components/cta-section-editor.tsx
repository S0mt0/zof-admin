"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateAboutCtaAction } from "@/lib/actions/pages/about";
import { showActionResult, uploadLandingImage } from "@/lib/pages/landing";
import { ImagePicker, SaveButton } from "@/components/common/form-controls";

import { SectionCopyCard } from "@/components/common/section-copy-card";
import { AboutCtaButtonsManager } from "./about-cta-buttons-manager";
import { AboutSectionShell } from "../../_components/about-section-shell";

export function CtaSectionEditor({
  section,
}: {
  section: AboutCtaSectionContent;
}) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    backgroundImage: section.backgroundImage || "",
  });
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = () => {
    startTransition(() => {
      updateAboutCtaAction(formData)
        .then(showActionResult("CTA section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <AboutSectionShell section="cta">
      <SectionCopyCard
        title="CTA section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <ImagePicker
          label="Background image"
          value={formData.backgroundImage || ""}
          inputRef={imageRef}
          onUpload={(event) =>
            uploadLandingImage(event, (backgroundImage) =>
              setFormData((prev) => ({ ...prev, backgroundImage }))
            )
          }
        />
      </SectionCopyCard>
      <AboutCtaButtonsManager section="cta" items={section.ctas} />
    </AboutSectionShell>
  );
}
