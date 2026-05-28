"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ElementType } from "react";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Contact,
  FileText,
  Heart,
  Home,
  ImageIcon,
  Info,
  LayoutDashboard,
  Library,
  MapPin,
  MessageSquareQuote,
  Palette,
  Sparkles,
  Target,
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

type SidebarNestedItem =
  | { title: string; url: string; icon: ElementType; type?: never }
  | { title: string; type: "separator"; url?: never; icon?: never };

const landingItems = [
  { title: "Hero", url: "/landing/hero", icon: Sparkles },
  { title: "Who We Are", url: "/landing/about", icon: Info },
  { title: "Values", url: "/landing/values", icon: Target },
  { title: "Volunteers", url: "/landing/volunteers", icon: Heart },
  { title: "Impact", url: "/landing/impact", icon: LayoutDashboard },
  {
    title: "Testimonials",
    url: "/landing/testimonials",
    icon: MessageSquareQuote,
  },
  { title: "Featured Blogs", url: "/landing/featured-blogs", icon: FileText },
  { title: "Featured Events", url: "/landing/featured-events", icon: Calendar },
  { title: "FAQs", url: "/landing/faqs", icon: MessageSquareQuote },
];

const aboutItems = [
  { title: "Hero", url: "/about/hero", icon: Sparkles },
  { title: "Story", url: "/about/story", icon: Info },
  { title: "Team Section", url: "/about/team-section-copy", icon: Users },
  {
    title: "Founder’s Message",
    url: "/about/founder-message",
    icon: MessageSquareQuote,
  },
  { title: "CTA", url: "/about/cta", icon: Target },
  { type: "separator", title: "People" },
  { title: "Team Members", url: "/about/team", icon: Users },
  { title: "Volunteers", url: "/about/volunteers", icon: Heart },
] satisfies SidebarNestedItem[];

const blogsItems = [
  { title: "Hero", url: "/blogs-and-articles/hero", icon: Sparkles },
  { type: "separator", title: "Manage Blogs" },
  { title: "Blogs", url: "/blogs-and-articles/manage", icon: Library },
] satisfies SidebarNestedItem[];

const eventsItems = [
  { title: "Hero", url: "/events-and-programmes/hero", icon: Sparkles },
  { type: "separator", title: "Manage Events" },
  { title: "Events", url: "/events-and-programmes/manage", icon: Calendar },
] satisfies SidebarNestedItem[];

const contactItems = [
  { title: "Info", url: "/contact/info", icon: Contact },
  { title: "Messages", url: "/contact/messages", icon: MessageSquareQuote },
];

const pageItems = [
  { title: "Photo Gallery", url: "/media", icon: ImageIcon },
  { title: "Donations", url: "/donations", icon: Heart },
];

const isPathActive = (pathname: string, url: string) => {
  if (url === "/") return pathname === "/";
  const cleanUrl = url.split("#")[0];
  return pathname === cleanUrl || pathname.startsWith(`${cleanUrl}/`);
};

const isNestedItemActive = (pathname: string, item: SidebarNestedItem) =>
  item.type === "separator" ? false : isPathActive(pathname, item.url);

export const NavigationItems = () => {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleClick = () => {
    setOpenMobile(false);
  };

  const pagesOpen =
    landingItems.some((item) => isPathActive(pathname, item.url)) ||
    aboutItems.some((item) => isNestedItemActive(pathname, item)) ||
    blogsItems.some((item) => isNestedItemActive(pathname, item)) ||
    eventsItems.some((item) => isNestedItemActive(pathname, item)) ||
    contactItems.some((item) => isPathActive(pathname, item.url)) ||
    pageItems.some((item) => isPathActive(pathname, item.url));

  const landingOpen = landingItems.some((item) =>
    isPathActive(pathname, item.url)
  );
  const aboutOpen = aboutItems.some((item) =>
    isNestedItemActive(pathname, item)
  );
  const blogsOpen = blogsItems.some((item) =>
    isNestedItemActive(pathname, item)
  );
  const eventsOpen = eventsItems.some((item) =>
    isNestedItemActive(pathname, item)
  );
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
                title="Blogs & Articles"
                icon={BookOpen}
                defaultOpen={blogsOpen}
                items={blogsItems}
                pathname={pathname}
                onNavigate={handleClick}
              />
              <SidebarNestedSection
                title="Events"
                icon={MapPin}
                defaultOpen={eventsOpen}
                items={eventsItems}
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
  items: SidebarNestedItem[];
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
            {items.map((item) => {
              if (item.type === "separator") {
                return (
                  <li
                    key={item.title}
                    className="px-2 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-sidebar-foreground/45"
                  >
                    {item.title}
                  </li>
                );
              }

              return (
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
              );
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuSubItem>
  );
}
