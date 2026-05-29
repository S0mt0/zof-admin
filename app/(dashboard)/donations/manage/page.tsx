import { DashboardHeader } from "@/components/common/dashboard-header";
import { Unauthorized } from "@/components/common/unauthorized";
import { listDonations } from "@/lib/db/repository/pages/donations";
import { currentUser } from "@/lib/utils";

import { DonationsTable } from "./_components/donations-table";

export default async function DonationsManagePage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
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
  const limit = Number(searchParams.limit) || 26;
  const donations = await listDonations({ page, limit });

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
        searchParams={searchParams}
      />
    </div>
  );
}
