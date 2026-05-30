import { DashboardHeader } from "@/components/common/dashboard-header";
import { Unauthorized } from "@/components/common/unauthorized";
import { getFoundationInfo } from "@/lib/db/repository/settings.service";
import { currentUser } from "@/lib/utils/auth.utils";
import { FoundationInfo } from "../../settings/_components/foundation-info";

export default async function ContactInfoPage() {
  const user = await currentUser();
  if (!user || user.role !== "admin") return <Unauthorized />;

  const info = await getFoundationInfo();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Contact" },
          { label: "Info" },
        ]}
      />

      <FoundationInfo foundationInfo={info} />
    </div>
  );
}
