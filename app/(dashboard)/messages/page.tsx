import { DashboardHeader } from "@/components/dashboard-header";
import { Messages } from "./_components/messages";
import { countUnreadMessages, getAllMessages } from "@/lib/db/repository";
import { currentUser } from "@/lib/utils";
import { Unauthorized } from "@/components/unauthorized";
import { EDITORIAL_ROLES } from "@/lib/constants";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    limit?: string;
  };
}) {
  const user = await currentUser();
  if (!user || !EDITORIAL_ROLES.includes(user.role)) return <Unauthorized />;

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  const [messagesData, unreadCount] = await Promise.all([
    getAllMessages({
      page,
      limit,
      search: searchParams.search,
      status: searchParams.status as MessageStatus,
    }),
    countUnreadMessages(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Messages" }]} />

      <Messages
        {...messagesData}
        searchParams={searchParams}
        unreadCount={unreadCount}
      />
    </div>
  );
}
