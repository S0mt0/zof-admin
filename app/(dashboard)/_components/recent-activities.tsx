import { unstable_cache } from "next/cache";

import { Pagination } from "@/components/ui/pagination-v2";
import { getRecentActivities } from "@/lib/db/repository/user-activity.service";

export async function RecentActivities({
  page = 1,
  limit = 5,
  userId,
}: {
  page?: number;
  limit?: number;
  userId: string;
}) {
  const recentActivities = unstable_cache(
    getRecentActivities,
    ["recent-activities"],
    {
      tags: ["recent-activities"],
      revalidate: false,
    }
  );

  const { data, pagination } = await recentActivities(page, limit, userId);

  return (
    <div className="col-span-4 border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {data.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50"
          >
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.title}</p>
            </div>
            <div className="text-sm text-gray-400">
              {new Date(activity.time).toLocaleString()}
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
    </div>
  );
}
