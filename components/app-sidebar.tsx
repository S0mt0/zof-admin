"use client";

import type * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  FileText,
  Users,
  Home,
  Settings,
  LogOut,
  User,
  MessageSquare,
  Heart,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

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
  {
    title: "Donations",
    url: "/donations",
    icon: Heart,
    gradient: "from-rose-400 to-rose-600",
  },
  {
    title: "Team Members",
    url: "/team",
    icon: Users,
    gradient: "from-orange-400 to-orange-600",
  },
];

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      console.log("Logging out user...");
      // Clear any stored authentication tokens
      localStorage.removeItem("authToken");
      sessionStorage.clear();
      router.push("/auth/login");
    }
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">ZOF</span>
          </div> */}
          {/* <Image
            height={200}
            width={200}
            src={"/zof-logo.png"}
            alt="@ZOF_LOGO"
            className="w-14 h-auto"
            priority
          /> */}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold">Zita Onyeka Foundation</span>
            <span className="truncate text-xs text-muted-foreground">
              Admin Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-12 px-3 group hover:bg-sidebar-accent/50 transition-colors duration-200"
                  >
                    <Link href={item.url} className="flex items-center gap-4">
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="h-12 px-3 group hover:bg-sidebar-accent/50 transition-colors duration-200"
                  >
                    <Link href={item.url} className="flex items-center gap-4">
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Admin"
                    />
                    <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin User</span>
                    <span className="truncate text-xs">
                      admin@zitaonyeka.org
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/profile" className="flex items-center gap-4">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/settings" className="flex items-center gap-4">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
