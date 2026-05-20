import { Prisma } from "@prisma/client";

import { db } from "../config";

export const getAboutPage = async (
  select?: Prisma.AboutPageSelect
): Promise<AboutPageContent | null> => {
  try {
    return (await db.aboutPage.findFirst({ select })) as AboutPageContent | null;
  } catch (error) {
    console.error("Error fetching about page: ", error);
    return null;
  }
};

export const upsertAboutPage = async (
  data: Prisma.AboutPageCreateInput
): Promise<AboutPageContent | null> => {
  try {
    const existing = await db.aboutPage.findFirst({ select: { id: true } });

    if (existing) {
      return (await db.aboutPage.update({
        where: { id: existing.id },
        data,
      })) as AboutPageContent;
    }

    return (await db.aboutPage.create({ data })) as AboutPageContent;
  } catch (error) {
    console.error("Error saving about page: ", error);
    return null;
  }
};

export const listLandingFaqs = async (
  options: {
    where?: Prisma.LandingFaqWhereInput;
    select?: Prisma.LandingFaqSelect;
    orderBy?: Prisma.LandingFaqOrderByWithRelationInput;
  } = {}
): Promise<LandingFaq[]> => {
  try {
    return (await db.landingFaq.findMany({
      where: options.where,
      orderBy: options.orderBy || [{ order: "asc" }, { createdAt: "desc" }],
      ...(options.select ? { select: options.select } : {}),
    })) as LandingFaq[];
  } catch (error) {
    console.error("Error listing landing FAQs: ", error);
    return [];
  }
};

export const createLandingFaq = async (data: Prisma.LandingFaqCreateInput) => {
  try {
    return (await db.landingFaq.create({ data })) as LandingFaq;
  } catch (error) {
    console.error("Error creating landing FAQ: ", error);
    return null;
  }
};

export const updateLandingFaq = async (
  id: string,
  data: Prisma.LandingFaqUpdateInput
) => {
  try {
    return (await db.landingFaq.update({ where: { id }, data })) as LandingFaq;
  } catch (error) {
    console.error("Error updating landing FAQ: ", error);
    return null;
  }
};

export const deleteLandingFaq = async (id: string) => {
  try {
    return (await db.landingFaq.delete({ where: { id } })) as LandingFaq;
  } catch (error) {
    console.error("Error deleting landing FAQ: ", error);
    return null;
  }
};

export const listLandingTestimonials = async (
  options: {
    where?: Prisma.LandingTestimonialWhereInput;
    select?: Prisma.LandingTestimonialSelect;
    orderBy?: Prisma.LandingTestimonialOrderByWithRelationInput;
  } = {}
): Promise<LandingTestimonial[]> => {
  try {
    return (await db.landingTestimonial.findMany({
      where: options.where,
      orderBy: options.orderBy || [{ order: "asc" }, { createdAt: "desc" }],
      ...(options.select ? { select: options.select } : {}),
    })) as LandingTestimonial[];
  } catch (error) {
    console.error("Error listing testimonials: ", error);
    return [];
  }
};

export const createLandingTestimonial = async (
  data: Prisma.LandingTestimonialCreateInput
) => {
  try {
    return (await db.landingTestimonial.create({ data })) as LandingTestimonial;
  } catch (error) {
    console.error("Error creating testimonial: ", error);
    return null;
  }
};

export const updateLandingTestimonial = async (
  id: string,
  data: Prisma.LandingTestimonialUpdateInput
) => {
  try {
    return (await db.landingTestimonial.update({
      where: { id },
      data,
    })) as LandingTestimonial;
  } catch (error) {
    console.error("Error updating testimonial: ", error);
    return null;
  }
};

export const deleteLandingTestimonial = async (id: string) => {
  try {
    return (await db.landingTestimonial.delete({
      where: { id },
    })) as LandingTestimonial;
  } catch (error) {
    console.error("Error deleting testimonial: ", error);
    return null;
  }
};

export const listLandingStats = async (
  options: {
    where?: Prisma.LandingStatWhereInput;
    select?: Prisma.LandingStatSelect;
    orderBy?: Prisma.LandingStatOrderByWithRelationInput;
  } = {}
): Promise<LandingStat[]> => {
  try {
    return (await db.landingStat.findMany({
      where: options.where,
      orderBy: options.orderBy || [{ order: "asc" }, { createdAt: "desc" }],
      ...(options.select ? { select: options.select } : {}),
    })) as LandingStat[];
  } catch (error) {
    console.error("Error listing landing stats: ", error);
    return [];
  }
};

export const createLandingStat = async (data: Prisma.LandingStatCreateInput) => {
  try {
    return (await db.landingStat.create({ data })) as LandingStat;
  } catch (error) {
    console.error("Error creating landing stat: ", error);
    return null;
  }
};

export const updateLandingStat = async (
  id: string,
  data: Prisma.LandingStatUpdateInput
) => {
  try {
    return (await db.landingStat.update({ where: { id }, data })) as LandingStat;
  } catch (error) {
    console.error("Error updating landing stat: ", error);
    return null;
  }
};

export const deleteLandingStat = async (id: string) => {
  try {
    return (await db.landingStat.delete({ where: { id } })) as LandingStat;
  } catch (error) {
    console.error("Error deleting landing stat: ", error);
    return null;
  }
};

export const getLandingExtra = async (
  select?: Prisma.LandingExtraSelect
): Promise<LandingExtraContent | null> => {
  try {
    return (await db.landingExtra.findFirst({ select })) as LandingExtraContent | null;
  } catch (error) {
    console.error("Error fetching landing extra: ", error);
    return null;
  }
};

export const upsertLandingExtra = async (
  data: Prisma.LandingExtraCreateInput
): Promise<LandingExtraContent | null> => {
  try {
    const existing = await db.landingExtra.findFirst({ select: { id: true } });

    if (existing) {
      return (await db.landingExtra.update({
        where: { id: existing.id },
        data,
      })) as LandingExtraContent;
    }

    return (await db.landingExtra.create({ data })) as LandingExtraContent;
  } catch (error) {
    console.error("Error saving landing extra: ", error);
    return null;
  }
};
