import { Prisma } from "@prisma/client";

import { db } from "../config";

interface ListTeamMembersOptions {
  where?: Prisma.TeamMemberWhereInput;
  select?: Prisma.TeamMemberSelect;
  include?: Prisma.TeamMemberInclude;
  orderBy?: Prisma.TeamMemberOrderByWithRelationInput;
}
export const listTeamMembers = async (
  options: ListTeamMembersOptions = {}
): Promise<TeamMember[]> => {
  const {
    where,
    select,
    include = {
      addedByUser: {
        select: {
          name: true,
          email: true,
          role: true,
          image: true,
        },
      },
    },
    orderBy = { createdAt: "asc" },
  } = options;

  try {
    return await db.teamMember.findMany({
      where,
      orderBy,
      ...(select ? { select } : { include }),
    } as any);
  } catch (e) {
    console.error(e);
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
