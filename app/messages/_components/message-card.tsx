"use client";
import { Clock, Mail, MoreHorizontal, Reply, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { capitalize } from "@/lib/utils";

interface MessageCardProps {
  message: IMessage;
  selectedMessages: string[];
  handleSelectMessage: (id: string) => void;
  openReplyModal: (message: IMessage) => void;
  handleToggleReadStatus: (id: string) => void;
  handleDeleteMessage: (id: string) => void;
  toggleMessageModal: (id: string) => void;
}

export const MessageCard = ({
  message,
  handleSelectMessage,
  selectedMessages,
  openReplyModal,
  handleDeleteMessage,
  handleToggleReadStatus,
  toggleMessageModal,
}: MessageCardProps) => {
  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:bg-gray-50 cursor-pointer ${
        message.status === "unread" ? "bg-pink-50 border-pink-200" : "bg-white"
      }`}
      onClick={() => toggleMessageModal(message.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={selectedMessages.includes(message.id)}
            onCheckedChange={() => handleSelectMessage(message.id)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`font-medium ${
                  message.status === "unread" ? "font-semibold" : ""
                }`}
              >
                {capitalize(message.sender)}
              </h3>
              {message.status === "unread" && (
                <div className="h-2 w-2 bg-pink-500 rounded-full"></div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {message.email}
            </p>
            <p
              className={`text-sm mb-2 ${
                message.status === "unread" ? "font-medium" : ""
              }`}
            >
              {message.subject}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2 overflow-ellipsis">
              {message.content}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatDistanceToNow(message.createdAt, {
              addSuffix: true,
            })}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  openReplyModal(message);
                }}
                className="cursor-pointer"
              >
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleReadStatus(message.id);
                }}
                className="cursor-pointer"
              >
                <Mail className="mr-2 h-4 w-4" />
                Mark as read
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMessage(message.id);
                }}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
