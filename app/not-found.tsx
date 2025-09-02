"use client";

import { FileX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";

interface NotFoundProps {
  onGoBack?: () => void;
  onGoHome?: () => void;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}

export default function NotFound({
  onGoBack,
  showBackButton = true,
  showHomeButton = true,
}: NotFoundProps) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-4 min-h-[calc(100vh_-_4rem)]">
      <DashboardHeader breadcrumbs={[{ label: "Page Not Found" }]} />

      <div className="flex items-center justify-center p-4 h-full w-full -mt-14">
        <Card className="w-full max-w-md text-center">
          <CardHeader className="pb-4">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "hsl(142, 76%, 36%)" }}
            >
              <FileX className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {showHomeButton && (
              <Button className="w-full cursor-pointer" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            )}
            {showBackButton && (
              <Button
                onClick={onGoBack || (() => router.back())}
                variant="outline"
                className="w-full cursor-pointer"
              >
                Go Back
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
