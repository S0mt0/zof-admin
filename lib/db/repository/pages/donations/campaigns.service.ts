import { db } from "@/lib/db/config";

export const normalizeCampaignTopic = (topic: string) =>
  topic.trim().replace(/\s+/g, " ");

const comparableTopic = (topic: string) => normalizeCampaignTopic(topic).toLowerCase();

export const listDonationCampaigns = (publishedOnly = false) =>
  db.donationCampaign.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

export const getDonationCampaignById = (id: string) =>
  db.donationCampaign.findUnique({ where: { id } });

export const findDonationCampaignByNormalizedTopic = async (
  topic: string,
  idToIgnore?: string
) => {
  const target = comparableTopic(topic);
  const campaigns = await db.donationCampaign.findMany({
    select: { id: true, topic: true },
  });

  return campaigns.find(
    (campaign) => campaign.id !== idToIgnore && comparableTopic(campaign.topic) === target
  );
};

export const createDonationCampaign = async (data: {
  topic: string;
  description?: string;
  published: boolean;
}) => {
  const count = await db.donationCampaign.count();
  return db.donationCampaign.create({
    data: { ...data, topic: normalizeCampaignTopic(data.topic), order: count },
  });
};

export const updateDonationCampaign = (id: string, data: Partial<DonationCampaign>) =>
  db.donationCampaign.update({
    where: { id },
    data: {
      ...data,
      ...(typeof data.topic === "string" ? { topic: normalizeCampaignTopic(data.topic) } : {}),
    } as any,
  });

export const reorderDonationCampaigns = async (ids: string[]) => {
  await Promise.all(
    ids.map((id, order) =>
      db.donationCampaign.update({
        where: { id },
        data: { order },
      })
    )
  );
  return listDonationCampaigns();
};

export const deleteDonationCampaign = (id: string) =>
  db.donationCampaign.delete({ where: { id } });
