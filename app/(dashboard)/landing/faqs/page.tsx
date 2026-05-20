import { DashboardHeader } from "@/components/dashboard-header";
import { listLandingFaqs } from "@/lib/db/repository/pages.service";
import { FaqsManager } from "../_components/faqs-manager";

export default async function LandingFaqsPage() {
  const faqs = await listLandingFaqs();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "FAQs" },
        ]}
      />
      <FaqsManager faqs={faqs} />
    </div>
  );
}
