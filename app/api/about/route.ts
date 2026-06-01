import { FRONTEND_BASE_URL } from "@/lib/constants";
import { getAboutPageData } from "@/lib/db/repository/pages/about";
import { intro } from "@/lib/db/repository/pages/landing/utils";
import { listTeamMembers } from "@/lib/db/repository/team.service";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const publishedCtas = (items: CtaButtonContent[] = []) =>
  items
    .filter((item) => item.published)
    .sort((a, b) => a.order - b.order)
    .slice(0, 2);

const publishedTrustPoints = (items: AboutPageTrustPoint[] = []) =>
  items
    .filter((item) => item.published)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET() {
  try {
    const [about, teamMembers] = await Promise.all([
      getAboutPageData(),
      listTeamMembers({
        where: { status: "active" },
        select: {
          id: true,
          name: true,
          role: true,
          email: true,
          bio: true,
          avatar: true,
          order: true,
          facebook: true,
          x: true,
          instagram: true,
          youtube: true,
          linkedin: true,
          tiktok: true,
          threads: true,
          whatsapp: true,
          telegram: true,
          snapchat: true,
          pinterest: true,
          medium: true,
          twitter: true,
          github: true,
        },
      }),
    ]);
    const members = teamMembers.map((member) => ({
      ...member,
      x: member.x || member.twitter,
    }));
    const data = {
      hero: about.hero,
      story: {
        ...about.story,
        trustPoints: publishedTrustPoints(about.story.trustPoints),
      },
      team: {
        ...about.team,
        members,
      },
      foundersMessage: {
        founder: {
          name: about.foundersMessage?.founder?.name,
          role: about.foundersMessage?.founder?.role,
          image: about.foundersMessage?.founder?.image,
          quote: about.foundersMessage?.founder?.quote,
          body: about.foundersMessage?.founder?.body,
        },
        intro: about.foundersMessage.intro,
        ctas: publishedCtas(about.foundersMessage.ctas),
      },
      cta: {
        ...about.cta,
        ctas: publishedCtas(about.cta.ctas),
      },
      updatedAt: about.updatedAt,
    };

    return Response.json(
      { message: "About page fetched successfully", data },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error("Error fetching about page:", error);

    return Response.json(
      { message: "Something went wrong, try again." },
      { headers: corsHeaders, status: 500 }
    );
  }
}
