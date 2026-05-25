"use client";

import {
  createAboutCtaAction,
  deleteAboutCtaAction,
  reorderAboutCtasAction,
  updateAboutCtaButtonAction,
} from "@/lib/actions/pages/about";

import { CtaButtonsManager } from "@/components/common/cta-buttons-manager";

const aboutCtaActions = {
  create: createAboutCtaAction,
  update: updateAboutCtaButtonAction,
  delete: deleteAboutCtaAction,
  reorder: reorderAboutCtasAction,
};

export function AboutCtaButtonsManager({
  section,
  items,
}: {
  section: AboutCtaSection;
  items: CtaButtonContent[];
}) {
  return (
    <CtaButtonsManager
      section={section}
      items={items}
      actions={aboutCtaActions}
    />
  );
}
