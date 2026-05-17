"use client";

import { ImagePlus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function MediaEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <ImagePlus className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <p className="text-base font-medium">No media items yet</p>
          <p className="text-sm text-muted-foreground">
            Upload your first photo or video to start building the media
            library.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
