import { getFoundationInfo, getWebsiteSettings } from "@/lib/db/data";
import { SettingsPage } from "./_components/settings-page";

export default async function Page() {
  const foundationInfo = await getFoundationInfo();
  const websiteSettings = await getWebsiteSettings();

  console.log("fetching foundation info...");

  return (
    <SettingsPage
      foundationInfo={foundationInfo}
      websiteSettings={websiteSettings}
    />
  );
}
