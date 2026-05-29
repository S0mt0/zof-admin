import { getGalleryPageData, updateGalleryPageData } from "./core.service";

export const updateGalleryHeroContent = (values: GalleryHeroSectionContent) =>
  getGalleryPageData().then((page) =>
    updateGalleryPageData({
      hero: { set: { ...page.hero, ...values } },
    })
  );

export const updateGalleryArchiveContent = (
  values: GalleryArchiveSectionContent
) =>
  getGalleryPageData().then((page) =>
    updateGalleryPageData({
      archive: { set: { ...page.archive, ...values } },
    })
  );
