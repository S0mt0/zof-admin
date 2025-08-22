import { db } from "../config";

export async function getAppStats(userId?: string) {
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

export async function getBlogsStats() {
  try {
    const [total, published, draft, scheduled, featured] = await Promise.all([
      db.blog.count(),
      db.blog.count({ where: { status: "published" } }),
      db.blog.count({ where: { status: "draft" } }),
      db.blog.count({ where: { status: "scheduled" } }),
      db.blog.count({ where: { featured: true } }),
    ]);

    return { total, published, draft, scheduled, featured };
  } catch (error) {
    console.log("Error fetching blogs stats: ", error);
    return { total: 0, published: 0, draft: 0, scheduled: 0, featured: 0 };
  }
}

export async function getEventsStats() {
  try {
    const [total, upcoming, completed, draft, featured] = await Promise.all([
      db.event.count(),
      db.event.count({ where: { status: "upcoming" } }),
      db.event.count({ where: { status: "completed" } }),
      db.event.count({ where: { status: "draft" } }),
      db.event.count({ where: { featured: true } }),
    ]);

    return { total, upcoming, completed, draft, featured };
  } catch (error) {
    console.log("Error fetching blogs stats: ", error);
    return { total: 0, upcoming: 0, completed: 0, draft: 0, featured: 0 };
  }
}
