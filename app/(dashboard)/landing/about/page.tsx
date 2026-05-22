import { DashboardHeader } from "@/components/dashboard-header";
import { getLandingPageData } from "@/lib/db/repository/pages.service";
import { LandingSectionEditor } from "../_components/landing-section-editor";

export default async function LandingAboutPage() {
  const data = await getLandingPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Who We Are" },
        ]}
      />
      <LandingSectionEditor section="about" data={data} />
    </div>
  );
}
