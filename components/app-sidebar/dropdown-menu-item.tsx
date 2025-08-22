"use client";

import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { LucideIconType } from "../activity-stats";

interface DropdownMenuItemProps {
  href: string;
  icon?: any;
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenuItemWithClose = ({
  href,
  icon: Icon,
  children,
  className,
}: DropdownMenuItemProps) => {
  const { setOpenMobile } = useSidebar();

  const handleClick = () => {
    // Close mobile sidebar when dropdown menu item is clicked
    setOpenMobile(false);
  };

  return (
    <DropdownMenuItem className={className}>
      <Link
        href={href}
        onClick={handleClick}
        className="flex items-center gap-4"
      >
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Link>
    </DropdownMenuItem>
  );
};
