import { db } from "../config";

export async function getActivityStats(userId?: string) {
  try {
    const [blogs, events, team, messages] = await Promise.all([
      db.blog.count(userId ? { where: { authorId: userId } } : undefined),
      db.event.count(userId ? { where: { organizerId: userId } } : undefined),
      db.teamMember.count(userId ? { where: { addedBy: userId } } : undefined),
      db.message.count(), // Receipiebt or sender does not matter, so just count all
    ]);

    return { blogs, events, team, messages };
  } catch (error) {
    console.log("Error fetching acivity stats: ", error);
    return { blogs: 0, events: 0, team: 0, messages: 0 };
  }
}
