"use client";
import { useSession } from "next-auth/react";

import { logout } from "@/lib/actions/logout";
import { cn } from "@/lib/utils";

export const LogoutButton = ({
  children,
  className,
  userId,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  userId: string;
}) => {
  const { update } = useSession();

  const handleLogout = () => {
    logout(userId).then(() => update());
  };
  return (
    <span onClick={handleLogout} className={cn(className)}>
      {children}
    </span>
  );
};
