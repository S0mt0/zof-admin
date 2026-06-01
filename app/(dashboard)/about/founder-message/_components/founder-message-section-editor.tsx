"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateAboutFoundersMessageAction } from "@/lib/actions/pages/about";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { SectionCopyCard } from "@/components/common/section-copy-card";
import { AboutCtaButtonsManager } from "../../cta/_components/about-cta-buttons-manager";
import { AboutSectionShell } from "../../_components/about-section-shell";

export function FounderMessageSectionEditor({
  section,
}: {
  section: AboutFoundersMessageSectionContent;
}) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    founder: {
      name: section.founder.name || "",
      role: section.founder.role || "",
      image: section.founder.image || "",
      quote: section.founder.quote,
      body: section.founder.body,
    },
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
          value={formData.founder.image || ""}
          inputRef={imageRef}
          onUpload={(event) =>
            uploadSectionImage(event, (image) =>
              setFormData((prev) => ({ ...prev, founder: { ...prev.founder, image } }))
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
        <CardContent className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Founder name"
            value={formData.founder.name}
            maxLength={80}
            onChange={(name) =>
              setFormData((prev) => ({
                ...prev,
                founder: { ...prev.founder, name },
              }))
            }
          />
          <TextField
            label="Founder role"
            value={formData.founder.role}
            maxLength={100}
            onChange={(role) =>
              setFormData((prev) => ({
                ...prev,
                founder: { ...prev.founder, role },
              }))
            }
          />
          <div className="md:col-span-2">
            <TextareaField
              label="Quote"
              value={formData.founder.quote}
              maxLength={220}
              onChange={(quote) =>
                setFormData((prev) => ({
                  ...prev,
                  founder: { ...prev.founder, quote },
                }))
              }
            />
          </div>
          <div className="md:col-span-2">
            <TextareaField
              label="Message body"
              value={formData.founder.body}
              maxLength={900}
              onChange={(body) =>
                setFormData((prev) => ({
                  ...prev,
                  founder: { ...prev.founder, body },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <AboutCtaButtonsManager section="foundersMessage" items={section.ctas} />
    </AboutSectionShell>
  );
}
