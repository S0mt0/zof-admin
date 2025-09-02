"use client";

import { Pagination } from "@/components/ui/pagination-v2";
import { MessageCard } from "./message-card";
import { MessageFilters } from "./message-filter";
import { useMessages } from "@/lib/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import EmailModal from "@/components/email-modal";
import ViewMessageModal from "./view-message-modal";

export const Messages = ({
  data: messages,
  pagination,
  searchParams,
  unreadCount,
}: MessagesProps) => {
  const {
    selectedMessages,
    allCurrentSelected,
    someCurrentSelected,
    isPending,
    messageOpen,
    replyModalOpen,
    replyMessage,
    replyTo,
    replySubject,
    activeMessage,
    handleBulkDelete,
    handleSelectAll,
    handleDelete,
    sendReply,
    handleSelectMessage,
    toggleMessageStatus,
    toggleMessageModal,
    setReplySubject,
    setReplyModalOpen,
    setReplyMessage,
    openReplyModal,
  } = useMessages(messages);

  return (
    <div className="flex flex-col gap-4">
      <MessageFilters
        searchParams={searchParams}
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedMessages.length}
        unreadCount={unreadCount}
      />

      {messages.length === 0 ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inbox</CardTitle>
                <CardDescription>
                  There are no messages in your inbox right now.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inbox</CardTitle>
                <CardDescription>
                  Manage your messages and communications.
                </CardDescription>
              </div>
              <Checkbox
                checked={allCurrentSelected}
                onCheckedChange={handleSelectAll}
                ref={(el) => {
                  const input = el as HTMLInputElement | null;
                  if (input && input.type === "checkbox") {
                    input.indeterminate =
                      someCurrentSelected && !allCurrentSelected;
                  }
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  handleDeleteMessage={handleDelete}
                  openReplyModal={openReplyModal}
                  handleSelectMessage={handleSelectMessage}
                  handleToggleReadStatus={toggleMessageStatus}
                  selectedMessages={selectedMessages}
                  toggleMessageModal={toggleMessageModal}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <EmailModal
        open={replyModalOpen}
        to={replyTo}
        subject={replySubject}
        message={replyMessage}
        onSubjectChange={setReplySubject}
        onMessageChange={setReplyMessage}
        onClose={() => setReplyModalOpen(false)}
        onSend={sendReply}
        disabled={isPending}
        pending={isPending}
      />

      <ViewMessageModal
        messageOpen={messageOpen}
        toggleMessageModal={toggleMessageModal}
        message={activeMessage}
        handleToggleReadStatus={toggleMessageStatus}
      />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        showingStart={(pagination.page - 1) * pagination.limit + 1}
        showingEnd={Math.min(
          pagination.page * pagination.limit,
          pagination.total
        )}
        totalItems={pagination.total}
        itemName="messages"
      />
    </div>
  );
};
