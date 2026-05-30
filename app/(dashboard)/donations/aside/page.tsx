import { DashboardHeader } from "@/components/common/dashboard-header";
import { Unauthorized } from "@/components/common/unauthorized";
import { getDonationsPageData } from "@/lib/db/repository/pages/donations";
import { currentUser } from "@/lib/utils/auth.utils";

import { DonationAsideEditor } from "./_components/donation-aside-editor";

export default async function DonationAsidePage() {
  const user = await currentUser();
  if (user?.role !== "admin") {
    return (
      <Unauthorized
        showBackButton={false}
        message="Only administrators can view and manage donation pages."
      />
    );
  }

  const data = await getDonationsPageData();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Pages" }, { label: "Donations" }, { label: "Aside" }]} />
      <DonationAsideEditor aside={data.aside} />
    </div>
  );
}
