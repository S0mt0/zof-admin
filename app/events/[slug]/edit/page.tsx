import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { DashboardHeader } from "@/components/dashboard-header";
import { EventForm } from "../../_components/event-form";
import { getEventBySlug } from "@/lib/db/repository";

export default async function EditEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const getEventCached = unstable_cache(getEventBySlug, [params?.slug], {
    tags: ["event"],
    revalidate: 300,
  });
  const event = await getEventCached(params.slug);

  if (!event) return notFound();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Edit Event"
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: event.title, href: `/events/${event.slug}` },
          { label: "Edit" },
        ]}
      />
      <EventForm event={event} />
    </div>
  );
}
