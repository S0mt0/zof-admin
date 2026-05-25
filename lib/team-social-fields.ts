export const teamSocialFields = [
  { name: "facebook", label: "Facebook", placeholder: "facebook.com/name" },
  { name: "x", label: "X", placeholder: "@name" },
  { name: "instagram", label: "Instagram", placeholder: "@name" },
  { name: "youtube", label: "YouTube", placeholder: "youtube.com/@name" },
  { name: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/name" },
  { name: "tiktok", label: "TikTok", placeholder: "@name" },
  { name: "threads", label: "Threads", placeholder: "@name" },
  { name: "whatsapp", label: "WhatsApp", placeholder: "+234..." },
  { name: "telegram", label: "Telegram", placeholder: "@name" },
  { name: "snapchat", label: "Snapchat", placeholder: "@name" },
  { name: "pinterest", label: "Pinterest", placeholder: "pinterest.com/name" },
  { name: "medium", label: "Medium", placeholder: "medium.com/@name" },
] satisfies {
  name: keyof Pick<
    TeamMember,
    | "facebook"
    | "x"
    | "instagram"
    | "youtube"
    | "linkedin"
    | "tiktok"
    | "threads"
    | "whatsapp"
    | "telegram"
    | "snapchat"
    | "pinterest"
    | "medium"
  >;
  label: string;
  placeholder: string;
}[];
