import { DashboardHeader } from "@/components/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages.service";
import { LandingSectionEditor } from "../_components/landing-section-editor";

export default async function LandingFeaturedEventsPage() {
  const data = await getLandingPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Featured Events" },
        ]}
      />
      <LandingSectionEditor section="featuredEvents" data={data} />
    </div>
  );
}
