import { Prisma } from "@prisma/client";

import { emptyPaginatedData } from "@/lib/constants";
import { db } from "@/lib/db/config";
import { prismaPaginate } from "@/lib/utils/db.utils";

interface ListDonationsOptions {
  where?: Prisma.DonationWhereInput;
  page: number;
  limit: number;
}

export const listDonations = async ({ where, page, limit }: ListDonationsOptions) => {
  try {
    return prismaPaginate({
      page,
      limit,
      maxLimit: 100,
      model: db.donation,
      args: {
        where,
        orderBy: { createdAt: "desc" },
        include: { campaign: true },
      },
    });
  } catch (error) {
    console.log("error fetching donations", error);
    return emptyPaginatedData;
  }
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
