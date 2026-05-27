import { db } from "../../../config";
import { defaultBlogsPageData } from "./defaults";
import { normalizeBlogsPageData } from "./normalize";

export const getBlogsPageData = async (): Promise<BlogsPageContent> => {
  const existing = await db.blogsPage.findFirst();
  if (existing) return normalizeBlogsPageData(existing);

  const created = await db.blogsPage.create({
    data: defaultBlogsPageData() as any,
  });
  return normalizeBlogsPageData(created);
};

export const updateBlogsPageData = async (data: any) => {
  const page = await getBlogsPageData();
  const updated = await db.blogsPage.update({
    where: { id: page.id },
    data,
  });
  return normalizeBlogsPageData(updated);
};
