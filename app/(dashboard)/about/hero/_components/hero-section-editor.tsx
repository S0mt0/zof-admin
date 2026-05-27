"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateAboutHeroAction } from "@/lib/actions/pages/about";
import { showActionResult, uploadSectionImage } from "@/lib/utils/pages";
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

import { AboutSectionShell } from "../../_components/about-section-shell";
import { BackgroundColorPicker } from "@/components/common/background-color-picker";
import { Separator } from "@/components/ui/separator";

export function HeroSectionEditor({
  section,
}: {
  section: AboutHeroSectionContent;
}) {
  const [formData, setFormData] = useState({
    ...section,
    image: section.image || "",
    calloutTitle: section.calloutTitle || "",
    calloutText: section.calloutText || "",
    heroBackgroundColor: section.heroBackgroundColor || "#F8F9F7",
    calloutBackgroundColor: section.calloutBackgroundColor || "#224CA0",
  });
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = () => {
    startTransition(() => {
      updateAboutHeroAction(formData)
        .then(showActionResult("Hero saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <AboutSectionShell section="hero">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Hero copy</CardTitle>
          <CardDescription>
            The small theme title, main heading, and paragraph shown on the
            frontend.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid items-start gap-x-6 gap-y-20 lg:grid-cols-[1fr_0.8fr]">
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
            {/* Mission and vission */}
            <Separator className="mt-8" />
            <CardTitle className="my-4">Mission and vission</CardTitle>

            <TextareaField
              label="Mission"
              value={formData.mission}
              maxLength={260}
              onChange={(mission) =>
                setFormData((prev) => ({ ...prev, mission }))
              }
            />
            <TextareaField
              label="Vision"
              value={formData.vision}
              maxLength={260}
              onChange={(vision) =>
                setFormData((prev) => ({ ...prev, vision }))
              }
            />

            <Separator className="mt-8" />

            {/* Background color picker */}
            <BackgroundColorPicker
              value={formData.heroBackgroundColor}
              onChange={(heroBackgroundColor) =>
                setFormData((prev) => ({ ...prev, heroBackgroundColor }))
              }
              label="Hero background color"
              className="mt-4"
            />
          </div>

          <div className="grid content-start gap-4">
            <Separator className="my-8 md:hidden" />
            <ImagePicker
              label="Hero image"
              value={formData.image || ""}
              inputRef={imageRef}
              onUpload={(event) =>
                uploadSectionImage(event, (image) =>
                  setFormData((prev) => ({ ...prev, image }))
                )
              }
            />
            <CardTitle className="my-4">Hero Image Callout</CardTitle>
            <TextField
              label="Callout title"
              value={formData.calloutTitle || ""}
              maxLength={90}
              onChange={(calloutTitle) =>
                setFormData((prev) => ({ ...prev, calloutTitle }))
              }
            />
            <TextareaField
              label="Callout text"
              value={formData.calloutText || ""}
              maxLength={180}
              onChange={(calloutText) =>
                setFormData((prev) => ({ ...prev, calloutText }))
              }
            />

            {/* Hero image callout background color picker */}
            <Separator className="mt-8" />
            <BackgroundColorPicker
              value={formData.calloutBackgroundColor}
              onChange={(calloutBackgroundColor) =>
                setFormData((prev) => ({ ...prev, calloutBackgroundColor }))
              }
              label="Hero image callout background color"
              className="mt-4"
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
