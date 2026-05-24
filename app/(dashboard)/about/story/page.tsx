import { DashboardHeader } from "@/components/common/dashboard-header";
import { getAboutPageData } from "@/lib/db/repository/pages/about";

import { StorySectionEditor } from "./_components/story-section-editor";

export default async function AboutStoryPage() {
  const data = await getAboutPageData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "About" },
          { label: "Story" },
        ]}
      />
      <StorySectionEditor section={data.story} />
    </div>
  );
}
