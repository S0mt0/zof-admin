import { db } from "../../../config";
import { defaultGalleryPageData } from "./defaults";
import { normalizeGalleryPageData } from "./normalize";

export const getGalleryPageData = async (): Promise<GalleryPageContent> => {
  const existing = await db.galleryPage.findFirst();
  if (existing) return normalizeGalleryPageData(existing);

  const created = await db.galleryPage.create({
    data: defaultGalleryPageData() as any,
  });
  return normalizeGalleryPageData(created);
};

export const updateGalleryPageData = async (data: any) => {
  const page = await getGalleryPageData();
  const updated = await db.galleryPage.update({
    where: { id: page.id },
    data,
  });
  return normalizeGalleryPageData(updated);
};
