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

  const [stats, eventsData] = await Promise.all([
    getEventsStats(),
    getAllEvents({
      page,
      limit,
      search: searchParams.search,
      status: searchParams.status,
      featured: searchParams.featured,
    }),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Events" }]} />

      <EventStats {...stats} />
      <EventPage {...eventsData} searchParams={searchParams} />
    </div>
  );
}
