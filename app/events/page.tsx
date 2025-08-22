import { unstable_cache } from "next/cache";

import { getEvents, getEventsStats } from "@/lib/db/repository";
import { EventPage } from "./_components/event-page";
import { currentUser } from "@/lib/utils";
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
    getEvents,
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

  const user = await currentUser();

  const { data: events, pagination } = await getEventsCached(
    user?.id!,
    page,
    limit,
    searchParams.search,
    searchParams.status,
    searchParams.featured
  );

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
