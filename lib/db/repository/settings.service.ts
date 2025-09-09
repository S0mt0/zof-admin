import { Prisma } from "@prisma/client";

import { db } from "../config";

export const getFoundationInfo = async (
  select?: Prisma.FoundationInfoSelect
) => {
  try {
    const foundationInfo = await db.foundationInfo.findFirst({ select });
    return foundationInfo as IFoundationInfo | null;
  } catch (e) {
    return null;
  }
};

export const updateFoundationInfo = async (
  id: string,
  data: Partial<IFoundationInfo>
) => {
  try {
    return (await db.foundationInfo.update({
      where: { id },
      data,
    })) as IFoundationInfo;
  } catch (e) {
    return null;
  }
};

export const createFoundationInfo = async (
  data: Omit<IFoundationInfo, "id" | "createdAt" | "updatedAt">
) => {
  try {
    return (await db.foundationInfo.create({
      data,
    })) as IFoundationInfo;
  } catch (e) {
    return null;
  }
};

export const getWebsiteSettings = async (
  select?: Prisma.WebsiteSettingsSelect
) => {
  try {
    const websiteSettings = await db.websiteSettings.findFirst({ select });
    return websiteSettings as IWebsiteSettings | null;
  } catch (e) {
    return null;
  }
};

export const updateWebsiteSettings = async (
  id: string,
  data: Partial<IWebsiteSettings>
) => {
  try {
    return (await db.websiteSettings.update({
      where: { id },
      data,
    })) as IWebsiteSettings;
  } catch (e) {
    return null;
  }
};

export const createWebsiteSettings = async (
  data: Omit<IWebsiteSettings, "id" | "createdAt" | "updatedAt">
) => {
  try {
    return (await db.websiteSettings.create({
      data,
    })) as IWebsiteSettings;
  } catch (e) {
    return null;
  }
};
