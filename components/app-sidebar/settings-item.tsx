"use client";

import Link from "next/link";
import { Settings, User } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    gradient: "from-gray-400 to-gray-600",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    gradient: "from-indigo-400 to-indigo-600",
  },
];

export const SettingsItems = () => {
  const { setOpenMobile } = useSidebar();

  const handleClick = () => {
    // Close mobile sidebar when settings item is clicked
    setOpenMobile(false);
  };

  return (
    <>
      {settingsItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className="h-12 px-3 group hover:bg-sidebar-accent/50 transition-colors duration-200"
          >
            <Link
              href={item.url}
              onClick={handleClick}
              className="flex items-center gap-4"
            >
              <div
                className={`h-8 w-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105`}
              >
                <item.icon className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-sm">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};
