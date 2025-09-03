import { SessionExpired } from "@/components/session-expired";
import { getUserById } from "@/lib/db/repository";
import { currentUser } from "@/lib/utils";

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
