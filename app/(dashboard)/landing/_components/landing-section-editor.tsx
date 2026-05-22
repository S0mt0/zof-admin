"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowUpRight,
  Edit,
  GripVertical,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createLandingCardAction,
  createLandingFaqAction,
  createLandingStatAction,
  createTestimonialAction,
  deleteLandingCardAction,
  deleteLandingFaqAction,
  deleteLandingStatAction,
  deleteTestimonialAction,
  reorderLandingCardsAction,
  reorderLandingFaqsAction,
  reorderLandingStatsAction,
  reorderTestimonialsAction,
  updateLandingAboutAction,
  updateLandingCardAction,
  updateLandingFaqAction,
  updateLandingFaqSectionAction,
  updateLandingFeaturedBlogsAction,
  updateLandingFeaturedEventsAction,
  updateLandingHeroAction,
  updateLandingImpactAction,
  updateLandingStatAction,
  updateLandingTestimonialsSectionAction,
  updateLandingValuesAction,
  updateLandingVolunteersAction,
  updateTestimonialAction,
} from "@/lib/actions/pages";
import { AlertDialog } from "@/components/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/constants";
import { getInitials, handleFileUpload } from "@/lib/utils";

type LandingSection =
  | "hero"
  | "about"
  | "values"
  | "volunteers"
  | "impact"
  | "testimonials"
  | "featuredBlogs"
  | "featuredEvents"
  | "faqs";

type CardSection = "about" | "values";
type SortableItem = { id: string };

const sectionMeta: Record<
  LandingSection,
  {
    eyebrow: string;
    title: string;
    description: string;
    accent: string;
  }
> = {
  hero: {
    eyebrow: "First impression",
    title: "Hero Section",
    description: "Control the opening headline, supporting line, and image.",
    accent: "from-emerald-500 to-teal-700",
  },
  about: {
    eyebrow: "Mission snapshot",
    title: "Who We Are Section",
    description: "Manage the intro, theme photo, and three reveal cards.",
    accent: "from-orange-400 to-rose-500",
  },
  values: {
    eyebrow: "How change happens",
    title: "Values Section",
    description: "Shape the principle cards and final partnership callout.",
    accent: "from-slate-800 to-slate-950",
  },
  volunteers: {
    eyebrow: "Volunteer movement",
    title: "Volunteers Section",
    description: "Edit the volunteer section copy and call-to-action.",
    accent: "from-green-500 to-emerald-800",
  },
  impact: {
    eyebrow: "Impact proof",
    title: "Impact Section",
    description: "Manage the stats and video that prove the work.",
    accent: "from-yellow-400 to-orange-500",
  },
  testimonials: {
    eyebrow: "Community voices",
    title: "Testimonials Section",
    description: "Edit the section copy and testimonial roster.",
    accent: "from-indigo-500 to-violet-700",
  },
  featuredBlogs: {
    eyebrow: "Latest stories",
    title: "Featured Blogs Section",
    description: "Edit featured blog section copy and display settings.",
    accent: "from-cyan-500 to-blue-700",
  },
  featuredEvents: {
    eyebrow: "Upcoming moments",
    title: "Featured Events Section",
    description: "Edit featured events section copy and display settings.",
    accent: "from-lime-500 to-green-700",
  },
  faqs: {
    eyebrow: "Helpful answers",
    title: "FAQ Section",
    description: "Manage FAQ intro copy and ordered questions.",
    accent: "from-pink-400 to-orange-500",
  },
};

const emptyCardForm = {
  subject: "",
  kicker: "",
  description: "",
  published: true,
};

const emptyStatForm = {
  value: "",
  title: "",
  published: true,
};

const emptyFaqForm = {
  question: "",
  answer: "",
  published: true,
};

const emptyTestimonialForm = {
  name: "",
  role: "",
  quote: "",
  avatar: "",
  published: true,
};

