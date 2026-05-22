import { FRONTEND_BASE_URL } from "@/lib/constants";
import { getAllBlogs } from "@/lib/db/repository/blog.service";
import { getAllEvents } from "@/lib/db/repository/event.service";
import {
  getLandingPageData,
  listTestimonials,
} from "@/lib/db/repository/pages.service";
import { listVolunteers } from "@/lib/db/repository/team.service";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function GET() {
  try {
    const landing = await getLandingPageData();

    const [testimonials, blogs, events, volunteers] = await Promise.all([
      listTestimonials({
        where: { published: true },
        select: {
          name: true,
          role: true,
          quote: true,
          avatar: true,
          order: true,
        },
      }),
      getAllBlogs({
        page: 1,
        limit: landing.featuredBlogs.limit,
        where: { status: "published", featured: true },
        select: {
          bannerImage: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          tags: true,
        },
      }),
      getAllEvents({
        page: 1,
        limit: landing.featuredEvents.limit,
        where: { status: { in: ["upcoming", "happening"] } },
        select: {
          bannerImage: true,
          date: true,
          endTime: true,
          excerpt: true,
          location: true,
          name: true,
          slug: true,
          startTime: true,
        },
      }),
      listVolunteers({
        select: {
          id: true,
          name: true,
          volunteerType: true,
          avatar: true,
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
        },
      }),
    ]);

    const data = {
      hero: landing.hero,
      about: {
        ...landing.about,
        cards: landing.about.cards.filter((card) => card.published),
      },
      values: {
        ...landing.values,
        cards: landing.values.cards.filter((card) => card.published),
      },
      volunteers: {
        ...landing.volunteers,
        items: volunteers,
      },
      impact: {
        ...landing.impact,
        stats: landing.impact.stats.filter((stat) => stat.published),
      },
      testimonials: {
        ...landing.testimonials,
        items: testimonials.slice(0, landing.testimonials.limit),
      },
      featuredBlogs: {
        ...landing.featuredBlogs,
        items: blogs.data || [],
      },
      featuredEvents: {
        ...landing.featuredEvents,
        items: events.data || [],
      },
      faqs: {
        ...landing.faqs,
        items: landing.faqs.items.filter((faq) => faq.published),
      },
    };

    return Response.json(
      { message: "Landing content fetched successfully", data },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error("Error fetching landing content:", error);

    return Response.json(
      { message: "Something went wrong, try again." },
      { headers: corsHeaders, status: 500 }
    );
  }
}
