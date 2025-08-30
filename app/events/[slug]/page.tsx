import {
  Tag,
  Calendar,
  Eye,
  Clock,
  Edit,
  MessageCircle,
  Mail,
  CalendarCheck,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { format } from "date-fns";

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "@/components/share-button";
import { FRONTEND_BASE_URL } from "@/lib/constants";
import { LexicalContentRenderer } from "@/components/lexical-editor/lexical-content-renderer";
import { getEventBySlug } from "@/lib/db/repository";
import {
  capitalize,
  formatTime,
  getInitials,
  getStatusColor,
} from "@/lib/utils";
import { EventNotFound } from "../_components/not-found";

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
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: capitalize(event.name) },
        ]}
      />
      <article className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getStatusColor(event.status)}>
              {capitalize(event.status)}
            </Badge>
            {event.featured && <Badge variant="secondary">Featured</Badge>}
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/events/${event.slug}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <ShareButton
              title={`Event: "${capitalize(event.name)}" by ${capitalize(
                event.organizer || "Zita-Onyeka Foundation"
              )}`}
              url={`${FRONTEND_BASE_URL}/events/${event.slug}`}
            />
          </div>
        </div>

        {/* Banner */}
        <div className="mb-8">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src={event.bannerImage}
              alt={event.name}
              className="w-full h-full object-cover object-center"
              width={1200}
              height={675}
              priority={true}
            />
          </div>
        </div>

        {/* Time */}
        <strong>{format(event.createdAt, "EEEE, MMMM d")}</strong>
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-3 mt-1">
          {capitalize(event.name)}
        </h1>

        {/* Organizer and Meta */}
        <p className="font-medium mb-2">
          <span className="text-muted-foreground mr-2">By</span>
          {event.organizer
            ? capitalize(event.organizer)
            : event.createdByUser
            ? capitalize(event.createdByUser.name)
            : "Zita-Onyeka Foundation"}
        </p>

        {/* Excerpt */}
        {event.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.excerpt}
          </p>
        )}

        <div className="my-8 space-y-8">
          <div className="space-y-2">
            <h3 className="font-extrabold leading-loose">Date and time</h3>
            <div className="flex gap-2 items-center">
              <CalendarCheck className="w-6 h-6" />
              <p>
                {format(event.date, "EEEE, MMMM d")}{" "}
                {event.endTime && ` - ${formatTime(event.endTime)}`}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-extrabold leading-loose">Location</h3>
            <div className="flex gap-2 items-center">
              <MapPin className="w-6 h-6" />
              <p>{event.location}</p>
            </div>
          </div>
        </div>
        {/* <Separator /> */}

        {/* Event Content/Detail */}
        {event.detail && (
          <LexicalContentRenderer
            content={event.detail}
            className="prose prose-lg dark:prose-invert w-full my-12"
          />
        )}
        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="mb-8">
            <Separator className="mb-6" />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    <Tag className="h-3 w-3 mr-1" />
                    {capitalize(tag)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Ticket Price & Registration */}
        <div className="mb-8">
          {event.ticketPrice && (
            <div className="text-base mb-2">
              <span className="font-semibold">Ticket Price:</span>{" "}
              {event.ticketPrice}
            </div>
          )}
          {event.registrationRequired && (
            <div className="text-base mb-2">
              <span className="font-semibold">Registration Required</span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
