import { unstable_cache } from "next/cache";

import { getAllEvents, getEventsStats } from "@/lib/db/repository";
import { EventPage } from "./_components/event-page";
import { EventStats } from "./_components/event-stats";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
    limit?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  const getEventsCached = unstable_cache(
    getAllEvents,
    [
      "events",
      page.toString(),
      limit.toString(),
      searchParams.search || "",
      searchParams.status || "",
      searchParams.featured || "",
      searchParams.limit || "",
    ],
    {
      tags: ["events"],
      revalidate: false,
    }
  );

  const getEventsStatsCached = unstable_cache(
    getEventsStats,
    ["events-stats"],
    {
      tags: ["events-stats"],
      revalidate: false,
    }
  );

  const { data: events, pagination } = await getEventsCached({
    page,
    limit,
    search: searchParams.search,
    status: searchParams.status,
    featured: searchParams.featured,
  });

  const eventsStats = await getEventsStatsCached();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Events" breadcrumbs={[{ label: "Events" }]} />

      <EventStats {...eventsStats} />

      <EventPage
        events={events}
        pagination={pagination}
        searchParams={searchParams}
      />
    </div>
  );
}
