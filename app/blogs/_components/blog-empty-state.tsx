"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BlogEmptyState() {
  const router = useRouter();
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <FileText className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <p className="text-base font-medium">No blog posts yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first blog post to start sharing your content.
          </p>
        </div>
        <Button onClick={() => router.push("/blogs/new")}>
          Create Blog Post
        </Button>
      </CardContent>
    </Card>
  );
}
