type EventStatus =
  | "upcoming"
  | "completed"
  | "happening"
  | "draft"
  | "cancelled";

type PublicEventStatus = "upcoming" | "completed" | "happening";

interface IEvent {
  id: string;
  name: string;
  slug: string;
  detail: string;
  excerpt: string;
  organizer: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  maxAttendees?: number | null;
  currentAttendees: number;
  bannerImage: string;
  status: EventStatus;
  featured: boolean;
  tags: string[];
  comments?: IEventComment[];
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
  isPending: boolean;
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
  onSelectEvent: (eventId: string) => void;
  onSelectAll: () => void;
  onViewEvent: (event: IEvent) => void;
  onEditEvent: (event: IEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedEvents: string[];
  isPending: boolean;
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
  isPending: boolean;
  events: IEvent[];
  selectedEvents: string[];
  onSelectEvent: (eventId: string) => void;
  onViewEvent: (event: IEvent) => void;
  onEditEvent: (event: IEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}
