"use client";

import { updateLandingFeaturedBlogsAction } from "@/lib/actions/pages/landing/featured-content.actions";

import { FeaturedContentEditor } from "../../_components/featured-content-editor";
import { LandingSectionShell } from "../../_components/landing-section-shell";

export function FeaturedBlogsSectionEditor({
  section,
}: {
  section: FeaturedContentSectionContent;
}) {
  return (
    <LandingSectionShell section="featuredBlogs">
      <FeaturedContentEditor
        type="blogs"
        section={section}
        action={updateLandingFeaturedBlogsAction}
      />
    </LandingSectionShell>
  );
}
