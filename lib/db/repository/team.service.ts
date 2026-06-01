import { Prisma } from "@prisma/client";

import { db } from "../config";

interface ListTeamMembersOptions {
  where?: Prisma.TeamMemberWhereInput;
  select?: Prisma.TeamMemberSelect;
  include?: Prisma.TeamMemberInclude;
  orderBy?: Prisma.TeamMemberOrderByWithRelationInput;
}

interface ListVolunteersOptions {
  where?: Prisma.VolunteerWhereInput;
  select?: Prisma.VolunteerSelect;
  include?: Prisma.VolunteerInclude;
  orderBy?: Prisma.VolunteerOrderByWithRelationInput;
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
    orderBy = [{ order: "asc" }, { createdAt: "asc" }],
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

export const listVolunteers = async (
  options: ListVolunteersOptions = {}
): Promise<Volunteer[]> => {
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
    orderBy = [{ order: "asc" }, { createdAt: "desc" }],
  } = options;

  try {
    return await db.volunteer.findMany({
      where,
      orderBy,
      ...(select ? { select } : { include }),
    } as any);
  } catch (e) {
    console.error(e);
    return [] as Volunteer[];
  }
};

export const getUniqueVolunteer = async (
  name: string,
  volunteerType: string
) => {
  try {
    return await db.volunteer.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        volunteerType: {
          equals: volunteerType,
          mode: "insensitive",
        },
      },
    });
  } catch (e) {
    return null;
  }
};

export const createVolunteer = async (data: any) => {
  try {
    const count = await db.volunteer.count();

    if (data.featured) {
      await db.volunteer.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    return (await db.volunteer.create({ data: { ...data, order: count } })) as Volunteer;
  } catch (e) {
    console.log("error creating volunteer", e);
    return null;
  }
};

export const updateVolunteer = async (
  id: string,
  data: Partial<Omit<Volunteer, "addedByUser">>
) => {
  try {
    if (data.featured) {
      await db.volunteer.updateMany({
        where: { featured: true, id: { not: id } },
        data: { featured: false },
      });
    }

    return (await db.volunteer.update({ where: { id }, data })) as Volunteer;
  } catch (e) {
    return null;
  }
};

export const deleteVolunteer = async (id: string) => {
  try {
    return (await db.volunteer.delete({ where: { id } })) as Volunteer;
  } catch (e) {
    return null;
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
    const count = await db.teamMember.count();
    return (await db.teamMember.create({ data: { ...data, order: count } })) as TeamMember;
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


export const reorderTeamMembers = async (ids: string[]) => {
  await Promise.all(
    ids.map((id, order) =>
      db.teamMember.update({ where: { id }, data: { order } })
    )
  );

  return listTeamMembers();
};

export const reorderVolunteers = async (ids: string[]) => {
  await Promise.all(
    ids.map((id, order) =>
      db.volunteer.update({ where: { id }, data: { order } })
    )
  );

  return listVolunteers();
};
