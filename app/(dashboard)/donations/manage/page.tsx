import { DonationStatus, Prisma } from "@prisma/client";

import { DashboardHeader } from "@/components/common/dashboard-header";
import { Unauthorized } from "@/components/common/unauthorized";
import {
  getDonationSummary,
  listDonationCampaigns,
  listDonations,
} from "@/lib/db/repository/pages/donations";
import { currentUser } from "@/lib/utils/auth.utils";

import { DonationsTable } from "./_components/donations-table";

const donationStatuses = Object.values(DonationStatus);
const sortFields = ["date", "amount"] as const;
const sortDirections = ["asc", "desc"] as const;

type DonationSortField = (typeof sortFields)[number];
type SortDirection = (typeof sortDirections)[number];

type DonationManageSearchParams = {
  page?: string;
  limit?: string;
  q?: string;
  status?: string;
  campaign?: string;
  sort?: string;
  direction?: string;
};

const clean = (value?: string) => value?.trim() || undefined;

const getDonationWhere = (searchParams: DonationManageSearchParams) => {
  const query = clean(searchParams.q);
  const status = donationStatuses.includes(
    searchParams.status as DonationStatus
  )
    ? (searchParams.status as DonationStatus)
    : undefined;
  const campaignId = clean(searchParams.campaign);
  const and: Prisma.DonationWhereInput[] = [];

  if (query) {
    and.push({
      OR: [
        { reference: { contains: query, mode: "insensitive" } },
        { donor: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
        {
          campaign: { is: { topic: { contains: query, mode: "insensitive" } } },
        },
      ],
    });
  }

  if (status) and.push({ status });
  if (campaignId) and.push({ campaignId });

  return and.length ? { AND: and } : undefined;
};

const getDonationOrderBy = (searchParams: DonationManageSearchParams) => {
  const sort = sortFields.includes(searchParams.sort as DonationSortField)
    ? (searchParams.sort as DonationSortField)
    : "date";
  const direction = sortDirections.includes(
    searchParams.direction as SortDirection
  )
    ? (searchParams.direction as SortDirection)
    : "desc";

  return sort === "amount"
    ? ({ amount: direction } satisfies Prisma.DonationOrderByWithRelationInput)
    : ({
        createdAt: direction,
      } satisfies Prisma.DonationOrderByWithRelationInput);
};

const hasActiveFilters = (searchParams: DonationManageSearchParams) =>
  Boolean(
    clean(searchParams.q) ||
      clean(searchParams.status) ||
      clean(searchParams.campaign)
  );

export default async function DonationsManagePage({
  searchParams,
}: {
  searchParams: DonationManageSearchParams;
}) {
  const user = await currentUser();
  if (user?.role !== "admin") {
    return (
      <Unauthorized
        showBackButton={false}
        message="Only administrators can view and manage donation pages."
      />
    );
  }

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const where = getDonationWhere(searchParams);
  const orderBy = getDonationOrderBy(searchParams);

  const [donations, summary, campaigns] = await Promise.all([
    listDonations({ page, limit, where, orderBy }),
    getDonationSummary(where),
    listDonationCampaigns(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Donations" },
          { label: "Donation Management" },
        ]}
      />
      <DonationsTable
        {...(donations as Paginated<Donation>)}
        campaigns={campaigns as DonationCampaign[]}
        summary={summary}
        hasActiveFilters={hasActiveFilters(searchParams)}
        searchParams={searchParams as Record<string, string>}
      />
    </div>
  );
}
