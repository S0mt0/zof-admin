import { getFoundationInfo, getWebsiteSettings } from "@/lib/db/repository";
import { SettingsPage } from "./_components/settings-page";
import { unstable_cache } from "next/cache";

export default async function Page() {
  const getSettingsCached = unstable_cache(getWebsiteSettings, ["settings"], {
    revalidate: 300,
  });

  const getInfoCached = unstable_cache(getFoundationInfo, ["info"], {
    revalidate: 300,
  });

  const foundationInfo = await getInfoCached();
  const websiteSettings = await getSettingsCached();

  return (
    <SettingsPage
      foundationInfo={foundationInfo}
      websiteSettings={websiteSettings}
    />
  );
}
