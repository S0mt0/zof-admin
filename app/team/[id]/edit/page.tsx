import { DashboardHeader } from "@/components/dashboard-header";
import TeamForm from "../../_components/team-form";
import { getTeamMemberById } from "@/lib/db/repository";
import { Unauthorized } from "@/components/unauthorized";
import { currentUser } from "@/lib/utils";
import { EDITORIAL_ROLES } from "@/lib/constants";

interface EditPageProps {
  params: { id: string };
}

export default async function EditTeamMemberPage({ params }: EditPageProps) {
  const user = await currentUser();
  if (!user || !EDITORIAL_ROLES.includes(user.role)) return <Unauthorized />;

  const member = await getTeamMemberById(params.id);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Team Members", href: "/team" },
          { label: member?.name || "Edit Member Info" },
        ]}
      />
      <TeamForm mode="edit" initialData={member} />
    </div>
  );
}
