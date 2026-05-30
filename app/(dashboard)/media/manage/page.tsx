import { DashboardHeader } from "@/components/common/dashboard-header";
import { MediaPage } from "../_components/media-page";
import { MediaStats } from "../_components/media-stats";
import { getMediaStats } from "@/lib/db/repository/stats.service";
import { listMedia } from "@/lib/db/repository/media.service";

export default async function MediaManagePage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    type?: string;
    limit?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 15;

  const where: any = {};

  if (searchParams.search) {
    where.OR = [
      { alt: { contains: searchParams.search, mode: "insensitive" } },
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { caption: { contains: searchParams.search, mode: "insensitive" } },
      {
        description: {
          contains: searchParams.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (
    searchParams.type &&
    searchParams.type !== "all" &&
    ["photo", "video"].includes(searchParams.type)
  ) {
    where.type = searchParams.type;
  }

  const [stats, mediaData] = await Promise.all([
    getMediaStats(),
    listMedia({
      page,
      limit,
      where,
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Photo Gallery" },
          { label: "Media Management" },
        ]}
      />
      <MediaStats {...stats} />
      <MediaPage {...mediaData} searchParams={searchParams} />
    </div>
  );
}
