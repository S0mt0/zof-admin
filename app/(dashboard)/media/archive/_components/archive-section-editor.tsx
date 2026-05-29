"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { SaveButton } from "@/components/common/form-controls";
import { ResourcePanel } from "@/components/common/resource-panel";
import { SectionCopyCard } from "@/components/common/section-copy-card";
import { updateGalleryArchiveAction } from "@/lib/actions/pages/gallery";
import { showActionResult } from "@/lib/utils/pages";

import { GallerySectionShell } from "../../_components/gallery-section-shell";

export function ArchiveSectionEditor({
  section,
}: {
  section: GalleryArchiveSectionContent;
}) {
  const [formData, setFormData] = useState(section);
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateGalleryArchiveAction(formData)
        .then(showActionResult("Archive section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <GallerySectionShell section="archive">
      <SectionCopyCard
        title="Archive section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      />

      <ResourcePanel
        title="Media archive management"
        description="You can manage the media archive here."
        href="/media/manage"
        label="Manage media"
      />
    </GallerySectionShell>
  );
}
