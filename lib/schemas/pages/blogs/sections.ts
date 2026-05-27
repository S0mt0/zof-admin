import * as z from "zod";

import { optionalText, SectionIntroSchema } from "../shared";

export const BlogsHeroSectionSchema = z.object({
  intro: SectionIntroSchema,
  heroBackgroundColor: optionalText,
});
