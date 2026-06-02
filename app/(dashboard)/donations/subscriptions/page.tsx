import { Prisma } from "@prisma/client";

import { DashboardHeader } from "@/components/common/dashboard-header";
import { Unauthorized } from "@/components/common/unauthorized";
import { listDonationSubscriptions } from "@/lib/db/repository/pages/donations";
import { currentUser } from "@/lib/utils/auth.utils";
import { fetchPaystackSubscription } from "@/lib/utils/paystack";

import { DonationSubscriptionsTable } from "./_components/donation-subscriptions-table";

export const revalidate = 60;

type SearchParams = {
  page?: string;
  limit?: string;
  q?: string;
  status?: string;
};

const clean = (value?: string) => value?.trim() || undefined;

const getWhere = (searchParams: SearchParams) => {
  const query = clean(searchParams.q);
  const status = clean(searchParams.status);
  const and: Prisma.DonationSubscriptionWhereInput[] = [];

  if (query) {
    and.push({
      OR: [
        { donor: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
        { paystackPlanCode: { contains: query, mode: "insensitive" } },
        { paystackSubscriptionCode: { contains: query, mode: "insensitive" } },
        { campaign: { is: { topic: { contains: query, mode: "insensitive" } } } },
      ],
    });
  }

  if (status) and.push({ status });

  return and.length ? { AND: and } : undefined;
};

const enrichWithPaystack = async (subscription: DonationSubscription) => {
  if (!subscription.paystackSubscriptionCode) return subscription;

  try {
    const paystack = await fetchPaystackSubscription(
      subscription.paystackSubscriptionCode
    );

    return {
      ...subscription,
      paystackLiveStatus: paystack.status,
      paystackNextPaymentDate: paystack.next_payment_date,
    };
  } catch {
    return subscription;
  }
};

export default async function DonationSubscriptionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await currentUser();
  if (user?.role !== "admin") {
    return (
      <Unauthorized
        showBackButton={false}
        message="Only administrators can view donation subscriptions."
      />
    );
  }

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const where = getWhere(searchParams);
  const subscriptions = await listDonationSubscriptions({ page, limit, where });
  const enriched = await Promise.all(
    (subscriptions.data as DonationSubscription[]).map(enrichWithPaystack)
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Donations" },
          { label: "Subscriptions" },
        ]}
      />
      <DonationSubscriptionsTable
        data={enriched as DonationSubscription[]}
        pagination={subscriptions.pagination}
        searchParams={searchParams as Record<string, string>}
      />
    </div>
  );
}
