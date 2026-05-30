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
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground transition-colors duration-200 group-hover:border-primary/30 group-hover:text-primary">
                <item.icon className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};
