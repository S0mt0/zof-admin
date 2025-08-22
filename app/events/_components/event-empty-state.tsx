"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EventEmptyState() {
  const router = useRouter();
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Calendar className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <p className="text-base font-medium">No events yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first event to start organizing activities.
          </p>
        </div>
        <Button onClick={() => router.push("/events/new")}>Create Event</Button>
      </CardContent>
    </Card>
  );
}
