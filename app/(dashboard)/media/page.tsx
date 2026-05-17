import { DashboardHeader } from "@/components/dashboard-header";
import { MediaPage } from "./_components/media-page";
import { MediaStats } from "./_components/media-stats";
import { getMediaStats, listMedia } from "@/lib/db/repository";

export default async function Page({
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
  const limit = Number(searchParams.limit) || 12;

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
      <DashboardHeader breadcrumbs={[{ label: "Media" }]} />
      <MediaStats {...stats} />
      <MediaPage {...mediaData} searchParams={searchParams} />
    </div>
  );
}
