import { unstable_cache } from "next/cache";

import { getEvents } from "@/lib/db/repository";
import { EventPage } from "./_components/event-page";
import { currentUser } from "@/lib/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;

  const getEventsCached = unstable_cache(
    getEvents,
    [
      "events",
      page.toString(),
      limit.toString(),
      searchParams.search || "",
      searchParams.status || "",
      searchParams.featured || "",
    ],
    {
      tags: ["events"],
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

  return (
    <EventPage
      events={events}
      pagination={pagination}
      searchParams={searchParams}
    />
  );
}
