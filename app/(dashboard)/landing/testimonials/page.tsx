import { DashboardHeader } from "@/components/common/dashboard-header";
import {
  getLandingPageData,
  listTestimonials,
} from "@/lib/db/repository/pages/landing";

import { TestimonialsSectionEditor } from "./_components/testimonials-section-editor";

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
      <TestimonialsSectionEditor
        section={data.testimonials}
        testimonials={testimonials}
      />
    </div>
  );
}
