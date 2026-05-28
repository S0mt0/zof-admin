import { DashboardHeader } from "@/components/common/dashboard-header";
import { getEventsPageData } from "@/lib/db/repository/pages/events";
import { ArchiveSectionEditor } from "./_components/archive-section-editor";

export default async function ArchivePage() {
  const data = await getEventsPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Events", href: "/events-and-programmes/manage" },
          { label: "Events Archive" },
        ]}
      />
      <ArchiveSectionEditor section={data.archive} />
    </div>
  );
}
