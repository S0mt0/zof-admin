import { Prisma } from "@prisma/client";

import { db } from "../../../config";

export const listTestimonials = async (
  options: {
    where?: Prisma.TestimonialWhereInput;
    select?: Prisma.TestimonialSelect;
    orderBy?: Prisma.TestimonialOrderByWithRelationInput;
  } = {}
): Promise<Testimonial[]> => {
  try {
    return (await db.testimonial.findMany({
      where: options.where,
      orderBy: options.orderBy || [{ order: "asc" }, { createdAt: "desc" }],
      ...(options.select ? { select: options.select } : {}),
    })) as Testimonial[];
  } catch (error) {
    console.error("Error listing testimonials: ", error);
    return [];
  }
};

export const createTestimonial = async (
  data: Prisma.TestimonialCreateInput
) => {
  try {
    return (await db.testimonial.create({ data })) as Testimonial;
  } catch (error) {
    console.error("Error creating testimonial: ", error);
    return null;
  }
};

export const updateTestimonial = async (
  id: string,
  data: Prisma.TestimonialUpdateInput
) => {
  try {
    return (await db.testimonial.update({ where: { id }, data })) as Testimonial;
  } catch (error) {
    console.error("Error updating testimonial: ", error);
    return null;
  }
};

export const deleteTestimonial = async (id: string) => {
  try {
    return (await db.testimonial.delete({ where: { id } })) as Testimonial;
  } catch (error) {
    console.error("Error deleting testimonial: ", error);
    return null;
  }
};

export const reorderTestimonials = async (ids: string[]) => {
  try {
    await Promise.all(
      ids.map((id, order) =>
        db.testimonial.update({ where: { id }, data: { order } })
      )
    );
    return true;
  } catch (error) {
    console.error("Error reordering testimonials: ", error);
    return false;
  }
};
