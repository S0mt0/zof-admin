"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { toast } from "sonner";

import { BackgroundColorPicker } from "@/components/common/background-color-picker";
import {
  ImagePicker,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { ResourcePanel } from "@/components/common/resource-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateGalleryHeroAction } from "@/lib/actions/pages/gallery";
import { showActionResult, uploadSectionImage } from "@/lib/utils/pages";

import { GallerySectionShell } from "../../_components/gallery-section-shell";

export function HeroSectionEditor({
  section,
}: {
  section: GalleryHeroSectionContent;
}) {
  const [formData, setFormData] = useState({
    ...section,
    heroBackgroundColor: section.heroBackgroundColor || "#fbfcf8",
    primaryImage: section.primaryImage || "",
    secondaryImage: section.secondaryImage || "",
  });
  const [isPending, startTransition] = useTransition();
  const primaryImageRef = useRef<HTMLInputElement | null>(null);
  const secondaryImageRef = useRef<HTMLInputElement | null>(null);

  const onPrimaryImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    uploadSectionImage(event, (primaryImage) =>
      setFormData((prev) => ({ ...prev, primaryImage }))
    );
  };

  const onSecondaryImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    uploadSectionImage(event, (secondaryImage) =>
      setFormData((prev) => ({ ...prev, secondaryImage }))
    );
  };

  const onSubmit = () => {
    startTransition(() => {
      updateGalleryHeroAction(formData)
        .then(showActionResult("Hero saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <GallerySectionShell section="hero">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Hero copy and visuals</CardTitle>
          <CardDescription>
            Set the opening copy and the two images used on the public gallery hero.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid items-start gap-x-6 gap-y-8 lg:grid-cols-[1fr_0.82fr]">
          <div className="grid content-start gap-4">
            <TextField
              label="Small theme title"
              value={formData.intro.eyebrow || ""}
              onChange={(eyebrow) =>
                setFormData((prev) => ({
                  ...prev,
                  intro: { ...prev.intro, eyebrow },
                }))
              }
            />
            <TextField
              label="Heading"
              value={formData.intro.heading || ""}
              maxLength={120}
              onChange={(heading) =>
                setFormData((prev) => ({
                  ...prev,
                  intro: { ...prev.intro, heading },
                }))
              }
            />
            <TextareaField
              label="Description"
              value={formData.intro.description || ""}
              maxLength={280}
              onChange={(description) =>
                setFormData((prev) => ({
                  ...prev,
                  intro: { ...prev.intro, description },
                }))
              }
            />
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <ImagePicker
                label="First hero image"
                value={formData.primaryImage || ""}
                inputRef={primaryImageRef}
                onUpload={onPrimaryImageUpload}
              />
              <ImagePicker
                label="Second hero image"
                value={formData.secondaryImage || ""}
                inputRef={secondaryImageRef}
                onUpload={onSecondaryImageUpload}
              />
            </div>
            <Separator />
            <BackgroundColorPicker
              value={formData.heroBackgroundColor}
              onChange={(heroBackgroundColor) =>
                setFormData((prev) => ({ ...prev, heroBackgroundColor }))
              }
              label="Hero background color"
            />
          </div>
        </CardContent>

        <CardFooter className="justify-end border-t bg-muted/20 px-6 py-4">
          <SaveButton onClick={onSubmit} pending={isPending} />
        </CardFooter>
      </Card>

      <ResourcePanel
        title="Media library"
        description="Manage uploaded photos, uploaded videos, and YouTube video links."
        href="/media/manage"
        label="Manage media"
      />
    </GallerySectionShell>
  );
}
