interface IFoundationInfo {
  id: string;
  name: string;
  email: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
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
