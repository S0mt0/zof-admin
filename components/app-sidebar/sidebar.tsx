import Image from "next/image";
import { LogOut, User } from "lucide-react";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUser } from "@/lib/utils";
import { LogoutButton } from "../logout-button";
import { NavigationItems } from "./navigation-item";
import { SettingsItems } from "./settings-item";
import { ThemeToggle } from "../theme-toggle";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 py-2">
          <div className="flex items-center justify-start gap-1.5 text-left text-sm leading-tight">
            <Image
              height={200}
              width={200}
              src={"/zof-logo.png"}
              alt="@zof-logo"
              className="w-10 h-auto mx-auto"
              priority
            />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold">Zita Onyeka Foundation</span>
              <span className="truncate text-xs text-muted-foreground">
                Admin Dashboard
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <NavigationItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SettingsItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                    disabled={!user}
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.image} alt="Admin" />
                      <AvatarFallback className="rounded-lg bg-blue-300">
                        <User className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg flex gap-4 justify-between items-center"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <LogoutButton className="w-full">
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-gray-400/20 dark:focus:text-white">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </LogoutButton>
                  <ThemeToggle />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ThemeToggle />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
