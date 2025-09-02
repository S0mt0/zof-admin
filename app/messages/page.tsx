import { unstable_cache } from "next/cache";

import { DashboardHeader } from "@/components/dashboard-header";
import { Messages } from "./_components/messages";
import { countUnreadMessages, getAllMessages } from "@/lib/db/repository";
import { currentUser } from "@/lib/utils";
import { Unauthorized } from "@/components/unauthorized";
import { EDITORIAL_ROLES } from "@/lib/constants";

export const revalidate = 300; // revalidate segment every 5 minutes

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

  const getMessagesCached = unstable_cache(getAllMessages, ["messages"], {
    tags: ["messages"],
    revalidate: 300,
  });

  const countUnreadMessagesCached = unstable_cache(
    countUnreadMessages,
    ["unread-count"],
    {
      tags: ["unread-count"],
      revalidate: 300,
    }
  );

  const [messagesData, unreadCount] = await Promise.all([
    getMessagesCached({
      page,
      limit,
      search: searchParams.search,
      status: searchParams.status as MessageStatus,
    }),
    countUnreadMessagesCached(),
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
