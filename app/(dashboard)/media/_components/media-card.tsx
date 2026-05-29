"use client";

import Image from "next/image";
import { ExternalLink, Film, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const isExternalMedia = (item: MediaRecord) =>
  item.type === "video" &&
  (item.srcKey?.startsWith("external:") ||
    /youtu\.?be|youtube\.com/i.test(item.src));

export function MediaCard({
  item,
  checked,
  isPending,
  onCheckedChange,
  onDelete,
  onEdit,
}: {
  item: MediaRecord;
  checked: boolean;
  isPending: boolean;
  onCheckedChange: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const label =
    item.type === "photo" ? item.alt : item.title || item.caption || "Video";
  const preview = item.type === "photo" ? item.src : item.poster;
  const external = isExternalMedia(item);

  return (
    <div className="grid gap-4 border-b p-4 transition-colors hover:bg-muted/30 last:border-b-0 sm:grid-cols-[auto_88px_1fr_auto] sm:items-center">
      <div className="flex items-center gap-3 sm:block">
        <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground sm:hidden">
          Select
        </span>
      </div>

      <div className="relative h-24 w-24 overflow-hidden rounded-xl border bg-muted sm:h-24 sm:w-24">
        {preview ? (
          <Image
            src={preview}
            alt={label || "Media preview"}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : null}
        {item.type === "video" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 text-white">
              <Film className="h-4 w-4" />
            </span>
          </div>
        ) : null}
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {item.type}
          </Badge>
          {external ? (
            <Badge className="gap-1 bg-red-50 text-red-700 hover:bg-red-50">
              <ExternalLink className="h-3 w-3" />
              YouTube
            </Badge>
          ) : null}
          <span className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="line-clamp-1 font-semibold text-foreground">{label}</p>
        {item.caption || item.description ? (
          <p className="line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {item.caption || item.description}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          disabled={isPending}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={isPending}
          className="text-red-600 hover:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
