import { DashboardHeader } from "@/components/dashboard-header";
import { EventForm } from "../_components/event-form/form";
import { Unauthorized } from "@/components/unauthorized";
import { currentUser } from "@/lib/utils";
import { EDITORIAL_ROLES } from "@/lib/constants";

export default async function NewEventPage() {
  const user = await currentUser();
  if (!user || !EDITORIAL_ROLES.includes(user.role)) return <Unauthorized />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Create New Event"
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: "New Post" },
        ]}
      />
      <EventForm mode="create" />
    </div>
  );
}
