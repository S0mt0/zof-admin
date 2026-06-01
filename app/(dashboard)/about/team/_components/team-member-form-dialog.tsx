"use client";

import { ChevronDown, Save, Upload } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWriteTeam } from "@/lib/hooks";
import { teamSocialFields } from "@/lib/team-social-fields";
import { getInitials } from "@/lib/utils";

export function TeamMemberFormDialog({
  open,
  mode,
  initialData,
  onOpenChange,
}: {
  open: boolean;
  mode: "create" | "edit";
  initialData?: TeamMember | null;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    form,
    hasChanges,
    isPending,
    inputRef,
    skillsInput,
    addSkill,
    onAvatarChange,
    onAvatarClick,
    onSubmit,
    removeSkill,
    setSkillsInput,
  } = useWriteTeam({
    mode,
    initialData,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add team member" : "Edit team member"}
          </DialogTitle>
          <DialogDescription>
            Add profile details, contact information, and public social links.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5">
            <div className="flex items-center gap-4 rounded-md border p-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={form.watch("avatar") || "/placeholder-user.jpg"}
                  alt={form.watch("name") || "Team member"}
                />
                <AvatarFallback>
                  {form.watch("name") ? getInitials(form.watch("name")) : ""}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 space-x-2">
                <FormLabel>Profile Photo</FormLabel>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/heic"
                  className="hidden"
                  onChange={onAvatarChange}
                  multiple={false}
                  disabled={isPending}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={onAvatarClick}
                  disabled={isPending}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {form.watch("avatar") ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter full name..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role/Position</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Program Coordinator"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@foundation.org"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="+234 ..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Programs" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Abuja, Remote" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span className="capitalize">{field.value}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {["active", "inactive", "suspended"].map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => field.onChange(status)}
                          >
                            <span className="capitalize">{status}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Brief description..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <FormLabel>Skills & Expertise</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add skill..."
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.watch("skills") || []).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    {skill} x
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {teamSocialFields.map((social) => (
                <FormField
                  key={social.name}
                  control={form.control}
                  name={social.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{social.label}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={social.placeholder} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="github.com/username" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !hasChanges}>
                <Save className="mr-2 h-4 w-4" />
                {isPending
                  ? "Please wait..."
                  : mode === "create"
                  ? "Add Team Member"
                  : "Update Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
