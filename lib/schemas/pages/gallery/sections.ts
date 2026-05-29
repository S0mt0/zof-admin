import * as z from "zod";

import { optionalText, SectionIntroSchema } from "../shared";

export const GalleryHeroSectionSchema = z.object({
  intro: SectionIntroSchema,
  primaryImage: optionalText,
  secondaryImage: optionalText,
  heroBackgroundColor: optionalText,
});

export const GalleryArchiveSectionSchema = z.object({
  intro: SectionIntroSchema,
});
