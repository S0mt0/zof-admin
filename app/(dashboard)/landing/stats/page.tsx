import { DashboardHeader } from "@/components/dashboard-header";
import { listLandingStats } from "@/lib/db/repository/pages.service";
import { StatsManager } from "../_components/stats-manager";

export default async function LandingStatsPage() {
  const stats = await listLandingStats();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Stats" },
        ]}
      />
      <StatsManager stats={stats} />
    </div>
  );
}
