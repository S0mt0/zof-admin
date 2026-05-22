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
  gradient: string;
}

export const ActivityStats = ({
  title,
  value,
  icon: Icon,
  gradient,
}: ActivityStatsProps) => {
  return (
    <Card
      key={title}
      className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 xs:px-6 gap-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={`h-8 w-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
