import { getBlogsPageData, updateBlogsPageData } from "./core.service";

export const updateBlogsHeroSettings = (values: BlogsHeroSectionContent) =>
  getBlogsPageData().then((page) =>
    updateBlogsPageData({
      hero: { set: { ...page.hero, ...values } },
    })
  );
