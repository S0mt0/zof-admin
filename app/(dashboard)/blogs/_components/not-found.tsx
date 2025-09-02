import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const BlogNotFound = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader title="Blog Post Not Found" />
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            The blog post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link
              href="/blogs"
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog Posts
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
