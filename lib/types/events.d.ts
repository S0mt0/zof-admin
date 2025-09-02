type EventStatus = "upcoming" | "draft" | "completed" | "cancelled";

interface IEvent {
  id: string;
  name: string;
  slug: string;
  detail?: string | null;
  excerpt?: string | null;
  organizer?: string | null;
  date: Date;
  startTime: string;
  endTime: string | null;
  location: string;
  maxAttendees: number | null;
  currentAttendees: number;
  bannerImage: string;
  status: EventStatus;
  featured: boolean;
  tags: string[];
  ticketPrice?: string | null;
  registrationRequired: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUser?: Partial<IUser> | null;
}

interface EventFiltersProps {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
    limit?: string;
  };
  selectedCount: number;
  onBulkDelete: () => void;
}

interface EventPageProps extends Paginated<IEvent> {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
    limit?: string;
  };
}

interface EventTableProps extends Paginated<IEvent> {
  selectedEvents: string[];
  onSelectEvent: (eventId: string) => void;
  onSelectAll: () => void;
  onViewEvent: (event: IEvent) => void;
  onEditEvent: (event: IEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  allCurrentSelected: boolean;
  someCurrentSelected: boolean;
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
    limit?: string;
  };
}

interface EventTableContentProps {
  events: IEvent[];
  selectedEvents: string[];
  onSelectEvent: (eventId: string) => void;
  onViewEvent: (event: IEvent) => void;
  onEditEvent: (event: IEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}
