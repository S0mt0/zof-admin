import { SessionExpired } from "@/components/common/session-expired";
import { getUserById } from "@/lib/db/repository/user.service";
import { currentUser } from "@/lib/utils/auth.utils";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId!);

  if (!user) return <SessionExpired />;

  return <>{children}</>;
}
