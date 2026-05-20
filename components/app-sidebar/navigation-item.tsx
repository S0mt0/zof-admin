"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ElementType } from "react";
import {
  BarChart3,
  Calendar,
  ChevronRight,
  CircleHelp,
  Contact,
  FileText,
  Heart,
  Home,
  ImageIcon,
  Info,
  LayoutDashboard,
  MessageSquareQuote,
  Palette,
  PlaySquare,
  Sparkles,
  Users,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

const dashboardItem = {
  title: "Dashboard",
  url: "/",
  icon: Home,
  gradient: "from-blue-400 to-blue-600",
};

const landingItems = [
  { title: "FAQs", url: "/landing/faqs", icon: CircleHelp },
  { title: "Testimonials", url: "/landing/testimonials", icon: MessageSquareQuote },
  { title: "Stats", url: "/landing/stats", icon: BarChart3 },
  { title: "Extra", url: "/landing/extra", icon: Sparkles },
];

const aboutItems = [
  { title: "About Us", url: "/about", icon: Info },
  { title: "Team", url: "/team", icon: Users },
  { title: "Volunteers", url: "/volunteers", icon: Heart },
];

const contactItems = [
  { title: "Info", url: "/contact/info", icon: Contact },
  { title: "Messages", url: "/contact/messages", icon: MessageSquareQuote },
];

const pageItems = [
  { title: "Blogs", url: "/blogs", icon: FileText },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Photo Gallery", url: "/media", icon: ImageIcon },
  { title: "Donations", url: "/donations", icon: Heart },
];

const isPathActive = (pathname: string, url: string) => {
  if (url === "/") return pathname === "/";
  const cleanUrl = url.split("#")[0];
  return pathname === cleanUrl || pathname.startsWith(`${cleanUrl}/`);
};

export const NavigationItems = () => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleClick = () => {
    setOpenMobile(false);
  };

  const pagesOpen =
    landingItems.some((item) => isPathActive(pathname, item.url)) ||
    aboutItems.some((item) => isPathActive(pathname, item.url)) ||
    contactItems.some((item) => isPathActive(pathname, item.url)) ||
    pageItems.some((item) => isPathActive(pathname, item.url));

  const landingOpen = landingItems.some((item) =>
    isPathActive(pathname, item.url)
  );
  const aboutOpen = aboutItems.some((item) => isPathActive(pathname, item.url));
  const contactOpen = contactItems.some((item) =>
    isPathActive(pathname, item.url)
  );

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isPathActive(pathname, dashboardItem.url)}
          className="h-12 px-3 group hover:bg-sidebar-accent/50 transition-colors duration-200"
        >
          <Link
            href={dashboardItem.url}
            onClick={handleClick}
            className="flex items-center gap-4"
          >
            <div
              className={`h-8 w-8 rounded-lg bg-gradient-to-br ${dashboardItem.gradient} flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105`}
            >
              <dashboardItem.icon className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-sm">{dashboardItem.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <Collapsible defaultOpen={pagesOpen} className="group/pages">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="h-12 px-3 group hover:bg-sidebar-accent/50 transition-colors duration-200">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-sm">Pages</span>
              <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/pages:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub className="mt-1">
              <SidebarNestedSection
                title="Landing"
                icon={Palette}
                defaultOpen={landingOpen}
                items={landingItems}
                pathname={pathname}
                onNavigate={handleClick}
              />
              <SidebarNestedSection
                title="About"
                icon={Info}
                defaultOpen={aboutOpen}
                items={aboutItems}
                pathname={pathname}
                onNavigate={handleClick}
              />
              <SidebarNestedSection
                title="Contact"
                icon={Contact}
                defaultOpen={contactOpen}
                items={contactItems}
                pathname={pathname}
                onNavigate={handleClick}
              />

              {pageItems.map((item) => (
                <SidebarMenuSubItem key={item.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isPathActive(pathname, item.url)}
                  >
                    <Link href={item.url} onClick={handleClick}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </>
  );
};

function SidebarNestedSection({
  title,
  icon: Icon,
  defaultOpen,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  icon: ElementType;
  defaultOpen: boolean;
  items: { title: string; url: string; icon: ElementType }[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <SidebarMenuSubItem>
      <Collapsible defaultOpen={defaultOpen} className="group/section">
        <CollapsibleTrigger className="flex h-7 w-full items-center gap-2 rounded-md px-2 text-sm text-sidebar-foreground outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <Icon className="h-4 w-4 text-sidebar-accent-foreground" />
          <span className="truncate">{title}</span>
          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/section:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="ml-4 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-2">
            {items.map((item) => (
              <SidebarMenuSubItem key={item.title}>
                <SidebarMenuSubButton
                  asChild
                  size="sm"
                  isActive={isPathActive(pathname, item.url)}
                >
                  <Link href={item.url} onClick={onNavigate}>
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuSubItem>
  );
}
