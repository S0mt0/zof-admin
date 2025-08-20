"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { FoundationInfo } from "./foundation-info";
import { WebsiteSettings } from "./website-settings";

interface SettingsPageProps {
  foundationInfo: IFoundationInfo | null;
  websiteSettings: IWebsiteSettings | null;
}

export const SettingsPage = ({
  foundationInfo,
  websiteSettings,
}: SettingsPageProps) => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Settings" breadcrumbs={[{ label: "Settings" }]} />

      <div className="grid gap-6">
        <FoundationInfo foundationInfo={foundationInfo} />
        <WebsiteSettings websiteSettings={websiteSettings} />
      </div>
    </div>
  );
};
