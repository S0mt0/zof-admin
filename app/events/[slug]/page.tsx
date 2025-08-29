import {
  Tag,
  Calendar,
  Eye,
  Clock,
  Edit,
  MessageCircle,
  Mail,
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
        {/* Status and Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <Badge className={getStatusColor(event.status)}>
            {capitalize(event.status)}
          </Badge>
          {event.featured && <Badge variant="secondary">Featured</Badge>}
        </div>
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
          {capitalize(event.name)}
        </h1>
        {/* Excerpt */}
        {event.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {event.excerpt}
          </p>
        )}
        {/* Organizer and Meta */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Avatar className="h-10 w-10">
              <AvatarImage src={event.bannerImage || undefined} />
              <AvatarFallback>{getInitials(event.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-medium">
                {event.organizer
                  ? capitalize(event.organizer)
                  : "Zita-Onyeka Foundation"}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {event.date && format(new Date(event.date), "MMMM d, yyyy")}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(event.startTime)}
                  {event.endTime && ` - ${formatTime(event.endTime)}`}
                </div>
              </div>
            </div>
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
        <Separator />
        {/* Banner Image */}
        {event.bannerImage && (
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
        )}
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
