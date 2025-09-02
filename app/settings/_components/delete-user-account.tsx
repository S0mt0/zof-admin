"use client";
import { useState, useEffect, useRef, useTransition } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { capitalize } from "@/lib/utils";
import { getAllUsers } from "@/lib/db/repository";
import { deleteUserAccountAction } from "@/lib/actions/users";

interface DeleteUsersAccountProps {
  users: Awaited<ReturnType<typeof getAllUsers>>;
}

export function DeleteUsersAccount({ users }: DeleteUsersAccountProps) {
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredUsers(users);
      setSelectedUser(null);
      setShowDropdown(false);
    } else {
      const results = users.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredUsers(results);
      setShowDropdown(true);
    }
  }, [query, users]);

  useOnClickOutside(dropdownRef as React.RefObject<HTMLElement>, () =>
    setShowDropdown(false)
  );

  useEffect(() => {
    if (selectedUser) setShowDropdown(false);
  }, [selectedUser]);

  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!selectedUser) return;
    if (
      !confirm(
        `Are you sure you want to delete ${capitalize(selectedUser.name)}? `
      )
    )
      return;

    startTransition(() => {
      deleteUserAccountAction(selectedUser.id).then((data) => {
        if (data?.error) toast.error(data.error);

        if (data?.success) {
          toast.success(data.success);
          setSelectedUser(null);
          setQuery("");
        }
      });
    });
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Remove Users</CardTitle>
        <CardDescription>
          Deleted users loose access to the dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex-col gap-4">
        <div className="relative w-full" ref={dropdownRef}>
          <Input
            placeholder="Search users by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowDropdown(true)}
            disabled={isPending}
          />
          {showDropdown && filteredUsers.length > 0 && (
            <div className="absolute z-50 mt-1 w-full max-h-48 max-w-96 overflow-auto rounded-md border bg-white shadow-md">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setQuery(
                      `${user.name} (${user.email.toLocaleLowerCase()})`
                    );
                  }}
                >
                  {capitalize(user.name)}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedUser && (
          <Button
            disabled={!selectedUser || isPending}
            onClick={handleClick}
            variant="destructive"
          >
            {isPending ? "Deleting..." : "Delete Account"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
