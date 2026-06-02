interface DonationPageContent {
  id: string;
  aside: DonationAsideSectionContent;
  createdAt: Date;
  updatedAt: Date;
}

type DonationSection = "aside";

interface DonationAsideSectionContent {
  intro: SectionIntroContent;
}

type DonationFrequency = "once" | "weekly" | "monthly" | "yearly";
type DonationStatus =
  | "abandoned"
  | "failed"
  | "ongoing"
  | "pending"
  | "reversed"
  | "success";

type DonationCampaign = {
  id: string;
  topic: string;
  description?: string | null;
  published: boolean;
  order: number;
  donation?: Donation[];
  createdAt: Date;
  updatedAt: Date;
};


type DonationSubscription = {
  id: string;
  donor?: string | null;
  email: string;
  phone?: string | null;
  amount: number;
  currency: string;
  frequency: DonationFrequency;
  anonymous: boolean;
  sendReceipt: boolean;
  sendThankYou: boolean;
  status: string;
  paystackPlanCode: string;
  paystackSubscriptionCode?: string | null;
  paystackCustomerCode?: string | null;
  paystackEmailToken?: string | null;
  metadata?: unknown;
  campaignId?: string | null;
  campaign?: DonationCampaign | null;
  donations?: Donation[];
  createdAt: Date;
  updatedAt: Date;
};

type Donation = {
  id: string;
  donor?: string | null;
  email?: string | null;
  phone?: string | null;
  amount: number;
  currency: string;
  method: string;
  notes?: string | null;
  recurring: boolean;
  frequency: DonationFrequency;
  anonymous: boolean;
  sendReceipt: boolean;
  sendThankYou: boolean;
  status: DonationStatus;
  failReason?: string | null;
  reference: string;
  paystackStatus?: string | null;
  accessCode?: string | null;
  authorizationUrl?: string | null;
  paidAt?: Date | null;
  metadata?: unknown;
  paystackPlanCode?: string | null;
  paystackSubscriptionCode?: string | null;
  paystackCustomerCode?: string | null;
  paystackEmailToken?: string | null;
  subscriptionId?: string | null;
  subscription?: DonationSubscription | null;
  campaignId?: string | null;
  campaign?: DonationCampaign | null;
  createdAt: Date;
  updatedAt: Date;
};
