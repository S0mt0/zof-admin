import { unstable_cache } from "next/cache";
import { formatDistanceToNow } from "date-fns";

import { Pagination } from "@/components/ui/pagination-v2";
import { getUsersRecentActivities } from "@/lib/db/repository/user-activity.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageOpen } from "lucide-react";

export async function UsersRecentActivities({
  page = 1,
  limit = 5,
  userId,
}: {
  page?: number;
  limit?: number;
  userId: string;
}) {
  const usersRecentActivities = unstable_cache(
    getUsersRecentActivities,
    ["users-recent-activities"],
    {
      tags: ["users-recent-activities"],
      revalidate: 300, // revalidate every 5 mimnutes
    }
  );

  const { data, pagination } = await usersRecentActivities(page, limit, userId);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          {data?.length
            ? "Latest updates across your dashboard"
            : "Your recent activities will appear here"}
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
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50"
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
        />
      </CardContent>
    </Card>
  );
}
