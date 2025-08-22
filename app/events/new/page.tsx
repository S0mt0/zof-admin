import { currentUser } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard-header";
import EventForm from "../_components/event-form";

export default async function NewEventPage() {
  const user = await currentUser();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Create New Event"
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: "New Event" },
        ]}
      />
      <EventForm mode="create" userId={user?.id || ""} />
    </div>
  );
}
