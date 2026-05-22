import { DashboardHeader } from "@/components/dashboard-header";
import {
  getLandingPageData,
  listTestimonials,
} from "@/lib/db/repository/pages.service";
import { LandingSectionEditor } from "../_components/landing-section-editor";

export default async function LandingTestimonialsPage() {
  const [data, testimonials] = await Promise.all([
    getLandingPageData(),
    listTestimonials(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Testimonials" },
        ]}
      />
      <LandingSectionEditor
        section="testimonials"
        data={data}
        testimonials={testimonials}
      />
    </div>
  );
}
