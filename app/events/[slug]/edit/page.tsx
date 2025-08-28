import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard-header";
import { getEventById } from "@/lib/db/repository";
import { EventForm } from "../../_components/event-form/form";

interface EditEventPageProps {
  params: {
    id: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title={`Edit: ${event.name}`}
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: "Edit Event" },
        ]}
      />
      <EventForm mode="edit" initialData={event} />
    </div>
  );
}
