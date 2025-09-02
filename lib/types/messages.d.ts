type MessageStatus = "read" | "unread";

interface IMessage {
  id: string;
  sender: string;
  email: string;
  subject: string;
  content: string;
  status: MessageStatus;
  avatar?: string | null;

  senderId?: string | null;
  senderUser?: User | null;

  createdAt: Date;
  updatedAt: Date;
}

interface MessagesProps extends Paginated<IMessage> {
  unreadCount: number;
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    limit?: string;
  };
}

interface MessageFiltersProps {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    limit?: string;
  };
  selectedCount: number;
  onBulkDelete: () => void;
  unreadCount: number;
}
