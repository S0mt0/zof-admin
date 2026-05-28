"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateEventsArchiveAction } from "@/lib/actions/pages/events";
import { showActionResult } from "@/lib/utils/pages";
import { SaveButton } from "@/components/common/form-controls";
import { ResourcePanel } from "@/components/common/resource-panel";
import { SectionCopyCard } from "@/components/common/section-copy-card";
import { EventsSectionShell } from "../../_components/events-section-shell";

export function ArchiveSectionEditor({
  section,
}: {
  section: EventsArchiveSectionContent;
}) {
  const [formData, setFormData] = useState(section);
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateEventsArchiveAction(formData)
        .then(showActionResult("Archive section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <EventsSectionShell section="archive">
      <SectionCopyCard
        title="Archive section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      />

      <ResourcePanel
        title="Events and programmes archive management"
        description={"You can manage events archive here."}
        href="/events-archive/manage"
        label="Manage Events"
      />
    </EventsSectionShell>
  );
}
