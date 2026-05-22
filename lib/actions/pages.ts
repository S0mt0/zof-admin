"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";

import {
  AboutPageSchema,
  AboutSectionSchema,
  FaqItemSchema,
  FaqSectionSchema,
  FeaturedContentSectionSchema,
  HeroSectionSchema,
  ImpactSectionSchema,
  LandingStatItemSchema,
  SectionCardItemSchema,
  TestimonialsSectionSchema,
  TestimonialSchema,
  ValuesSectionSchema,
  VolunteersSectionSchema,
} from "../schemas";
import {
  createLandingFaqItem,
  createLandingImpactStat,
  createLandingSectionCard,
  createTestimonial,
  deleteLandingFaqItem,
  deleteLandingImpactStat,
  deleteLandingSectionCard,
  deleteTestimonial,
  getLandingPageData,
  listTestimonials,
  reorderLandingFaqItems,
  reorderLandingImpactStats,
  reorderLandingSectionCards,
  reorderTestimonials,
  updateLandingAboutSettings,
  updateLandingFaqItem,
  updateLandingFaqSettings,
  updateLandingFeaturedBlogsSettings,
  updateLandingFeaturedEventsSettings,
  updateLandingHero,
  updateLandingImpactSettings,
  updateLandingImpactStat,
  updateLandingSectionCard,
  updateLandingTestimonialsSettings,
  updateLandingValuesSettings,
  updateLandingVolunteersSettings,
  updateTestimonial,
  upsertAboutPage,
} from "../db/repository/pages.service";
import { getUserById } from "../db/repository/user.service";
import { addAppActivity } from "../db/repository/app-activity.service";
import { currentUser } from "../utils";
import { EDITORIAL_ROLES } from "../constants";

type CardSection = "about" | "values";

const IdsSchema = z.array(z.string().min(1));
const MAX_PUBLISHED_CARDS = 3;
const MAX_PUBLISHED_STATS = 4;

const getAuthorizedUser = async () => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");

  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  return { user };
};

const sectionPath = (section: string) => `/landing/${section}`;

const logActivity = (title: string, userName: string, role: string) =>
  addAppActivity(title, `${userName} (${role}) updated landing page content`);

const getPublishedCardCount = (
  section: CardSection,
  idToIgnore?: string
) =>
  getLandingPageData().then((page) => {
    const cards = section === "about" ? page.about.cards : page.values.cards;
    return cards.filter((card) => card.published && card.id !== idToIgnore)
      .length;
  });

const validateCardPublishLimit = async (
  section: CardSection,
  published: boolean,
  idToIgnore?: string
) => {
  if (!published) return null;
  const count = await getPublishedCardCount(section, idToIgnore);
  if (count >= MAX_PUBLISHED_CARDS) {
    return "Only 3 cards can be published in this section at once.";
  }
  return null;
};

const validateStatPublishLimit = async (
  published: boolean,
  idToIgnore?: string
) => {
  if (!published) return null;
  const page = await getLandingPageData();
  const count = page.impact.stats.filter(
    (stat) => stat.published && stat.id !== idToIgnore
  ).length;
  if (count >= MAX_PUBLISHED_STATS) {
    return "Only 4 impact stats can be published at once.";
  }
  return null;
};

export const updateAboutPageAction = async (
  values: z.infer<typeof AboutPageSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  const validated = AboutPageSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const saved = await upsertAboutPage(validated.data);
    if (!saved) return { error: "Could not update about page" };

    await addAppActivity(
      "About page updated",
      `${auth.user.name} (${auth.user.role}) updated About Us content`
    );

    revalidatePath("/about");
    return { success: "About page updated" };
  } catch {
    return { error: "Could not update about page" };
  }
};

export const updateLandingHeroAction = async (
  values: z.infer<typeof HeroSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = HeroSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingHero(validated.data);
    await logActivity("Landing hero updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("hero"));
    return { success: "Hero section updated" };
  } catch {
    return { error: "Could not update hero section" };
  }
};

export const updateLandingAboutAction = async (
  values: z.infer<typeof AboutSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = AboutSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingAboutSettings(validated.data);
    await logActivity("Landing about updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("about"));
    return { success: "About section updated" };
  } catch {
    return { error: "Could not update about section" };
  }
};

