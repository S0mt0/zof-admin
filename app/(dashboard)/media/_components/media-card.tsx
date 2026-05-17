"use client";

import Image from "next/image";
import { Film, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export function MediaCard({
  item,
  checked,
  isPending,
  onCheckedChange,
  onDelete,
}: {
  item: MediaRecord;
  checked: boolean;
  isPending: boolean;
  onCheckedChange: () => void;
  onDelete: () => void;
}) {
  const label =
    item.type === "photo" ? item.alt : item.title || item.caption || "Video";

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] bg-muted">
        {item.type === "photo" ? (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <>
            {item.poster ? (
              <Image
                src={item.poster}
                alt={item.title || "Video poster"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60">
                <Film className="h-6 w-6 text-white" />
              </div>
            </div>
          </>
        )}

        <div className="absolute left-3 top-3">
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
        </div>

        <div className="absolute right-3 top-3">
          <Badge variant="secondary" className="capitalize">
            {item.type}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-2 p-4">
        <div className="space-y-1">
          <p className="line-clamp-1 font-medium">{label}</p>
          {item.caption ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {item.caption}
            </p>
          ) : null}
        </div>

        {item.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
        <span>
          {new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
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
      </CardFooter>
    </Card>
  );
}
