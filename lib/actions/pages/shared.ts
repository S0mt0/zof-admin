import * as z from "zod";

import { EDITORIAL_ROLES } from "@/lib/constants";
import { addAppActivity } from "@/lib/db/repository/app-activity.service";
import { getLandingPageData, type CardSection } from "@/lib/db/repository/pages";
import { getUserById } from "@/lib/db/repository/user.service";
import { currentUser } from "@/lib/utils/auth.utils";

export const IdsSchema = z.array(z.string().min(1));

const MAX_PUBLISHED_CARDS = 3;
const MAX_PUBLISHED_STATS = 4;

export const getAuthorizedUser = async () => {
  const userId = (await currentUser())?.id;
  const user = await getUserById(userId || "");

  if (!user) return { error: "Invalid session, please login again." };
  if (!EDITORIAL_ROLES.includes(user.role)) return { error: "Unauthorized" };

  return { user };
};

export const sectionPath = (section: string) => `/landing/${section}`;

export const logLandingActivity = (
  title: string,
  userName: string,
  role: string
) =>
  addAppActivity(title, `${userName} (${role}) updated landing page content`);

const getPublishedCardCount = (
  section: CardSection,
  idToIgnore?: string
) =>
  getLandingPageData().then((page) => {
    const cards = section === "about" ? page.about.cards : page.values.cards;
    return cards.filter((card) => card.published && card.id !== idToIgnore)
      .length;
  });

export const validateCardPublishLimit = async (
  section: CardSection,
  published: boolean,
  idToIgnore?: string
) => {
  if (!published) return null;
  const count = await getPublishedCardCount(section, idToIgnore);
  if (count >= MAX_PUBLISHED_CARDS) {
    return "Only 3 cards can be published in this section at once.";
  }
  return null;
};

export const validateStatPublishLimit = async (
  published: boolean,
  idToIgnore?: string
) => {
  if (!published) return null;
  const page = await getLandingPageData();
  const count = page.impact.stats.filter(
    (stat) => stat.published && stat.id !== idToIgnore
  ).length;
  if (count >= MAX_PUBLISHED_STATS) {
    return "Only 4 impact stats can be published at once.";
  }
  return null;
};
