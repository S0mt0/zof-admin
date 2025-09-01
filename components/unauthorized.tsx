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
}

export function Unauthorized({
  onGoBack,
  showBackButton = true,
}: UnauthorizedProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <DashboardHeader breadcrumbs={[{ label: "Unauthorized" }]} />

      <Card className="w-full max-w-md text-center">
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
            You don't have permission to access this page. Administrator
            privileges are required.
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
  );
}
