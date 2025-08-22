const allowedAccountEmails = process.env.ALLOWED_ACCOUNT_EMAILS;
export const allowedAccountEmailsList = allowedAccountEmails?.split(",") || [];

const allowedAdminEmails = process.env.ALLOWED_ADMIN_EMAILS;
export const allowedAdminEmailsList = allowedAdminEmails?.split(",") || [];

export const foundationDescription =
  "The Zita-Onyeka Foundation is a non-profit organization dedicated to empowering women, youth, and communities in Nigeria. Join us in creating sustainable change through education, skill development, and community initiatives.";

export const foundationName = "Zita-Onyeka Foundation";
export const foundationEmail = "onyekazita@gmail.com";
export const foundationAddress =
  "16, Nkwere Street, Garki Area 11 FCT, Abuja Nigeria.";
export const foundationPhone = "+234 803 786 4683";

export const emptyPaginatedData = {
  data: [],
  pagination: {
    total: 0,
    page: 0,
    limit: 0,
    totalPages: 0,
  },
};
