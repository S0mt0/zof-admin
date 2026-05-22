"use client";

import { ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "./dashboard-header";
import { useRouter } from "next/navigation";

interface UnauthorizedProps {
  onGoBack?: () => void;
  showBackButton?: boolean;
  message?: string;
}

export function Unauthorized({
  onGoBack,
  showBackButton = true,
  message = "You don’t have access to this page. Please contact an administrator if you believe this is an error",
}: UnauthorizedProps) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-4 min-h-[calc(100vh_-_4rem)]">
      <DashboardHeader breadcrumbs={[{ label: "Unauthorized" }]} />

      <div className="flex items-center justify-center p-4 h-full w-full -mt-14">
        <Card className="w-full max-w-md text-center shadow-none">
          <CardHeader className="pb-4">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "hsl(142, 76%, 36%)" }}
            >
              <ShieldX className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">
              Access Denied
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
