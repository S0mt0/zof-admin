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
  const [
    total,
    success,
    pending,
    ongoing,
    failed,
    abandoned,
    reversed,
    totalAmount,
    successAmount,
  ] = await Promise.all([
    db.donation.count({ where }),
    db.donation.count({ where: { ...where, status: { in: ["success", "completed"] } } }),
    db.donation.count({ where: { ...where, status: "pending" } }),
    db.donation.count({ where: { ...where, status: "ongoing" } }),
    db.donation.count({ where: { ...where, status: "failed" } }),
    db.donation.count({ where: { ...where, status: { in: ["abandoned", "cancelled"] } } }),
    db.donation.count({ where: { ...where, status: { in: ["reversed", "refunded"] } } }),
    db.donation.aggregate({ where, _sum: { amount: true } }),
    db.donation.aggregate({
      where: { ...where, status: { in: ["success", "completed"] } },
      _sum: { amount: true },
    }),
  ]);

  return {
    total,
    success,
    pending,
    ongoing,
    failed,
    abandoned,
    reversed,
    totalAmount: totalAmount._sum.amount ?? 0,
    successAmount: successAmount._sum.amount ?? 0,
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

export const createDonationSubscription = (data: any) =>
  db.donationSubscription.create({ data, include: { campaign: true } });

export const updateDonationSubscription = (id: string, data: any) =>
  db.donationSubscription.update({ where: { id }, data, include: { campaign: true } });

export const getDonationSubscriptionByPlanCode = (paystackPlanCode: string) =>
  db.donationSubscription.findFirst({
    where: { paystackPlanCode },
    include: { campaign: true },
  });

export const getDonationSubscriptionBySubscriptionCode = (
  paystackSubscriptionCode: string
) =>
  db.donationSubscription.findFirst({
    where: { paystackSubscriptionCode },
    include: { campaign: true },
  });

export const updateDonationSubscriptionBySubscriptionCode = (
  paystackSubscriptionCode: string,
  data: any
) =>
  db.donationSubscription.updateMany({
    where: { paystackSubscriptionCode },
    data,
  });
