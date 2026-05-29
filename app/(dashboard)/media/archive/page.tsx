import { DashboardHeader } from "@/components/common/dashboard-header";
import { getGalleryPageData } from "@/lib/db/repository/pages/gallery";

import { ArchiveSectionEditor } from "./_components/archive-section-editor";

export default async function GalleryArchiveSection() {
  const data = await getGalleryPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Gallery", href: "/media/manage" },
          { label: "Archive" },
        ]}
      />
      <ArchiveSectionEditor section={data.archive} />
    </div>
  );
}