export const updateLandingValuesAction = async (
  values: z.infer<typeof ValuesSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = ValuesSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingValuesSettings(validated.data);
    await logActivity("Landing values updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("values"));
    return { success: "Values section updated" };
  } catch {
    return { error: "Could not update values section" };
  }
};

export const updateLandingVolunteersAction = async (
  values: z.infer<typeof VolunteersSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = VolunteersSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingVolunteersSettings(validated.data as VolunteersSectionContent);
    await logActivity(
      "Landing volunteers updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("volunteers"));
    return { success: "Volunteers section updated" };
  } catch {
    return { error: "Could not update volunteers section" };
  }
};

export const updateLandingImpactAction = async (
  values: z.infer<typeof ImpactSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = ImpactSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingImpactSettings(validated.data);
    await logActivity("Landing impact updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("impact"));
    return { success: "Impact section updated" };
  } catch {
    return { error: "Could not update impact section" };
  }
};

export const updateLandingTestimonialsSectionAction = async (
  values: z.infer<typeof TestimonialsSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = TestimonialsSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingTestimonialsSettings(validated.data);
    await logActivity(
      "Landing testimonials updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("testimonials"));
    return { success: "Testimonials section updated" };
  } catch {
    return { error: "Could not update testimonials section" };
  }
};

export const updateLandingFeaturedBlogsAction = async (
  values: z.infer<typeof FeaturedContentSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FeaturedContentSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingFeaturedBlogsSettings(validated.data);
    await logActivity(
      "Landing featured blogs updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("featured-blogs"));
    return { success: "Featured blogs section updated" };
  } catch {
    return { error: "Could not update featured blogs section" };
  }
};

export const updateLandingFeaturedEventsAction = async (
  values: z.infer<typeof FeaturedContentSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FeaturedContentSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingFeaturedEventsSettings(validated.data);
    await logActivity(
      "Landing featured events updated",
      auth.user.name,
      auth.user.role
    );
    revalidatePath(sectionPath("featured-events"));
    return { success: "Featured events section updated" };
  } catch {
    return { error: "Could not update featured events section" };
  }
};

export const updateLandingFaqSectionAction = async (
  values: z.infer<typeof FaqSectionSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FaqSectionSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingFaqSettings(validated.data);
    await logActivity("Landing FAQ updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("faqs"));
    return { success: "FAQ section updated" };
  } catch {
    return { error: "Could not update FAQ section" };
  }
};

export const createLandingCardAction = async (
  section: CardSection,
  values: z.infer<typeof SectionCardItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = SectionCardItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validateCardPublishLimit(
    section,
    validated.data.published
  );
  if (limitError) return { error: limitError };

  try {
    await createLandingSectionCard(section, validated.data);
    await logActivity("Landing card added", auth.user.name, auth.user.role);
    revalidatePath(sectionPath(section === "about" ? "about" : "values"));
    return { success: "Card added" };
  } catch {
    return { error: "Could not add card" };
  }
};

export const updateLandingCardAction = async (
  section: CardSection,
  id: string,
  values: z.infer<typeof SectionCardItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = SectionCardItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validateCardPublishLimit(
    section,
    validated.data.published,
    id
  );
  if (limitError) return { error: limitError };

  try {
    await updateLandingSectionCard(section, id, validated.data);
    await logActivity("Landing card updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath(section === "about" ? "about" : "values"));
    return { success: "Card updated" };
  } catch {
    return { error: "Could not update card" };
  }
};

export const deleteLandingCardAction = async (
  section: CardSection,
  id: string
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteLandingSectionCard(section, id);
    await logActivity("Landing card deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath(section === "about" ? "about" : "values"));
    return { success: "Card deleted" };
  } catch {
    return { error: "Could not delete card" };
  }
};

export const reorderLandingCardsAction = async (
  section: CardSection,
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    await reorderLandingSectionCards(section, validated.data);
    revalidatePath(sectionPath(section === "about" ? "about" : "values"));
    return { success: "Order updated" };
  } catch {
    return { error: "Could not update order" };
  }
};

