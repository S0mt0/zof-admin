"use client";
import { useSession } from "next-auth/react";

import { logout } from "@/lib/actions/logout";
import { cn } from "@/lib/utils";

export const LogoutButton = ({
  children,
  className,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}) => {
  const { update } = useSession();

  const handleLogout = () => {
    logout().then(() => update());
  };
  return (
    <span onClick={handleLogout} className={cn(className)}>
      {children}
    </span>
  );
};
