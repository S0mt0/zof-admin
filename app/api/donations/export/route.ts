import { listAllDonations } from "@/lib/db/repository/pages/donations";
import { getUserById } from "@/lib/db/repository/user.service";
import {
  createDonationsPdfBuffer,
  donationsToCsv,
} from "@/lib/utils/donations.utils";
import { currentUser } from "@/lib/utils";

const getFileName = (format: "pdf" | "csv") =>
  `zof-donations-${new Date().toISOString().slice(0, 10)}.${format}`;

export async function GET(request: Request) {
  const sessionUser = await currentUser();
  const user = await getUserById(sessionUser?.id || "");

  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "csv" ? "csv" : "pdf";
  const donations = (await listAllDonations()) as Donation[];

  if (format === "csv") {
    return new Response(donationsToCsv(donations), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${getFileName(format)}"`,
      },
    });
  }

  const pdf = await createDonationsPdfBuffer(donations);
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${getFileName(format)}"`,
    },
  });
}
