import { DashboardHeader } from "@/components/dashboard-header";
import TeamForm from "../_components/team-form";
import { currentUser } from "@/lib/utils";
import { EDITORIAL_ROLES } from "@/lib/constants";
import { Unauthorized } from "@/components/unauthorized";

export default async function NewTeamMemberPage() {
  const user = await currentUser();
  if (!user || !EDITORIAL_ROLES.includes(user.role)) return <Unauthorized />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Add New Team Member"
        breadcrumbs={[
          { label: "Team Members", href: "/team" },
          { label: "New Member" },
        ]}
      />
      <TeamForm mode="create" />
    </div>
  );
}
