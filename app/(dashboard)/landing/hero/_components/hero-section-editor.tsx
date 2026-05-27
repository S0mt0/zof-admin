"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateLandingHeroAction } from "@/lib/actions/pages/landing/hero.actions";
import { showActionResult, uploadSectionImage } from "@/lib/utils/pages";

import {
  ImagePicker,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { CtaButtonsManager } from "@/components/common/cta-buttons-manager";
import { LandingSectionShell } from "../../_components/landing-section-shell";

export function HeroSectionEditor({ hero }: { hero: HeroSectionContent }) {
  const [formData, setFormData] = useState({
    ...hero,
    image: hero.image || "",
  });
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement | null>(null);

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    uploadSectionImage(event, (url) =>
      setFormData((prev) => ({ ...prev, image: url }))
    );
  };

  const onSubmit = () => {
    startTransition(() => {
      updateLandingHeroAction(formData)
        .then(showActionResult("Hero saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <LandingSectionShell section="hero">
      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <CardTitle>Hero copy and image</CardTitle>
            <CardDescription>
              This is the first message visitors see on the landing page.
            </CardDescription>
          </div>
          <SaveButton onClick={onSubmit} pending={isPending} />
        </CardHeader>
        <CardContent className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
          <div className="grid min-w-0 content-start gap-4">
            <TextField
              label="Hero title"
              value={formData.title}
              maxLength={120}
              onChange={(title) => setFormData((prev) => ({ ...prev, title }))}
            />
            <TextareaField
              label="Hero subtitle"
              value={formData.subtitle}
              maxLength={260}
              onChange={(subtitle) =>
                setFormData((prev) => ({ ...prev, subtitle }))
              }
            />
          </div>
          <ImagePicker
            label="Hero image"
            value={formData.image || ""}
            inputRef={imageRef}
            onUpload={onUpload}
          />
        </CardContent>
      </Card>
      <CtaButtonsManager section="hero" items={hero.ctas} />
    </LandingSectionShell>
  );
}
