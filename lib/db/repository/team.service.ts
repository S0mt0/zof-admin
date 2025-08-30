import { db } from "../config";

export const listTeamMembers = async () => {
  try {
    return await db.teamMember.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        addedByUser: {
          select: {
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });
  } catch (e) {
    return [] as TeamMember[];
  }
};

export const getTeamMemberById = async (id: string) => {
  try {
    return await db.teamMember.findUnique({
      where: { id },
    });
  } catch (e) {
    return null;
  }
};

export const getTeamMemberByEmail = async (email: string) => {
  try {
    return (await db.teamMember.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    })) as TeamMember | null;
  } catch (e) {
    return null;
  }
};

export const getUniqueTeamMember = async (name: string, email: string) => {
  try {
    return await db.teamMember.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      include: {
        addedByUser: {
          select: {
            name: true,
            email: true,
            role: true,
            image: true,
          },
        },
      },
    });
  } catch (e) {
    return null;
  }
};

export const createTeamMember = async (data: any) => {
  try {
    return (await db.teamMember.create({ data })) as TeamMember;
  } catch (e) {
    console.log("error creating team member", e);
    return null;
  }
};

export const updateTeamMember = async (
  id: string,
  data: Partial<Omit<TeamMember, "addedByUser">>
) => {
  try {
    return (await db.teamMember.update({ where: { id }, data })) as TeamMember;
  } catch (e) {
    return null;
  }
};

export const deleteTeamMember = async (id: string) => {
  try {
    return (await db.teamMember.delete({ where: { id } })) as TeamMember;
  } catch (e) {
    return null;
  }
};
