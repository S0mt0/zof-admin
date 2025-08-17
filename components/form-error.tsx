import { TriangleAlert } from "lucide-react";

export const FormError = ({
  message,
  showIcon = true,
}: {
  message?: string;
  showIcon?: boolean;
}) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      {showIcon && <TriangleAlert className="h-4 w-4" />}
      <p> {message}</p>
    </div>
  );
};
