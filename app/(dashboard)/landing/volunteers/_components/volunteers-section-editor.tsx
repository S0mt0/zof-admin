"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { updateLandingVolunteersAction } from "@/lib/actions/pages/landing/volunteers.actions";
import { showActionResult } from "@/lib/pages/landing";

import {
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";

import { LandingSectionShell } from "../../_components/landing-section-shell";
import { ResourcePanel } from "../../_components/resource-panel";
import { SectionCopyCard } from "../../_components/section-copy-card";

export function VolunteersSectionEditor({
  section,
  volunteers,
}: {
  section: VolunteersSectionContent;
  volunteers: Volunteer[];
}) {
  const [formData, setFormData] = useState({
    ...section,
    featuredVolunteerId: section.featuredVolunteerId || "",
    ctaHeading: section.ctaHeading || "",
    ctaLabel: section.ctaLabel || "",
    ctaHref: section.ctaHref || "",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingVolunteersAction(formData)
        .then(showActionResult("Volunteers section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <LandingSectionShell section="volunteers">
      <SectionCopyCard
        title="Volunteer section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <div className="grid content-start gap-2">
          <Label>Featured volunteer</Label>
          <select
            value={formData.featuredVolunteerId || ""}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                featuredVolunteerId: event.target.value,
              }))
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Use first available volunteer</option>
            {volunteers.map((volunteer) => (
              <option key={volunteer.id} value={volunteer.id}>
                {volunteer.name} - {volunteer.volunteerType}
              </option>
            ))}
          </select>
        </div>
        <TextareaField
          label="CTA heading"
          value={formData.ctaHeading || ""}
          maxLength={150}
          onChange={(ctaHeading) =>
            setFormData((prev) => ({ ...prev, ctaHeading }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="CTA label"
            value={formData.ctaLabel || ""}
            onChange={(ctaLabel) =>
              setFormData((prev) => ({ ...prev, ctaLabel }))
            }
          />
          <TextField
            label="CTA link"
            value={formData.ctaHref || ""}
            onChange={(ctaHref) =>
              setFormData((prev) => ({ ...prev, ctaHref }))
            }
          />
        </div>
      </SectionCopyCard>
      <ResourcePanel
        title="Volunteer roster"
        description={`${volunteers.length} volunteers available for this section.`}
        href="/volunteers"
        label="Manage volunteers"
      />
    </LandingSectionShell>
  );
}
