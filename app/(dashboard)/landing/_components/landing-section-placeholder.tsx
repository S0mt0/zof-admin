import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LandingSectionPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: title },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            This landing page section is ready for its CMS editor.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Content controls for this section can be added here when the website
          model for it is finalized.
        </CardContent>
      </Card>
    </div>
  );
}
