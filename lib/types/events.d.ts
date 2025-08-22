type EventStatus = "upcoming" | "draft" | "completed" | "cancelled";

interface IEvent {
  id: string;
  title: string;
  description: string;
  content: string | null;
  date: Date;
  startTime: string;
  endTime: string | null;
  location: string;
  maxAttendees: number | null;
  currentAttendees: number;
  bannerImage: string | null;
  status: EventStatus;
  featured: boolean;
  tags: string[];
  ticketPrice?: number | null;
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
  };
  selectedCount: number;
  onBulkDelete: () => void;
  onCreateNew: () => void;
}

interface EventPageProps {
  events: IEvent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
  };
}

interface EventTableProps {
  events: IEvent[];
  selectedEvents: string[];
  onSelectEvent: (eventId: string) => void;
  onSelectAll: () => void;
  onViewEvent: (event: IEvent) => void;
  onEditEvent: (event: IEvent) => void;
  onManageAttendees: (event: IEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  allCurrentSelected: boolean;
  someCurrentSelected: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    featured?: string;
  };
}
