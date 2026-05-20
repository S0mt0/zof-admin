import { DashboardHeader } from "@/components/dashboard-header";
import { listLandingTestimonials } from "@/lib/db/repository/pages.service";
import { TestimonialsManager } from "../_components/testimonials-manager";

export default async function LandingTestimonialsPage() {
  const testimonials = await listLandingTestimonials();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader
        breadcrumbs={[
          { label: "Pages" },
          { label: "Landing" },
          { label: "Testimonials" },
        ]}
      />
      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
