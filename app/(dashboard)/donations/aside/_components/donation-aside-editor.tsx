"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { SectionCopyCard } from "@/components/common/section-copy-card";
import { SaveButton } from "@/components/common/form-controls";
import { updateDonationAsideAction } from "@/lib/actions/pages/donations";
import { showActionResult } from "@/lib/utils/pages";
import { DonationsSectionShell } from "./donations-section-shell";

export function DonationAsideEditor({
  aside,
}: {
  aside: DonationAsideSectionContent;
}) {
  const [formData, setFormData] = useState(aside);
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateDonationAsideAction(formData)
        .then(showActionResult("Donation aside saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <DonationsSectionShell section="aside">
      <SectionCopyCard
        title="Donation aside copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      />
    </DonationsSectionShell>
  );
}
