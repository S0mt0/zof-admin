import * as z from "zod";

import { optionalText, SectionIntroSchema } from "../shared";

export const EventsHeroSectionSchema = z.object({
  intro: SectionIntroSchema,
  heroBackgroundColor: optionalText,
});

export const EventsArchiveSectionSchema = z.object({
  intro: SectionIntroSchema,
});
