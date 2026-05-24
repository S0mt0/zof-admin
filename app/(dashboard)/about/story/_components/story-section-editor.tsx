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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { SectionCopyCard } from "@/components/common/section-copy-card";
import { AboutSectionShell } from "../../_components/about-section-shell";

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
    trustPoints: section.trustPoints || [],
  });
  const [trustPoint, setTrustPoint] = useState("");
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = () => {
    startTransition(() => {
      updateAboutStoryAction(formData)
        .then(showActionResult("Story saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const addTrustPoint = () => {
    const value = trustPoint.trim();
    if (!value || formData.trustPoints.includes(value)) return;
    setFormData((prev) => ({
      ...prev,
      trustPoints: [...prev.trustPoints, value],
    }));
    setTrustPoint("");
  };

  const removeTrustPoint = (point: string) => {
    setFormData((prev) => ({
      ...prev,
      trustPoints: prev.trustPoints.filter((item) => item !== point),
    }));
  };

  return (
    <AboutSectionShell section="story">
      <SectionCopyCard
        title="Story section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
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
      </SectionCopyCard>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Story body and details</CardTitle>
            <CardDescription>
              Edit the paragraph, image caption, and trust points.
            </CardDescription>
          </div>
          <SaveButton onClick={onSubmit} pending={isPending} />
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <TextareaField
            label="Story body"
            value={formData.body}
            maxLength={600}
            onChange={(body) => setFormData((prev) => ({ ...prev, body }))}
          />
          <div className="grid content-start gap-4">
            <TextField
              label="Caption title"
              value={formData.captionTitle || ""}
              maxLength={48}
              onChange={(captionTitle) =>
                setFormData((prev) => ({ ...prev, captionTitle }))
              }
            />
            <TextareaField
              label="Caption text"
              value={formData.captionText || ""}
              maxLength={180}
              onChange={(captionText) =>
                setFormData((prev) => ({ ...prev, captionText }))
              }
            />
            <div className="grid gap-2">
              <label className="text-sm font-medium">Trust points</label>
              <div className="flex gap-2">
                <Input
                  value={trustPoint}
                  onChange={(event) => setTrustPoint(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTrustPoint();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTrustPoint}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.trustPoints.map((point) => (
                  <button
                    key={point}
                    type="button"
                    onClick={() => removeTrustPoint(point)}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    {point} ×
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AboutSectionShell>
  );
}
