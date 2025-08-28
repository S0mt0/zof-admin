import { Calendar, Users, Clock, Edit } from "lucide-react";
import Link from "next/link";
import { unstable_cache } from "next/cache";

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { getEventByName, getEventBySlug } from "@/lib/db/repository";
import { capitalize, getInitials, getStatusColor } from "@/lib/utils";
import { EventNotFound } from "../_components/not-found";
import { format } from "date-fns";

export default async function ViewEventPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const getEventCached = unstable_cache(getEventBySlug, [params?.slug], {
    tags: ["event"],
    revalidate: 300,
  });
  const event = await getEventCached(params.slug);

  if (!event) return <EventNotFound />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="View Event"
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: capitalize(event.name) },
        ]}
      />
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={event.bannerImage || undefined} />
            <AvatarFallback>{getInitials(event.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{event.name}</h2>
            <Badge variant="outline" color={getStatusColor(event.status)}>
              {capitalize(event.status)}
            </Badge>
          </div>
        </div>
        <Separator />
        <div className="flex gap-4 text-muted-foreground">
          <span>
            <Calendar className="inline-block mr-1 h-4 w-4" />
            {format(new Date(event.date), "PPP")}
          </span>
          <span>
            <Users className="inline-block mr-1 h-4 w-4" />
            {event.currentAttendees || 0} Attendees
          </span>
        </div>
        <Separator />
        <div className="flex gap-2 mt-4">
          <Button asChild variant="outline">
            <Link href={`/events/${event.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" /> Edit Event
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
