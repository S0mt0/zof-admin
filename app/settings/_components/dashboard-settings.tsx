"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
}

const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Michael Johnson", email: "michael@example.com" },
  { id: "4", name: "Emily Davis", email: "emily@example.com" },
  { id: "5", name: "David Brown", email: "david@example.com" },
];

export default function DashboardRoleSettings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [selectedRole, setSelectedRole] = useState("member");

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(mockUsers);
      setSelectedUser(null);
      setPopoverOpen(false);
      return;
    }
    const filtered = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPopoverOpen(filtered.length > 0);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!popoverOpen || filteredUsers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filteredUsers.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(
        (prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      const user = filteredUsers[highlightIndex];
      handleUserSelect(user);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setSearchTerm(user.name);
    setPopoverOpen(false);
  };

  return (
    <div className="space-y-6 max-w-md w-full">
      <h2 className="text-xl font-semibold">Assign Role</h2>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Input
            placeholder="Search user by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <ul className="max-h-60 overflow-y-auto">
            {filteredUsers.map((user, index) => (
              <li
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
                  highlightIndex === index ? "bg-gray-100" : ""
                }`}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <Select value={selectedRole} onValueChange={setSelectedRole}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="moderator">Moderator</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>

      <Button disabled={!selectedUser}>Assign Role</Button>
    </div>
  );
}
