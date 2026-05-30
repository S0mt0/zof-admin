import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type LucideIconType = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

interface ActivityStatsProps {
  title: string;
  value: number;
  icon: LucideIconType;
  gradient?: string;
}

export const ActivityStats = ({
  title,
  value,
  icon: Icon,
}: ActivityStatsProps) => {
  return (
    <Card key={title} className="border-border/80 transition-colors duration-200 hover:border-primary/25">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 xs:px-6 gap-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
