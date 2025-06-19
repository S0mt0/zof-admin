"use client"

import type * as React from "react"
import { Calendar, FileText, Users, Home, Settings, LogOut, User } from "lucide-react"

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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    gradient: "from-blue-400 to-blue-600",
    hoverGradient: "from-blue-500 to-blue-700",
  },
  {
    title: "Blog Posts",
    url: "/blogs",
    icon: FileText,
    gradient: "from-emerald-400 to-emerald-600",
    hoverGradient: "from-emerald-500 to-emerald-700",
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
    gradient: "from-purple-400 to-purple-600",
    hoverGradient: "from-purple-500 to-purple-700",
  },
  {
    title: "Team Members",
    url: "/team",
    icon: Users,
    gradient: "from-orange-400 to-orange-600",
    hoverGradient: "from-orange-500 to-orange-700",
  },
]

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    gradient: "from-gray-400 to-gray-600",
    hoverGradient: "from-gray-500 to-gray-700",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    gradient: "from-indigo-400 to-indigo-600",
    hoverGradient: "from-indigo-500 to-indigo-700",
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">ZOF</span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Zita Onyeka Foundation</span>
            <span className="truncate text-xs text-muted-foreground">Admin Dashboard</span>
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
                  <SidebarMenuButton asChild className="h-12 px-3 group">
                    <a href={item.url} className="flex items-center gap-4">
                      <div
                        className={`relative h-8 w-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 group-hover:bg-gradient-to-br group-hover:${item.hoverGradient} group-hover:scale-110 group-hover:shadow-xl`}
                      >
                        <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm"></div>
                        <item.icon className="h-4 w-4 text-white relative z-10" />
                      </div>
                      <span className="font-medium text-sm">{item.title}</span>
                    </a>
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
                  <SidebarMenuButton asChild className="h-12 px-3 group">
                    <a href={item.url} className="flex items-center gap-4">
                      <div
                        className={`relative h-8 w-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300 group-hover:bg-gradient-to-br group-hover:${item.hoverGradient} group-hover:scale-110 group-hover:shadow-xl`}
                      >
                        <div className="absolute inset-0 rounded-lg bg-white/10 backdrop-blur-sm"></div>
                        <item.icon className="h-4 w-4 text-white relative z-10" />
                      </div>
                      <span className="font-medium text-sm">{item.title}</span>
                    </a>
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
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin User</span>
                    <span className="truncate text-xs">admin@zitaonyeka.org</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
