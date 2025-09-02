export const DEFAULT_ADMIN_EMAILS =
  process.env.DEFAULT_ADMIN_EMAILS?.split(",") || [];

export const FOUNDATION_DESCRIPTION =
  "The Zita-Onyeka Foundation is a non-profit organization dedicated to empowering women, youth, and communities in Nigeria. Join us in creating sustainable change through education, skill development, and community initiatives.";
export const FOUNDATION_NAME = "Zita-Onyeka Foundation";
export const FOUNDATION_EMAIL = "onyekazita@gmail.com";
export const FOUNDATION_ADDRESS =
  "16, Nkwere Street, Garki Area 11 FCT, Abuja Nigeria.";
export const FOUNDATION_PHONE = "+234 803 786 4683";

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/heic",
];

export const MAX_IMAGE_SIZE = 8 * 1000 * 1024; // 8MB

export const EDITORIAL_ROLES: Role[] = ["admin", "editor"];

export const emptyPaginatedData = {
  data: [],
  pagination: {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  },
};
