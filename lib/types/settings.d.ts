interface IFoundationInfo {
  id: string;
  name: string;
  email: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  facebook?: string | null;
  x?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  threads?: string | null;
  whatsapp?: string | null;
  telegram?: string | null;
  snapchat?: string | null;
  pinterest?: string | null;
  medium?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IWebsiteSettings {
  id: string;
  maintenanceMode: boolean;
  blogComments: boolean;
  eventComments: boolean;
  eventRegistration: boolean;
  createdAt: Date;
  updatedAt: Date;
}
