import { currentUser } from "@/lib/utils";

export default async function SettingsPage() {
  const user = await currentUser();
  return <div>{JSON.stringify(user)}</div>;
}
