import { unstable_cache } from "next/cache";

import { DashboardHeader } from "@/components/dashboard-header";
import { Messages } from "./_components/messages";
import { countUnreadMessages, getAllMessages } from "@/lib/db/repository";
import { db } from "@/lib/db";

const allMessages = [
  {
    sender: "John Smith",
    email: "john.smith@email.com",
    subject: "Volunteer Opportunity Inquiry",
    content:
      "Hi, I'm interested in volunteering for your upcoming community outreach program...",
    status: "unread" as MessageStatus,
  },
  {
    sender: "Maria Garcia",
    email: "maria.garcia@email.com",
    subject: "Donation Receipt Request",
    content:
      "Could you please send me a receipt for my recent donation of $500...",
    status: "read" as MessageStatus,
  },
  {
    sender: "David Johnson",
    email: "david.johnson@email.com",
    subject: "Event Partnership Proposal",
    content:
      "Our organization would like to partner with you for the upcoming fundraising gala...",
    status: "unread" as MessageStatus,
  },
  {
    sender: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    subject: "Thank You for the Workshop",
    content:
      "I wanted to thank you for the amazing health workshop last week...",
    status: "read" as MessageStatus,
  },
  {
    sender: "Michael Brown",
    email: "michael.brown@email.com",
    subject: "Media Interview Request",
    content:
      "I'm a journalist with Local News and would love to interview Zita about...",
    status: "unread" as MessageStatus,
  },
  {
    sender: "Lisa Chen",
    email: "lisa.chen@email.com",
    subject: "Sponsorship Opportunity",
    content:
      "Our company is interested in sponsoring your next community event...",
    status: "read" as MessageStatus,
  },
  {
    sender: "Robert Taylor",
    email: "robert.taylor@email.com",
    subject: "Volunteer Training Question",
    content:
      "I have some questions about the upcoming volunteer training session...",
    status: "unread" as MessageStatus,
  },
  {
    sender: "Amanda Rodriguez",
    email: "amanda.rodriguez@email.com",
    subject: "Program Feedback",
    content:
      "I wanted to share some feedback about the youth mentorship program...",
    status: "read" as MessageStatus,
  },
  {
    sender: "James Wilson",
    email: "james.wilson@email.com",
    subject: "Collaboration Request",
    content:
      "We're reaching out to explore potential collaboration opportunities...",
    status: "unread" as MessageStatus,
  },
  {
    sender: "Jennifer Lee",
    email: "jennifer.lee@email.com",
    subject: "Event Attendance Confirmation",
    content:
      "I'm writing to confirm my attendance at the upcoming fundraising gala...",
    status: "read" as MessageStatus,
  },
  {
    sender: "Thomas Anderson",
    email: "thomas.anderson@email.com",
    subject: "Grant Application Support",
    content:
      "We would like to offer our support for your upcoming grant application...",
    status: "unread" as MessageStatus,
  },
  {
    sender: "Patricia Moore",
    email: "patricia.moore@email.com",
    subject: "Community Survey Response",
    content:
      "Thank you for conducting the community needs survey. Here are my thoughts...",
    status: "read" as MessageStatus,
  },
  {
    sender: "Christopher Davis",
    email: "christopher.davis@email.com",
    subject: "Volunteer Appreciation",
    content:
      "I wanted to express my gratitude for the volunteer appreciation event...",
    status: "read" as MessageStatus,
  },
  {
    sender: "Michelle Thompson",
    email: "michelle.thompson@email.com",
    subject: "Educational Workshop Inquiry",
    content:
      "I'm interested in attending your upcoming educational workshop series...",
    status: "unread" as MessageStatus,
  },
  {
    sender: "Daniel Martinez",
    email: "daniel.martinez@email.com",
    subject: "Partnership Proposal",
    content:
      "Our local business would like to explore partnership opportunities...",
    status: "read" as MessageStatus,
  },
];

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
    limit?: string;
  };
}) {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams?.limit) || 10;

  const getMessagesCached = unstable_cache(
    getAllMessages,
    [
      "messages",
      page.toString(),
      limit.toString(),
      searchParams.search || "",
      searchParams.status || "",
      searchParams.limit || "",
    ],
    {
      tags: ["messages"],
      revalidate: 300, // revalidate every 5 minutes
    }
  );

  const { data, pagination } = await getMessagesCached({
    page,
    limit,
    search: searchParams.search,
    status: searchParams.status as MessageStatus,
  });

  const getUnreadMessagesCountCached = unstable_cache(
    countUnreadMessages,
    ["unread-messages-count"],
    {
      tags: ["unread-messages-count"],
      revalidate: 300, // revalidate every 5 minutes
    }
  );

  const unreadCount = await getUnreadMessagesCountCached();

  // await db.message.createMany({
  //   data: allMessages,
  // });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <DashboardHeader breadcrumbs={[{ label: "Messages" }]} />

      <Messages
        messages={data}
        pagination={pagination}
        searchParams={searchParams}
        unreadCount={unreadCount}
      />
    </div>
  );
}
