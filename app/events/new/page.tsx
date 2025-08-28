import { DashboardHeader } from "@/components/dashboard-header";
import { EventForm } from "../_components/event-form/form";

export default async function NewEventPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Create New Event"
        breadcrumbs={[
          { label: "Event", href: "/events" },
          { label: "New Post" },
        ]}
      />
      <EventForm mode="create" />
    </div>
  );
}