export const createLandingStatAction = async (
  values: z.infer<typeof LandingStatItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = LandingStatItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validateStatPublishLimit(validated.data.published);
  if (limitError) return { error: limitError };

  try {
    await createLandingImpactStat(validated.data);
    await logActivity("Landing stat added", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("impact"));
    return { success: "Stat added" };
  } catch {
    return { error: "Could not add stat" };
  }
};

export const updateLandingStatAction = async (
  id: string,
  values: z.infer<typeof LandingStatItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = LandingStatItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  const limitError = await validateStatPublishLimit(
    validated.data.published,
    id
  );
  if (limitError) return { error: limitError };

  try {
    await updateLandingImpactStat(id, validated.data);
    await logActivity("Landing stat updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("impact"));
    return { success: "Stat updated" };
  } catch {
    return { error: "Could not update stat" };
  }
};

export const deleteLandingStatAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteLandingImpactStat(id);
    await logActivity("Landing stat deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("impact"));
    return { success: "Stat deleted" };
  } catch {
    return { error: "Could not delete stat" };
  }
};

export const reorderLandingStatsAction = async (
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    await reorderLandingImpactStats(validated.data);
    revalidatePath(sectionPath("impact"));
    return { success: "Order updated" };
  } catch {
    return { error: "Could not update order" };
  }
};

export const createLandingFaqAction = async (
  values: z.infer<typeof FaqItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FaqItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await createLandingFaqItem(validated.data);
    await logActivity("Landing FAQ added", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("faqs"));
    return { success: "FAQ added" };
  } catch {
    return { error: "Could not add FAQ" };
  }
};

export const updateLandingFaqAction = async (
  id: string,
  values: z.infer<typeof FaqItemSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = FaqItemSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    await updateLandingFaqItem(id, validated.data);
    await logActivity("Landing FAQ updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("faqs"));
    return { success: "FAQ updated" };
  } catch {
    return { error: "Could not update FAQ" };
  }
};

export const deleteLandingFaqAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    await deleteLandingFaqItem(id);
    await logActivity("Landing FAQ deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("faqs"));
    return { success: "FAQ deleted" };
  } catch {
    return { error: "Could not delete FAQ" };
  }
};

export const reorderLandingFaqsAction = async (
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    await reorderLandingFaqItems(validated.data);
    revalidatePath(sectionPath("faqs"));
    return { success: "Order updated" };
  } catch {
    return { error: "Could not update order" };
  }
};

export const createTestimonialAction = async (
  values: z.infer<typeof TestimonialSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = TestimonialSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const testimonials = await listTestimonials();
    const created = await createTestimonial({
      ...validated.data,
      order:
        testimonials.reduce((max, item) => Math.max(max, item.order), -1) + 1,
    });
    if (!created) return { error: "Could not add testimonial" };

    await logActivity("Testimonial added", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("testimonials"));
    return { success: "Testimonial added" };
  } catch {
    return { error: "Could not add testimonial" };
  }
};

export const updateTestimonialAction = async (
  id: string,
  values: z.infer<typeof TestimonialSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = TestimonialSchema.safeParse(values);
  if (!validated.success) return { error: "Invalid fields" };

  try {
    const updated = await updateTestimonial(id, validated.data);
    if (!updated) return { error: "Could not update testimonial" };

    await logActivity("Testimonial updated", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("testimonials"));
    return { success: "Testimonial updated" };
  } catch {
    return { error: "Could not update testimonial" };
  }
};

export const deleteTestimonialAction = async (id: string) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };

  try {
    const deleted = await deleteTestimonial(id);
    if (!deleted) return { error: "Could not delete testimonial" };

    await logActivity("Testimonial deleted", auth.user.name, auth.user.role);
    revalidatePath(sectionPath("testimonials"));
    return { success: "Testimonial deleted" };
  } catch {
    return { error: "Could not delete testimonial" };
  }
};

export const reorderTestimonialsAction = async (
  ids: z.infer<typeof IdsSchema>
) => {
  const auth = await getAuthorizedUser();
  if ("error" in auth) return { error: auth.error };
  const validated = IdsSchema.safeParse(ids);
  if (!validated.success) return { error: "Invalid order data" };

  try {
    const ok = await reorderTestimonials(validated.data);
    if (!ok) return { error: "Could not update order" };

    revalidatePath(sectionPath("testimonials"));
    return { success: "Order updated" };
  } catch {
    return { error: "Could not update order" };
  }
};
