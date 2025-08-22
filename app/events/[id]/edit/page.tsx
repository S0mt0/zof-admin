import { currentUser } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard-header";
import EventForm from "../../_components/event-form";
import { getEventById } from "@/lib/db/repository";
import { notFound } from "next/navigation";

interface EditEventPageProps {
  params: {
    id: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const user = await currentUser();
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title={`Edit: ${event.title}`}
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: "Edit Event" },
        ]}
      />
      <EventForm mode="edit" initialData={event} userId={user?.id || ""} />
    </div>
  );
}
