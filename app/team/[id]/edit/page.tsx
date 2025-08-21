import { unstable_cache } from "next/cache";

import { DashboardHeader } from "@/components/dashboard-header";
import TeamForm from "../../_components/team-form";
import { getTeamMemberById } from "@/lib/db/repository";

interface EditPageProps {
  params: { id: string };
}

export default async function EditTeamMemberPage({ params }: EditPageProps) {
  const teamMember = unstable_cache(getTeamMemberById, [params?.id], {
    tags: ["team-member"],
    revalidate: false,
  });

  const member = await teamMember(params.id);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        title="Edit Team Member"
        breadcrumbs={[
          { label: "Team Members", href: "/team" },
          { label: member?.name || "Edit Member" },
        ]}
      />
      <TeamForm
        mode="edit"
        initialData={member as unknown as TeamMember}
        addedBy={(member as any)?.addedBy || ""}
      />
    </div>
  );
}
