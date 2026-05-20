import { DashboardHeader } from "@/components/dashboard-header";
import { getLandingExtra } from "@/lib/db/repository/pages.service";
import { ExtraForm } from "../_components/extra-form";

export default async function LandingExtraPage() {
  const extra = await getLandingExtra();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Extra" },
        ]}
      />
      <ExtraForm extra={extra} />
    </div>
  );
}
