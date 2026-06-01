type TeamMemberStatus = "active" | "inactive" | "suspended";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  status: TeamMemberStatus;
  avatar?: string | null;
  order: number;
  joinDate: Date | string;
  department?: string | null;
  location?: string | null;
  skills: string[];
  addedBy: string;
  addedByUser?: Partial<IUser> | null;
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
  twitter?: string | null;
  github?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Volunteer {
  id: string;
  name: string;
  volunteerType: string;
  avatar?: string | null;
  featured: boolean;
  order: number;
  addedBy: string;
  addedByUser?: Partial<IUser> | null;
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
