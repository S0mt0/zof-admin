import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { capitalize, getInitials } from "@/lib/utils";

export const AddedByCard = ({
  admin,
}: {
  admin: TeamMember["addedByUser"];
}) => {
  if (!admin) return null;

  return (
    <Collapsible className="pt-2">
      <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-muted/50">
        <span className="truncate">Added by {capitalize(admin.name)}</span>
        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-md border bg-muted/40 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={admin.image || "/placeholder.svg"}
              alt={admin.name || "User"}
            />
            <AvatarFallback>{getInitials(admin.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">
                {capitalize(admin.name)}
              </span>
              {admin.role && (
                <Badge variant="outline" className="text-[10px]">
                  {admin.role}
                </Badge>
              )}
            </div>
            {admin.email && (
              <a
                href={`mailto:${admin.email}`}
                className="text-xs text-blue-600 hover:underline"
              >
                {admin.email}
              </a>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