export function LandingSectionEditor({
  section,
  data,
  testimonials = [],
  volunteers = [],
}: {
  section: LandingSection;
  data: LandingPageDataContent;
  testimonials?: Testimonial[];
  volunteers?: Volunteer[];
}) {
  const meta = sectionMeta[section];

  return (
    <div className="grid gap-5">
      <div
        className={`overflow-hidden rounded-xl bg-gradient-to-br ${meta.accent} p-6 text-white shadow-sm`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
          {meta.eyebrow}
        </p>
        <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
          {meta.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
          {meta.description}
        </p>
      </div>

      {section === "hero" ? <HeroEditor hero={data.hero} /> : null}
      {section === "about" ? <AboutEditor section={data.about} /> : null}
      {section === "values" ? <ValuesEditor section={data.values} /> : null}
      {section === "volunteers" ? (
        <VolunteersEditor section={data.volunteers} volunteers={volunteers} />
      ) : null}
      {section === "impact" ? <ImpactEditor section={data.impact} /> : null}
      {section === "testimonials" ? (
        <TestimonialsEditor
          section={data.testimonials}
          testimonials={testimonials}
        />
      ) : null}
      {section === "featuredBlogs" ? (
        <FeaturedEditor
          type="blogs"
          section={data.featuredBlogs}
          action={updateLandingFeaturedBlogsAction}
        />
      ) : null}
      {section === "featuredEvents" ? (
        <FeaturedEditor
          type="events"
          section={data.featuredEvents}
          action={updateLandingFeaturedEventsAction}
        />
      ) : null}
      {section === "faqs" ? <FaqsEditor section={data.faqs} /> : null}
    </div>
  );
}

function HeroEditor({ hero }: { hero: HeroSectionContent }) {
  const [formData, setFormData] = useState({
    ...hero,
    image: hero.image || "",
  });
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement | null>(null);

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    uploadImage(event, (url) => setFormData((prev) => ({ ...prev, image: url })));
  };

  const onSubmit = () => {
    startTransition(() => {
      updateLandingHeroAction(formData)
        .then(showResult("Hero saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <CardTitle>Hero copy and image</CardTitle>
          <CardDescription>
            This is the first message visitors see on the landing page.
          </CardDescription>
        </div>
        <SaveButton onClick={onSubmit} pending={isPending} />
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-4">
          <TextField
            label="Hero title"
            value={formData.title}
            maxLength={120}
            onChange={(title) => setFormData((prev) => ({ ...prev, title }))}
          />
          <TextareaField
            label="Hero subtitle"
            value={formData.subtitle}
            maxLength={260}
            onChange={(subtitle) =>
              setFormData((prev) => ({ ...prev, subtitle }))
            }
          />
        </div>
        <ImagePicker
          label="Hero image"
          value={formData.image || ""}
          inputRef={imageRef}
          onUpload={onUpload}
        />
      </CardContent>
    </Card>
  );
}

function AboutEditor({ section }: { section: AboutSectionContent }) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    themePhoto: section.themePhoto || "",
  });
  const [isPending, startTransition] = useTransition();
  const imageRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = () => {
    startTransition(() => {
      updateLandingAboutAction(formData)
        .then(showResult("About section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="grid gap-5">
      <SectionCopyCard
        title="Who We Are copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={
          <SaveButton onClick={onSubmit} pending={isPending} label="Save About" />
        }
      >
        <ImagePicker
          label="Theme photo"
          value={formData.themePhoto}
          inputRef={imageRef}
          onUpload={(event) =>
            uploadImage(event, (url) =>
              setFormData((prev) => ({ ...prev, themePhoto: url }))
            )
          }
        />
      </SectionCopyCard>
      <CardsManager
        section="about"
        title="Reveal cards"
        description="Drag to arrange. Only 3 cards can be published at once."
        items={section.cards}
      />
    </div>
  );
}

function ValuesEditor({ section }: { section: ValuesSectionContent }) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    closingText: section.closingText || "",
    ctaLabel: section.ctaLabel || "",
    ctaHref: section.ctaHref || "",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingValuesAction(formData)
        .then(showResult("Values section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="grid gap-5">
      <SectionCopyCard
        title="Values section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <TextareaField
          label="Closing note"
          value={formData.closingText}
          maxLength={220}
          onChange={(closingText) =>
            setFormData((prev) => ({ ...prev, closingText }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="CTA label"
            value={formData.ctaLabel}
            onChange={(ctaLabel) =>
              setFormData((prev) => ({ ...prev, ctaLabel }))
            }
          />
          <TextField
            label="CTA link"
            value={formData.ctaHref}
            onChange={(ctaHref) =>
              setFormData((prev) => ({ ...prev, ctaHref }))
            }
          />
        </div>
      </SectionCopyCard>
      <CardsManager
        section="values"
        title="Principle cards"
        description="Drag to arrange. Only 3 cards can be published at once."
        items={section.cards}
      />
    </div>
  );
}

function VolunteersEditor({
  section,
  volunteers,
}: {
  section: VolunteersSectionContent;
  volunteers: Volunteer[];
}) {
  const [formData, setFormData] = useState({
    ...section,
    featuredVolunteerId: section.featuredVolunteerId || "",
    ctaHeading: section.ctaHeading || "",
    ctaLabel: section.ctaLabel || "",
    ctaHref: section.ctaHref || "",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingVolunteersAction(formData)
        .then(showResult("Volunteers section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="grid gap-5">
      <SectionCopyCard
        title="Volunteer section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <div className="grid gap-2">
          <Label>Featured volunteer</Label>
          <select
            value={formData.featuredVolunteerId || ""}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                featuredVolunteerId: event.target.value,
              }))
            }
            className="h-10 rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Use first available volunteer</option>
            {volunteers.map((volunteer) => (
              <option key={volunteer.id} value={volunteer.id}>
                {volunteer.name} — {volunteer.volunteerType}
              </option>
            ))}
          </select>
        </div>
        <TextareaField
          label="CTA heading"
          value={formData.ctaHeading || ""}
          maxLength={150}
          onChange={(ctaHeading) =>
            setFormData((prev) => ({ ...prev, ctaHeading }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="CTA label"
            value={formData.ctaLabel || ""}
            onChange={(ctaLabel) =>
              setFormData((prev) => ({ ...prev, ctaLabel }))
            }
          />
          <TextField
            label="CTA link"
            value={formData.ctaHref || ""}
            onChange={(ctaHref) =>
              setFormData((prev) => ({ ...prev, ctaHref }))
            }
          />
        </div>
      </SectionCopyCard>
      <ResourcePanel
        title="Volunteer roster"
        description={`${volunteers.length} volunteers available for this section.`}
        href="/volunteers"
        label="Manage volunteers"
      />
    </div>
  );
}

function ImpactEditor({ section }: { section: ImpactSectionContent }) {
  const [formData, setFormData] = useState({
    intro: section.intro,
    youtubeUrl: section.youtubeUrl || "",
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingImpactAction(formData)
        .then(showResult("Impact section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="grid gap-5">
      <SectionCopyCard
        title="Impact section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <TextField
          label="YouTube URL"
          value={formData.youtubeUrl}
          onChange={(youtubeUrl) =>
            setFormData((prev) => ({ ...prev, youtubeUrl }))
          }
        />
      </SectionCopyCard>
      <StatsManager items={section.stats} />
    </div>
  );
}

function TestimonialsEditor({
  section,
  testimonials,
}: {
  section: TestimonialsSectionContent;
  testimonials: Testimonial[];
}) {
  const [formData, setFormData] = useState(section);
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingTestimonialsSectionAction(formData)
        .then(showResult("Testimonials section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="grid gap-5">
      <SectionCopyCard
        title="Testimonials section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <TextField
          label="Display limit"
          type="number"
          value={String(formData.limit)}
          onChange={(limit) =>
            setFormData((prev) => ({ ...prev, limit: Number(limit) }))
          }
        />
      </SectionCopyCard>
      <TestimonialsManager items={testimonials} />
    </div>
  );
}

function FeaturedEditor({
  type,
  section,
  action,
}: {
  type: "blogs" | "events";
  section: FeaturedContentSectionContent;
  action: (values: FeaturedContentSectionContent) => Promise<any>;
}) {
  const [formData, setFormData] = useState(section);
  const [isPending, startTransition] = useTransition();
  const href = type === "blogs" ? "/blogs" : "/events";

  const onSubmit = () => {
    startTransition(() => {
      action(formData)
        .then(showResult("Featured section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="grid gap-5">
      <SectionCopyCard
        title={`Featured ${type} copy`}
        intro={formData.intro}
        onIntroChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      >
        <TextField
          label="Display limit"
          type="number"
          value={String(formData.limit)}
          onChange={(limit) =>
            setFormData((prev) => ({ ...prev, limit: Number(limit) }))
          }
        />
      </SectionCopyCard>
      <ResourcePanel
        title={`Featured ${type}`}
        description={`Featured ${type} come from the published ${type} collection.`}
        href={href}
        label={`Manage ${type}`}
      />
    </div>
  );
}

function FaqsEditor({ section }: { section: FaqSectionContent }) {
  const [formData, setFormData] = useState({ intro: section.intro });
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingFaqSectionAction(formData)
        .then(showResult("FAQ section saved"))
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <div className="grid gap-5">
      <SectionCopyCard
        title="FAQ section copy"
        intro={formData.intro}
        onIntroChange={(intro) => setFormData({ intro })}
        footer={<SaveButton onClick={onSubmit} pending={isPending} />}
      />
      <FaqItemsManager items={section.items} />
    </div>
  );
}

function CardsManager({
  section,
  title,
  description,
  items,
}: {
  section: CardSection;
  title: string;
  description: string;
  items: SectionCardItemContent[];
}) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<SectionCardItemContent | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<SectionCardItemContent | null>(null);
  const [formData, setFormData] = useState(emptyCardForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyCardForm);
    setOpen(true);
  };

  const openEdit = (item: SectionCardItemContent) => {
    setTarget(item);
    setFormData({
      subject: item.subject,
      kicker: item.kicker || "",
      description: item.description,
      published: item.published,
    });
    setOpen(true);
  };

  const onSubmit = () => {
    const action = target
      ? updateLandingCardAction(section, target.id, formData)
      : createLandingCardAction(section, formData);

    startTransition(() => {
      action.then((res) => {
        if (res?.error) return toast.error(res.error);
        toast.success(res?.success || "Saved");
        setOpen(false);
        router.refresh();
      });
    });
  };

  const onDelete = () => {
    if (!deleteTarget) return;
    startTransition(() => {
      deleteLandingCardAction(section, deleteTarget.id).then((res) => {
        if (res?.error) return toast.error(res.error);
        toast.success(res?.success || "Deleted");
        setDeleteTarget(null);
        router.refresh();
      });
    });
  };

  return (
    <ItemManagerShell
      title={title}
      description={description}
      addLabel="Add card"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={(ids) => reorderLandingCardsAction(section, ids)}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.subject}
            meta={item.kicker || "Section card"}
            published={item.published}
            description={item.description}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target ? "Edit card" : "Add card"}</DialogTitle>
            <DialogDescription>
              Keep this short enough to fit inside the frontend card.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextField
              label="Subject"
              value={formData.subject}
              maxLength={32}
              onChange={(subject) =>
                setFormData((prev) => ({ ...prev, subject }))
              }
            />
            <TextField
              label="Kicker"
              value={formData.kicker}
              maxLength={28}
              onChange={(kicker) =>
                setFormData((prev) => ({ ...prev, kicker }))
              }
            />
            <TextareaField
              label="Description"
              value={formData.description}
              maxLength={150}
              onChange={(description) =>
                setFormData((prev) => ({ ...prev, description }))
              }
            />
            <PublishSwitch
              checked={formData.published}
              onChange={(published) =>
                setFormData((prev) => ({ ...prev, published }))
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Saving..." : "Save card"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.subject}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}

function StatsManager({ items }: { items: LandingStatItemContent[] }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<LandingStatItemContent | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<LandingStatItemContent | null>(null);
  const [formData, setFormData] = useState(emptyStatForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyStatForm);
    setOpen(true);
  };

  const openEdit = (item: LandingStatItemContent) => {
    setTarget(item);
    setFormData({
      value: item.value,
      title: item.title,
      published: item.published,
    });
    setOpen(true);
  };

  const onSubmit = () => {
    const action = target
      ? updateLandingStatAction(target.id, formData)
      : createLandingStatAction(formData);

    startTransition(() => {
      action.then((res) => {
        if (res?.error) return toast.error(res.error);
        toast.success(res?.success || "Saved");
        setOpen(false);
        router.refresh();
      });
    });
  };

  const onDelete = () => {
    if (!deleteTarget) return;
    startTransition(() => {
      deleteLandingStatAction(deleteTarget.id).then((res) => {
        if (res?.error) return toast.error(res.error);
        toast.success(res?.success || "Deleted");
        setDeleteTarget(null);
        router.refresh();
      });
    });
  };

  return (
    <ItemManagerShell
      title="Impact stats"
      description="Drag to arrange. Only 4 stats can be published at once."
      addLabel="Add stat"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={reorderLandingStatsAction}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.value}
            meta={item.title}
            published={item.published}
            description="Impact stat"
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target ? "Edit stat" : "Add stat"}</DialogTitle>
            <DialogDescription>
              Examples: 50+, 2,000+, 100%, Volunteers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextField
              label="Value"
              value={formData.value}
              onChange={(value) => setFormData((prev) => ({ ...prev, value }))}
            />
            <TextField
              label="Title"
              value={formData.title}
              onChange={(title) => setFormData((prev) => ({ ...prev, title }))}
            />
            <PublishSwitch
              checked={formData.published}
              onChange={(published) =>
                setFormData((prev) => ({ ...prev, published }))
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Saving..." : "Save stat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.title}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}

function FaqItemsManager({ items }: { items: FaqItemContent[] }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<FaqItemContent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FaqItemContent | null>(null);
  const [formData, setFormData] = useState(emptyFaqForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyFaqForm);
    setOpen(true);
  };

  const openEdit = (item: FaqItemContent) => {
    setTarget(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      published: item.published,
    });
    setOpen(true);
  };

  const onSubmit = () => {
    const action = target
      ? updateLandingFaqAction(target.id, formData)
      : createLandingFaqAction(formData);

    startTransition(() => {
      action.then((res) => {
        if (res?.error) return toast.error(res.error);
        toast.success(res?.success || "Saved");
        setOpen(false);
        router.refresh();
      });
    });
  };

  const onDelete = () => {
    if (!deleteTarget) return;
    startTransition(() => {
      deleteLandingFaqAction(deleteTarget.id).then((res) => {
        if (res?.error) return toast.error(res.error);
        toast.success(res?.success || "Deleted");
        setDeleteTarget(null);
        router.refresh();
      });
    });
  };

  return (
    <ItemManagerShell
      title="FAQ items"
      description="Drag questions into the order they should appear."
      addLabel="Add FAQ"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={reorderLandingFaqsAction}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.question}
            meta="Question"
            published={item.published}
            description={item.answer}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{target ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>
              Keep answers clear and useful for visitors.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <TextField
              label="Question"
              value={formData.question}
              onChange={(question) =>
                setFormData((prev) => ({ ...prev, question }))
              }
            />
            <TextareaField
              label="Answer"
              value={formData.answer}
              onChange={(answer) =>
                setFormData((prev) => ({ ...prev, answer }))
              }
            />
            <PublishSwitch
              checked={formData.published}
              onChange={(published) =>
                setFormData((prev) => ({ ...prev, published }))
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Saving..." : "Save FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.question}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}

function TestimonialsManager({ items }: { items: Testimonial[] }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState(emptyTestimonialForm);
  const [isPending, startTransition] = useTransition();
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const openCreate = () => {
    setTarget(null);
    setFormData(emptyTestimonialForm);
    setOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setTarget(item);
    setFormData({
      name: item.name,
      role: item.role || "",
      quote: item.quote,
      avatar: item.avatar || "",
      published: item.published,
    });
    setOpen(true);
  };

  const onSubmit = () => {
    const action = target
      ? updateTestimonialAction(target.id, formData)
      : createTestimonialAction(formData);

    startTransition(() => {
      action.then((res) => {
        if (res?.error) return toast.error(res.error);
        toast.success(res?.success || "Saved");
        setOpen(false);
        router.refresh();
      });
    });
  };

  const onDelete = () => {
    if (!deleteTarget) return;
    startTransition(() => {
      deleteTestimonialAction(deleteTarget.id).then((res) => {
        if (res?.error) return toast.error(res.error);
        toast.success(res?.success || "Deleted");
        setDeleteTarget(null);
        router.refresh();
      });
    });
  };

  return (
    <ItemManagerShell
      title="Testimonials"
      description="Reusable testimonials for landing and future pages."
      addLabel="Add testimonial"
      onAdd={openCreate}
    >
      <SortableList
        items={items}
        onReorder={reorderTestimonialsAction}
        renderItem={(item, dragHandle) => (
          <ItemCard
            key={item.id}
            dragHandle={dragHandle}
            title={item.name}
            meta={item.role || "Testimonial"}
            published={item.published}
            description={item.quote}
            avatar={item.avatar}
            onEdit={() => openEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {target ? "Edit testimonial" : "Add testimonial"}
            </DialogTitle>
            <DialogDescription>
              Add the voice, role, quote, and optional photo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <Avatar className="h-16 w-16 rounded-xl">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="rounded-xl">
                  {formData.name ? getInitials(formData.name) : ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label>Photo</Label>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/heic"
                  className="hidden"
                  onChange={(event) =>
                    uploadImage(event, (url) =>
                      setFormData((prev) => ({ ...prev, avatar: url }))
                    )
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => avatarRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {formData.avatar ? "Change photo" : "Upload photo"}
                </Button>
              </div>
            </div>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(name) => setFormData((prev) => ({ ...prev, name }))}
            />
            <TextField
              label="Role"
              value={formData.role}
              onChange={(role) => setFormData((prev) => ({ ...prev, role }))}
            />
            <TextareaField
              label="Quote"
              value={formData.quote}
              onChange={(quote) => setFormData((prev) => ({ ...prev, quote }))}
            />
            <PublishSwitch
              checked={formData.published}
              onChange={(published) =>
                setFormData((prev) => ({ ...prev, published }))
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Saving..." : "Save testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onOk={onDelete}
        message={`Delete "${deleteTarget?.name}"?`}
        isPending={isPending}
      />
    </ItemManagerShell>
  );
}

function SectionCopyCard({
  title,
  intro,
  onIntroChange,
  children,
  footer,
}: {
  title: string;
  intro: SectionIntroContent;
  onIntroChange: (intro: SectionIntroContent) => void;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          The small theme title, main heading, and paragraph shown on the
          frontend.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-4">
          <TextField
            label="Small theme title"
            value={intro.eyebrow}
            onChange={(eyebrow) => onIntroChange({ ...intro, eyebrow })}
          />
          <TextField
            label="Heading"
            value={intro.heading}
            maxLength={120}
            onChange={(heading) => onIntroChange({ ...intro, heading })}
          />
          <TextareaField
            label="Description"
            value={intro.description}
            maxLength={280}
            onChange={(description) =>
              onIntroChange({ ...intro, description })
            }
          />
        </div>
        <div className="grid gap-4">{children}</div>
      </CardContent>
      {footer ? (
        <CardFooter className="justify-end border-t bg-muted/20 px-6 py-4">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}

function SortableList<T extends SortableItem>({
  items,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (ids: string[]) => Promise<any>;
  renderItem: (item: T, dragHandle: ReactNode) => ReactNode;
}) {
  const router = useRouter();
  const [localItems, setLocalItems] = useState(items);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => setLocalItems(items), [items]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localItems.findIndex((item) => item.id === active.id);
    const newIndex = localItems.findIndex((item) => item.id === over.id);
    const next = arrayMove(localItems, oldIndex, newIndex);
    setLocalItems(next);

    onReorder(next.map((item) => item.id)).then((res) => {
      if (res?.error) return toast.error(res.error);
      toast.success(res?.success || "Order updated");
      router.refresh();
    });
  };

  if (!localItems.length) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        Nothing here yet. Add the first item to bring this section to life.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={localItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-3">
          {localItems.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {(dragHandle) => renderItem(item, dragHandle)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (dragHandle: ReactNode) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragHandle = (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:text-primary"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4" />
      <span className="sr-only">Drag to reorder</span>
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "relative z-10 opacity-70" : ""}
    >
      {children(dragHandle)}
    </div>
  );
}

function ItemManagerShell({
  title,
  description,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {addLabel}
        </Button>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ItemCard({
  dragHandle,
  title,
  meta,
  description,
  published,
  avatar,
  onEdit,
  onDelete,
}: {
  dragHandle: ReactNode;
  title: string;
  meta: string;
  description: string;
  published: boolean;
  avatar?: string | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group flex gap-3 rounded-xl border bg-background p-3 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      {dragHandle}
      {avatar ? (
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage src={avatar} />
          <AvatarFallback className="rounded-lg">{getInitials(title)}</AvatarFallback>
        </Avatar>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-bold leading-tight">{title}</h3>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              {meta}
            </p>
          </div>
          <Badge variant={published ? "default" : "secondary"}>
            {published ? "Published" : "Draft"}
          </Badge>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-600"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ResourcePanel({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <Card className="overflow-hidden border-primary/20 bg-primary/5">
      <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button asChild>
          <Link href={href}>
            {label}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
    </Card>
  );
}

function TextField({
  label,
  value,
  onChange,
  maxLength,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
      />
      {maxLength ? (
        <p className="text-xs text-muted-foreground">
          {value.length}/{maxLength} characters
        </p>
      ) : null}
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Textarea
        value={value}
        maxLength={maxLength}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
      />
      {maxLength ? (
        <p className="text-xs text-muted-foreground">
          {value.length}/{maxLength} characters
        </p>
      ) : null}
    </div>
  );
}

function PublishSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
      <div>
        <Label>Published</Label>
        <p className="text-xs text-muted-foreground">
          Draft items stay saved but hidden from the website.
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function ImagePicker({
  label,
  value,
  inputRef,
  onUpload,
}: {
  label: string;
  value: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="grid gap-3">
      <Label>{label}</Label>
      <div className="overflow-hidden rounded-xl border bg-muted">
        {value ? (
          <div className="relative h-52">
            <Image src={value} alt={label} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-52 flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm">No image selected</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/heic"
        className="hidden"
        onChange={onUpload}
      />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        {value ? "Change image" : "Upload image"}
      </Button>
    </div>
  );
}

function SaveButton({
  onClick,
  pending,
  label = "Save Changes",
}: {
  onClick: () => void;
  pending: boolean;
  label?: string;
}) {
  return (
    <Button onClick={onClick} disabled={pending}>
      <Save className="mr-2 h-4 w-4" />
      {pending ? "Saving..." : label}
    </Button>
  );
}

function uploadImage(
  event: ChangeEvent<HTMLInputElement>,
  onComplete: (url: string) => void
) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    toast.error("Unsupported file type. Use jpg, jpeg, png, heic, or gif.");
    event.target.value = "";
    return;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    toast.error("File size must not be more than 5MB");
    event.target.value = "";
    return;
  }

  const dismiss = toast.loading("Uploading image...");
  handleFileUpload(event, "media")
    .then((url) => {
      if (!url) return toast.error("Upload failed");
      onComplete(url);
      toast.success("Image uploaded");
    })
    .catch(() => toast.error("Upload failed"))
    .finally(() => {
      toast.dismiss(dismiss);
      event.target.value = "";
    });
}

function showResult(fallback: string) {
  return (res: { error?: string; success?: string }) => {
    if (res?.error) return toast.error(res.error);
    toast.success(res?.success || fallback);
  };
}
