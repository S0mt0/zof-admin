import type { ReactNode } from "react";
import { Edit, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

export function ItemCard({
  dragHandle,
  title,
  meta,
  description,
  published,
  avatar,
  onEdit,
  onDelete,
}: {
  dragHandle: ReactNode;
  title: string;
  meta: string;
  description: string;
  published: boolean;
  avatar?: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex gap-3 rounded-xl border bg-background p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      {dragHandle}
      {avatar ? (
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage src={avatar} />
          <AvatarFallback className="rounded-lg">
            {getInitials(title)}
          </AvatarFallback>
        </Avatar>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-bold leading-tight">{title}</h3>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {meta}
            </p>
          </div>
          <Badge variant={published ? "default" : "secondary"}>
            {published ? "Published" : "Draft"}
          </Badge>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-600"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
