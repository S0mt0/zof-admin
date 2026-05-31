"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ElementType } from "react";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Contact,
  FileText,
  Gift,
  Grid,
  Heart,
  Home,
  ImageIcon,
  Info,
  LayoutDashboard,
  Library,
  List,
  LucideLayoutPanelLeft,
  MapPin,
  MessageSquareQuote,
  Palette,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { BiSolidDonateHeart } from "react-icons/bi";

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
import { cn } from "@/lib/utils";

const dashboardItem = {
  title: "Dashboard",
  url: "/",
  icon: Home,
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
  { title: "Archive", url: "/events-and-programmes/archive", icon: Grid },
  { type: "separator", title: "Manage Events" },
  { title: "Events", url: "/events-and-programmes/manage", icon: Calendar },
] satisfies SidebarNestedItem[];

const contactItems = [
  { title: "Info", url: "/contact/info", icon: Contact },
  { title: "Messages", url: "/contact/messages", icon: MessageSquareQuote },
];

const donationItems = [
  { title: "Aside", url: "/donations/aside", icon: LucideLayoutPanelLeft },
  { type: "separator", title: "Manage Donations" },
  { title: "Campaigns", url: "/donations/campaigns", icon: List },
  { title: "Donations", url: "/donations/manage", icon: BiSolidDonateHeart },
] satisfies SidebarNestedItem[];

const galleryItems = [
  { title: "Hero", url: "/media/hero", icon: Sparkles },
  { title: "Archive", url: "/media/archive", icon: Grid },
  { type: "separator", title: "Manage Gallery" },
  { title: "Media", url: "/media/manage", icon: ImageIcon },
] satisfies SidebarNestedItem[];

const isPathActive = (pathname: string, url: string) => {
  if (url === "/") return pathname === "/";
  const cleanUrl = url.split("#")[0];
  return pathname === cleanUrl || pathname.startsWith(`${cleanUrl}/`);
};

const isNestedItemActive = (pathname: string, item: SidebarNestedItem) =>
  item.type === "separator" ? false : isPathActive(pathname, item.url);

const navStorageKey = (key: string) => `zof-admin-sidebar:${key}`;

function usePersistentNavState(key: string, defaultOpen: boolean) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const stored = window.localStorage.getItem(navStorageKey(key));
    setOpen(defaultOpen || stored === "true");
  }, [defaultOpen, key]);

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    window.localStorage.setItem(navStorageKey(key), String(nextOpen));
  };

  return [open, onOpenChange] as const;
}

export const NavigationItems = ({ role }: { role?: string }) => {
  const canManageDonations = role === "admin";
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
    (canManageDonations &&
      donationItems.some((item) => isNestedItemActive(pathname, item))) ||
    contactItems.some((item) => isPathActive(pathname, item.url)) ||
    galleryItems.some((item) => isNestedItemActive(pathname, item));

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
  const donationOpen =
    canManageDonations &&
    donationItems.some((item) => isNestedItemActive(pathname, item));
  const galleryOpen = galleryItems.some((item) =>
    isNestedItemActive(pathname, item)
  );
  const [isPagesOpen, setPagesOpen] = usePersistentNavState("pages", pagesOpen);

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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground transition-colors duration-200 group-hover:border-primary/30 group-hover:text-primary">
              <dashboardItem.icon className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm">{dashboardItem.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <Collapsible
          open={isPagesOpen}
          onOpenChange={setPagesOpen}
          className="group/pages"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="h-12 px-3 group hover:bg-sidebar-accent/50 transition-colors duration-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-accent/60 text-sidebar-foreground transition-colors duration-200 group-hover:border-primary/30 group-hover:text-primary">
                <LayoutDashboard className="h-4 w-4" />
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
                storageKey="landing"
                items={landingItems}
                pathname={pathname}
                onNavigate={handleClick}
              />
              <SidebarNestedSection
                title="About"
                icon={Info}
                defaultOpen={aboutOpen}
                storageKey="about"
                items={aboutItems}
                pathname={pathname}
                onNavigate={handleClick}
              />
              <SidebarNestedSection
                title="Blogs & Articles"
                icon={BookOpen}
                defaultOpen={blogsOpen}
                storageKey="blogs"
                items={blogsItems}
                pathname={pathname}
                onNavigate={handleClick}
              />
              <SidebarNestedSection
                title="Events"
                icon={MapPin}
                defaultOpen={eventsOpen}
                storageKey="events"
                items={eventsItems}
                pathname={pathname}
                onNavigate={handleClick}
              />
              {canManageDonations ? (
                <SidebarNestedSection
                  title="Donations"
                  icon={Gift}
                  defaultOpen={donationOpen}
                  storageKey="donations"
                  items={donationItems}
                  pathname={pathname}
                  onNavigate={handleClick}
                />
              ) : null}
              <SidebarNestedSection
                title="Contact"
                icon={Contact}
                defaultOpen={contactOpen}
                storageKey="contact"
                items={contactItems}
                pathname={pathname}
                onNavigate={handleClick}
              />

              <SidebarNestedSection
                title="Photo Gallery"
                icon={ImageIcon}
                defaultOpen={galleryOpen}
                storageKey="gallery"
                items={galleryItems}
                pathname={pathname}
                onNavigate={handleClick}
              />
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
  storageKey,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  icon: ElementType;
  defaultOpen: boolean;
  storageKey: string;
  items: SidebarNestedItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = usePersistentNavState(storageKey, defaultOpen);
  const hasActiveDescendant = items.some((item) =>
    isNestedItemActive(pathname, item)
  );

  return (
    <SidebarMenuSubItem>
      <Collapsible open={open} onOpenChange={setOpen} className="group/section">
        <CollapsibleTrigger
          className={cn(
            "flex h-7 w-full items-center gap-2 rounded-md px-2 text-sm text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            hasActiveDescendant &&
              "hover:bg-primary/15 hover:text-primary bg-sidebar-accent/35"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4 text-sidebar-accent-foreground transition-colors"
            )}
          />
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

              const active = isPathActive(pathname, item.url);

              return (
                <SidebarMenuSubItem key={item.title}>
                  <SidebarMenuSubButton
                    asChild
                    size="sm"
                    isActive={active}
                    className={cn(
                      "transition-colors hover:bg-primary/10 [&:hover>svg]:text-primary data-[active=true]:bg-primary/10",
                      active &&
                        "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary [&>svg]:text-primary"
                    )}
                  >
                    <Link href={item.url} onClick={onNavigate}>
                      <item.icon className="h-3.5 w-3.5 transition-colors" />
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
