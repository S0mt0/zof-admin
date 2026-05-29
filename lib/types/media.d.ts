interface GalleryPageContent {
  id: string;
  hero: GalleryHeroSectionContent;
  archive: GalleryArchiveSectionContent;
  createdAt: Date;
  updatedAt: Date;
}

type GallerySection = "hero" | "archive";

interface GalleryHeroSectionContent {
  intro: SectionIntroContent;
  primaryImage?: string | null;
  secondaryImage?: string | null;
  heroBackgroundColor?: string | null;
}

interface GalleryArchiveSectionContent {
  intro: SectionIntroContent;
}

type MediaKind = "photo" | "video";

type PhotoItem = {
  type: "photo";
  src: string;
  alt: string;
  caption?: string;
  description?: string;
};

type VideoItem = {
  type: "video";
  src: string;
  poster: string;
  title: string;
  caption?: string;
  description?: string;
};

type MediaItem = PhotoItem | VideoItem;

type MediaRecord = {
  id: string;
  srcKey: string;
  posterKey?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUser?: Partial<IUser> | null;
} & (
  | {
      type: "photo";
      src: string;
      alt: string;
      caption?: string | null;
      description?: string | null;
      poster?: null;
      title?: null;
    }
  | {
      type: "video";
      src: string;
      poster?: string | null;
      title: string;
      caption?: string | null;
      description?: string | null;
      alt?: null;
    }
);

interface MediaPageProps extends Paginated<MediaRecord> {
  searchParams: {
    page?: string;
    search?: string;
    type?: string;
    limit?: string;
  };
}

interface MediaFiltersProps {
  searchParams: {
    page?: string;
    search?: string;
    type?: string;
    limit?: string;
  };
  isPending: boolean;
}
