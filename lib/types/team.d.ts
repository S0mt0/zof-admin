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
  joinDate: Date | string;
  department?: string | null;
  location?: string | null;
  skills: string[];
  addedBy: string;
  addedByUser?: Partial<IUser> | null;
  linkedin?: string | null;
  twitter?: string | null;
  github?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
