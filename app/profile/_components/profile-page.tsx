"use client";

import { User, Calendar, Edit3 } from "lucide-react";

import { DashboardHeader } from "@/components/dashboard-header";

import { ProfileOverview } from "./profile-overview";
import { ActivityStats } from "./activity-stats";
import { ProfileInfo } from "./profile-info";
import { SecuritySettings } from "./security-settings";
import { NotificationPreferences } from "./notification-preferences";
import { DeleteAccount } from "./delete-account";

interface ProfilePageProps {
  profile: IUser;
  numberOfBlogs: number;
  numberOfEvents: number;
  numberOfTeamMembers: number;
}

export function ProfilePage({
  profile,
  numberOfBlogs,
  numberOfEvents,
  numberOfTeamMembers,
}: ProfilePageProps) {
  const stats = [
    {
      title: "Blog Posts Created",
      value: numberOfBlogs,
      icon: Edit3,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Events Managed",
      value: numberOfEvents,
      icon: Calendar,
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      title: "Team Members Added",
      value: numberOfTeamMembers,
      icon: User,
      gradient: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Profile" breadcrumbs={[{ label: "Profile" }]} />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Overview */}
        <ProfileOverview profile={profile} />

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Activity Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <ActivityStats key={index} {...stat} />
            ))}
          </div>

          {/* Profile Information */}
          <ProfileInfo profile={profile} />

          {/* Security Settings */}
          <SecuritySettings profile={profile} />

          {/* Notification Preferences */}
          <NotificationPreferences profile={profile} />

          {/* Delete Account */}
          <DeleteAccount userId={profile?.id} />
        </div>
      </div>
    </div>
  );
}
