"use client";

import { logout } from "@/lib/actions/logout";
import { cn } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar";

export const LogoutButton = ({
  children,
  className,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}) => {
  const { setOpenMobile } = useSidebar();

  const handleLogout = () => {
    setOpenMobile(false);
    logout();
  };
  return (
    <span onClick={handleLogout} className={cn(className)}>
      {children}
    </span>
  );
};
