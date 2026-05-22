"use client";

import { updateLandingFeaturedEventsAction } from "@/lib/actions/pages";

import { FeaturedContentEditor } from "../../_components/featured-content-editor";
import { LandingSectionShell } from "../../_components/landing-section-shell";

export function FeaturedEventsSectionEditor({
  section,
}: {
  section: FeaturedContentSectionContent;
}) {
  return (
    <LandingSectionShell section="featuredEvents">
      <FeaturedContentEditor
        type="events"
        section={section}
        action={updateLandingFeaturedEventsAction}
      />
    </LandingSectionShell>
  );
}
