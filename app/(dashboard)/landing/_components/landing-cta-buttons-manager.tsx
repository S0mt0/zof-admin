"use client";

import {
  createLandingCtaAction,
  deleteLandingCtaAction,
  reorderLandingCtasAction,
  updateLandingCtaAction,
} from "@/lib/actions/pages/landing";

import { CtaButtonsManager } from "@/components/common/cta-buttons-manager";

const landingCtaActions = {
  create: createLandingCtaAction,
  update: updateLandingCtaAction,
  delete: deleteLandingCtaAction,
  reorder: reorderLandingCtasAction,
};

export function LandingCtaButtonsManager({
  section,
  items,
}: {
  section: LandingSection;
  items: CtaButtonContent[];
}) {
  return (
    <CtaButtonsManager
      section={section}
      items={items}
      actions={landingCtaActions}
    />
  );
}
