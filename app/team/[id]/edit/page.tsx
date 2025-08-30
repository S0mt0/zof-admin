import { DashboardHeader } from "@/components/dashboard-header";
import TeamForm from "../../_components/team-form";
import { getTeamMemberById } from "@/lib/db/repository";

interface EditPageProps {
  params: { id: string };
}

export default async function EditTeamMemberPage({ params }: EditPageProps) {
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
