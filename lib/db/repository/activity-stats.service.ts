import { db } from "../config";

export async function getActivityStats(userId?: string) {
  try {
    const [blogs, events, team, messages] = await Promise.all([
      db.blog.count(userId ? { where: { authorId: userId } } : ({} as any)),
      db.event.count(userId ? { where: { organizerId: userId } } : ({} as any)),
      db.teamMember.count(
        userId ? { where: { addedBy: userId } } : ({} as any)
      ),
      db.message.count(), // Receipient or sender does not matter, so just count all
    ]);

    return { blogs, events, team, messages };
  } catch (error) {
    console.log("Error fetching acivity stats: ", error);
    return { blogs: 0, events: 0, team: 0, messages: 0 };
  }
}
