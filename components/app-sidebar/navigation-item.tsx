"use client";

import Link from "next/link";
import {
  Calendar,
  FileText,
  Users,
  Home,
  MessageSquare,
  Heart,
} from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    gradient: "from-blue-400 to-blue-600",
  },
  {
    title: "Blog Posts",
    url: "/blogs",
    icon: FileText,
    gradient: "from-emerald-400 to-emerald-600",
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
    gradient: "from-purple-400 to-purple-600",
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    gradient: "from-pink-400 to-pink-600",
  },
  // {
  //   title: "Donations",
  //   url: "/donations",
  //   icon: Heart,
  //   gradient: "from-rose-400 to-rose-600",
  // },
  {
    title: "Team Members",
    url: "/team",
    icon: Users,
    gradient: "from-orange-400 to-orange-600",
  },
];

export const NavigationItems = () => {
  const { setOpenMobile } = useSidebar();

  const handleClick = () => {
    // Close mobile sidebar when navigation item is clicked
    setOpenMobile(false);
  };

  return (
    <>
      {navigationItems.map((item) => (
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
