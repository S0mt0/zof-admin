import { DashboardHeader } from "@/components/common/dashboard-header";
import { getAboutPage } from "@/lib/db/repository/pages.service";
import { AboutPageForm } from "./_components/about-page-form";

export default async function AboutPage() {
  const content = await getAboutPage();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "About" },
          { label: "About Us" },
        ]}
      />

      <AboutPageForm content={content} />
    </div>
  );
}
