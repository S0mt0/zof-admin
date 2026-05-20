"use client";
import { useState, useEffect, useRef, useTransition } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { capitalize } from "@/lib/utils";
import { getAllUsers } from "@/lib/db/repository/user.service";
import {
  changeUserRoleAction,
  deleteUserAccountAction,
} from "@/lib/actions/users";

interface RolesSettingsProps {
  users: Awaited<ReturnType<typeof getAllUsers>>;
  currentUserId: string;
}

export function RolesSettings({ users, currentUserId }: RolesSettingsProps) {
  const [query, setQuery] = useState("");
  const [availableUsers, setAvailableUsers] = useState(users);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [role, setRole] = useState<Role>("user");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredUsers(availableUsers);
      setSelectedUser(null);
      setShowDropdown(false);
    } else {
      const results = availableUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );

      setFilteredUsers(results);
      setShowDropdown(true);
    }
  }, [availableUsers, query]);

  useEffect(() => {
    setAvailableUsers(users);
  }, [users]);

  useOnClickOutside(dropdownRef as React.RefObject<HTMLElement>, () =>
    setShowDropdown(false)
  );

  useEffect(() => {
    if (selectedUser) {
      setRole(selectedUser.role);
      setShowDropdown(false);
    }
  }, [selectedUser]);

  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!selectedUser) return;
    startTransition(() => {
      changeUserRoleAction(selectedUser.id, role).then((data) => {
        if (data?.error) toast.error(data.error);

        if (data?.success) {
          toast.success(data.success);
          setAvailableUsers((prev) =>
            prev.map((user) =>
              user.id === selectedUser.id ? { ...user, role } : user
            )
          );
          setSelectedUser(null);
          setQuery("");
        }
      });
    });
  };

  const handleDelete = () => {
    if (!selectedUser || selectedUser.id === currentUserId) return;

    startTransition(() => {
      deleteUserAccountAction(selectedUser.id).then((data) => {
        if (data?.error) toast.error(data.error);

        if (data?.success) {
          toast.success(data.success);
          setAvailableUsers((prev) =>
            prev.filter((user) => user.id !== selectedUser.id)
          );
          setSelectedUser(null);
          setQuery("");
        }
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage User Roles</CardTitle>
        <CardDescription>
          Changing or assigning roles determines what privileges a user has.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative" ref={dropdownRef}>
          <Input
            placeholder="Search users by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowDropdown(true)}
            disabled={isPending}
          />
          {showDropdown && filteredUsers.length > 0 && (
            <Card className="absolute z-50 mt-2 w-full dark:bg-gray-900 max-h-48 max-w-96 overflow-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="cursor-pointer px-3 py-2 dark:hover:bg-emerald-100/10 text-sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setRole(user.role);
                    setQuery(
                      `${user.name} (${user.email.toLocaleLowerCase()})`
                    );
                  }}
                >
                  {user.name}
                </div>
              ))}
            </Card>
          )}
        </div>

        {selectedUser && (
          <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
            <strong className="text-sm dark:text-black">Current role:</strong>{" "}
            <Badge variant="default" className="bg-black">
              {capitalize(selectedUser.role)}
            </Badge>
          </div>
        )}

        <SelectGroup>
          {selectedUser && (
            <SelectLabel className="pl-1">
              Assign {selectedUser.name} a different role
            </SelectLabel>
          )}
          <Select
            value={role}
            defaultValue={selectedUser?.role}
            onValueChange={(value: Role) => setRole(value)}
            disabled={isPending}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="rep">Rep</SelectItem>
            </SelectContent>
          </Select>
        </SelectGroup>

        <div className="flex gap-2">
          <Button
            disabled={!selectedUser || isPending || selectedUser.role === role}
            onClick={handleClick}
          >
            {isPending ? "Updating..." : "Update Role"}
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={
              !selectedUser || isPending || selectedUser.id === currentUserId
            }
            onClick={handleDelete}
          >
            {isPending ? "Please wait..." : "Delete Admin/User"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
