import { DashboardHeader } from "@/components/common/dashboard-header";
import { getEventBySlug } from "@/lib/db/repository/pages/events";
import { EventForm } from "../../_components/event-form/form";
import { EventNotFound } from "../../_components/not-found";
import { Unauthorized } from "@/components/common/unauthorized";
import { currentUser } from "@/lib/utils/auth.utils";
import { EDITORIAL_ROLES } from "@/lib/constants";

interface EditEventPageProps {
  params: {
    slug: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const user = await currentUser();
  if (!user || !EDITORIAL_ROLES.includes(user.role)) return <Unauthorized />;

  const event = await getEventBySlug(params.slug);

  if (!event) return <EventNotFound />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title={`Edit: ${event.name}`}
        breadcrumbs={[
          { label: "Events", href: "/events-and-programmes/manage" },
          { label: "Edit Event" },
        ]}
      />
      <EventForm mode="edit" initialData={event as any} />
    </div>
  );
}
