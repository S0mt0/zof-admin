import { DashboardHeader } from "@/components/common/dashboard-header";
import { Unauthorized } from "@/components/common/unauthorized";
import { listDonationCampaigns } from "@/lib/db/repository/pages/donations";
import { currentUser } from "@/lib/utils/auth.utils";

import { CampaignsManager } from "./_components/campaigns-manager";

export default async function DonationCampaignsPage() {
  const user = await currentUser();
  if (user?.role !== "admin") {
    return (
      <Unauthorized
        showBackButton={false}
        message="Only administrators can view and manage donation pages."
      />
    );
  }

  const campaigns = await listDonationCampaigns();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Pages" }, { label: "Donations" }, { label: "Campaigns" }]} />
      <CampaignsManager campaigns={campaigns as any} />
    </div>
  );
}
