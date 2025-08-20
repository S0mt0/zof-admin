import { currentUser } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard-header";
import TeamForm from "../_components/team-form";

export default async function NewTeamMemberPage() {
  const user = await currentUser();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Add New Team Member"
        breadcrumbs={[
          { label: "Team Members", href: "/team" },
          { label: "New Member" },
        ]}
      />
      <TeamForm mode="create" addedBy={user?.id || ""} />
    </div>
  );
}
