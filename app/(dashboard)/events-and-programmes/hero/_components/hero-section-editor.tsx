"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateEventsHeroAction } from "@/lib/actions/pages/events";
import { showActionResult } from "@/lib/utils/pages";
import {
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

import { BackgroundColorPicker } from "@/components/common/background-color-picker";
import { Separator } from "@/components/ui/separator";
import { EventsSectionShell } from "../../_components/events-section-shell";
import { ResourcePanel } from "@/components/common/resource-panel";

export function HeroSectionEditor({
  section,
}: {
  section: EventsHeroSectionContent;
}) {
  const [formData, setFormData] = useState({
    ...section,
    heroBackgroundColor: section.heroBackgroundColor || "#183F35",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateEventsHeroAction(formData)
        .then(showActionResult("Hero saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <EventsSectionShell section="hero">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Hero copy</CardTitle>
          <CardDescription>
            The small theme title, main heading, and paragraph shown on the
            frontend.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid items-start gap-x-6 gap-y-10 lg:grid-cols-[1fr_0.8fr]">
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
          <Separator className="lg:hidden" />
          {/* Background color picker */}
          <BackgroundColorPicker
            value={formData.heroBackgroundColor}
            onChange={(heroBackgroundColor) =>
              setFormData((prev) => ({ ...prev, heroBackgroundColor }))
            }
            label="Hero background color"
          />
        </CardContent>

        <CardFooter className="justify-end border-t bg-muted/20 px-6 py-4">
          <SaveButton onClick={onSubmit} pending={isPending} />
        </CardFooter>
      </Card>

      <ResourcePanel
        title="Events and articles"
        description={"You can manage events and articles here."}
        href="/events-and-articles/manage"
        label="Manage events"
      />
    </EventsSectionShell>
  );
}
