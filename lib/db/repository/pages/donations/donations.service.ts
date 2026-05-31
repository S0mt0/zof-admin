import { Prisma } from "@prisma/client";

import { emptyPaginatedData } from "@/lib/constants";
import { db } from "@/lib/db/config";
import { prismaPaginate } from "@/lib/utils/db.utils";

interface ListDonationsOptions {
  where?: Prisma.DonationWhereInput;
  orderBy?: Prisma.DonationOrderByWithRelationInput;
  page: number;
  limit: number;
}

export const listDonations = async ({ where, orderBy, page, limit }: ListDonationsOptions) => {
  try {
    return prismaPaginate({
      page,
      limit,
      maxLimit: 100,
      model: db.donation,
      args: {
        where,
        orderBy: orderBy ?? { createdAt: "desc" },
        include: { campaign: true },
      },
    });
  } catch (error) {
    console.log("error fetching donations", error);
    return emptyPaginatedData;
  }
};


export const getDonationSummary = async (where?: Prisma.DonationWhereInput) => {
  const [total, completed, pending, failed, refunded, cancelled, totalAmount, completedAmount] =
    await Promise.all([
      db.donation.count({ where }),
      db.donation.count({ where: { ...where, status: "completed" } }),
      db.donation.count({ where: { ...where, status: "pending" } }),
      db.donation.count({ where: { ...where, status: "failed" } }),
      db.donation.count({ where: { ...where, status: "refunded" } }),
      db.donation.count({ where: { ...where, status: "cancelled" } }),
      db.donation.aggregate({ where, _sum: { amount: true } }),
      db.donation.aggregate({
        where: { ...where, status: "completed" },
        _sum: { amount: true },
      }),
    ]);

  return {
    total,
    completed,
    pending,
    failed,
    refunded,
    cancelled,
    totalAmount: totalAmount._sum.amount ?? 0,
    completedAmount: completedAmount._sum.amount ?? 0,
  };
};

export const listAllDonations = () =>
  db.donation.findMany({ orderBy: { createdAt: "desc" }, include: { campaign: true } });

export const getDonationById = (id: string) =>
  db.donation.findUnique({ where: { id }, include: { campaign: true } });

export const getDonationByReference = (reference: string) =>
  db.donation.findUnique({ where: { reference }, include: { campaign: true } });

export const createDonation = (data: any) =>
  db.donation.create({ data, include: { campaign: true } });

export const updateDonationByReference = (reference: string, data: any) =>
  db.donation.update({ where: { reference }, data, include: { campaign: true } });

export const updateDonation = (id: string, data: any) =>
  db.donation.update({ where: { id }, data, include: { campaign: true } });

export const deleteDonation = (id: string) =>
  db.donation.delete({ where: { id }, include: { campaign: true } });

export const deleteDonations = (ids: string[]) =>
  db.donation.deleteMany({ where: { id: { in: ids } } });
