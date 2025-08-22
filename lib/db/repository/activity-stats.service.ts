import { db } from "../config";

export async function getActivityStats(userId?: string) {
  try {
    const [blogs, events, team, messages] = await Promise.all([
      db.blog.count({ where: userId ? { createdBy: userId } : {} }),
      db.event.count({ where: userId ? { createdBy: userId } : {} }),
      db.teamMember.count({
        where: userId ? { addedBy: userId } : {},
      }),
      db.message.count(), // Receipient or sender does not matter, so just count all
    ]);

    return { blogs, events, team, messages };
  } catch (error) {
    console.log("Error fetching acivity stats: ", error);
    return { blogs: 0, events: 0, team: 0, messages: 0 };
  }
}
