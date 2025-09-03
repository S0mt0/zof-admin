import { formatDistanceToNow } from "date-fns";
import { AppActivity } from "@prisma/client";
import { PackageOpen } from "lucide-react";

import { Pagination } from "@/components/ui/pagination-v2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function AppActivities({
  data,
  pagination,
}: Paginated<AppActivity>) {
  return (
    <Card className="col-span-4 max-w-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          {data?.length
            ? "Latest updates across your dashboard"
            : "There are no recent activites or updates yet"}
        </CardDescription>
      </CardHeader>

      {!data?.length && (
        <div className="flex items-center justify-center w-full mt-10">
          <PackageOpen className="w-14 h-14 text-muted-foreground/30" />
        </div>
      )}

      <CardContent>
        <div className="space-y-4">
          {data.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50/10"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
              <div className="text-sm text-gray-400">
                {formatDistanceToNow(activity.time, {
                  addSuffix: true,
                })}
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          showingStart={(pagination.page - 1) * pagination.limit + 1}
          showingEnd={Math.min(
            pagination.page * pagination.limit,
            pagination.total
          )}
          totalItems={pagination.total}
          itemName="activities"
          limit={pagination.limit}
        />
      </CardContent>
    </Card>
  );
}
