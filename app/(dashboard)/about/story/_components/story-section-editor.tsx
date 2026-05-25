"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateAboutStoryAction } from "@/lib/actions/pages/about";
import { showActionResult, uploadLandingImage } from "@/lib/pages/landing";
import {
  ImagePicker,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AboutSectionShell } from "../../_components/about-section-shell";
import { AboutTrustPointsManager } from "./about-trust-points-manager";

export function StorySectionEditor({
  section,
}: {
  section: AboutStorySectionContent;
}) {
  const [formData, setFormData] = useState({
    ...section,
    image: section.image || "",
    captionTitle: section.captionTitle || "",
    captionText: section.captionText || "",
    body: section.body || "",
  });
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const trustPoints = section.trustPoints || [];

  const onSubmit = () => {
    startTransition(() => {
      updateAboutStoryAction(formData)
        .then(showActionResult("Story saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <AboutSectionShell section="story">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Story section</CardTitle>
          <CardDescription>Edit the story, image, and caption.</CardDescription>
        </CardHeader>
        <CardContent className="grid items-start gap-x-6 gap-y-20 lg:grid-cols-[1fr_0.8fr]">
          {/* Left column: Story body and trust points */}
          <div className="grid content-start gap-4">
            <TextField
              label="Heading"
              value={formData.intro?.heading || ""}
              maxLength={120}
              onChange={(heading) =>
                setFormData((prev) => ({
                  ...prev,
                  intro: { ...prev.intro, heading },
                }))
              }
            />
            <TextareaField
              label="Story"
              value={formData.body}
              maxLength={600}
              onChange={(body) => setFormData((prev) => ({ ...prev, body }))}
            />

            <AboutTrustPointsManager items={trustPoints} />
          </div>

          {/* Right column: Image and captions */}
          <div className="grid content-start gap-4">
            <Separator className="my-8 md:hidden" />
            <ImagePicker
              label="Story image"
              value={formData.image || ""}
              inputRef={imageRef}
              onUpload={(event) =>
                uploadLandingImage(event, (image) =>
                  setFormData((prev) => ({ ...prev, image }))
                )
              }
            />
            <TextField
              label="Image caption title"
              value={formData.captionTitle || ""}
              maxLength={48}
              onChange={(captionTitle) =>
                setFormData((prev) => ({ ...prev, captionTitle }))
              }
            />
            <TextareaField
              label="Image caption text"
              value={formData.captionText || ""}
              maxLength={180}
              onChange={(captionText) =>
                setFormData((prev) => ({ ...prev, captionText }))
              }
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t bg-muted/20 px-6 py-4">
          <SaveButton onClick={onSubmit} pending={isPending} />
        </CardFooter>
      </Card>
    </AboutSectionShell>
  );
}
