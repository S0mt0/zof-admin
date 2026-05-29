import * as z from "zod";

import { SectionIntroSchema } from "../shared";

export const DonationsAsideSectionSchema = z.object({
  intro: SectionIntroSchema,
});
