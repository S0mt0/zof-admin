import { logout } from "@/lib/actions";
import { cn } from "@/lib/utils";

export const LogoutButton = ({
  children,
  className,
}: {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}) => {
  const handleLogout = () => {
    logout();
  };
  return (
    <span onClick={handleLogout} className={cn(className)}>
      {children}
    </span>
  );
};
