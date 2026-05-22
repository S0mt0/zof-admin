import { Hourglass } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "./dashboard-header";
import { LogoutButton } from "./logout-button";

export function SessionExpired() {
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
              <Hourglass className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">
              Session Expired
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Hey champ, your session has expired. Please log in again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogoutButton>
              <Button variant="outline" className="w-full cursor-pointer">
                Back to login
              </Button>
            </LogoutButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
