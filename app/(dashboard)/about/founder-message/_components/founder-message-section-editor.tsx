"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateAboutFoundersMessageAction } from "@/lib/actions/pages/about";
import { showActionResult, uploadLandingImage } from "@/lib/pages/landing";
import {
  ImagePicker,
  SaveButton,
  TextareaField,
} from "@/components/common/form-controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SectionCopyCard } from "@/components/common/section-copy-card";
import { AboutCtaButtonsManager } from "../../_components/about-cta-buttons-manager";
import { AboutSectionShell } from "../../_components/about-section-shell";

export function FounderMessageSectionEditor({
  section,
}: {
  section: AboutFoundersMessageSectionContent;
}) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    quote: section.quote,
    body: section.body,
    image: section.image || "",
  });
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = () => {
    startTransition(() => {
      updateAboutFoundersMessageAction(formData)
        .then(showActionResult("Founder message saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <AboutSectionShell section="foundersMessage">
      <SectionCopyCard
        title="Founder message intro"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <ImagePicker
          label="Optional founder image override"
          value={formData.image || ""}
          inputRef={imageRef}
          onUpload={(event) =>
            uploadLandingImage(event, (image) =>
              setFormData((prev) => ({ ...prev, image }))
            )
          }
        />
      </SectionCopyCard>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Founder quote and body</CardTitle>
            <CardDescription>
              The message shown beside the founder profile image.
            </CardDescription>
          </div>
          <SaveButton onClick={onSubmit} pending={isPending} />
        </CardHeader>
        <CardContent className="grid gap-4">
          <TextareaField
            label="Quote"
            value={formData.quote}
            maxLength={220}
            onChange={(quote) => setFormData((prev) => ({ ...prev, quote }))}
          />
          <TextareaField
            label="Message body"
            value={formData.body}
            maxLength={900}
            onChange={(body) => setFormData((prev) => ({ ...prev, body }))}
          />
        </CardContent>
      </Card>

      <AboutCtaButtonsManager section="foundersMessage" items={section.ctas} />
    </AboutSectionShell>
  );
}
