"use client";
import { ChevronDown, Save, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getInitials } from "@/lib/utils";
import { useWriteTeam } from "@/lib/hooks";

interface TeamFormProps {
  initialData?: TeamMember | null;
  mode: "create" | "edit";
}

export default function TeamForm({ mode, initialData }: TeamFormProps) {
  const {
    initialValues,
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
  } = useWriteTeam({ mode, initialData });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "create" ? "Basic Information" : "Edit Information"}
            </CardTitle>
            {mode === "create" && (
              <CardDescription>
                Add details for the new team member
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

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

                <div className="space-y-2">
                  <FormLabel>Skills & Expertise</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add skill..."
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                    />
                    <Button type="button" onClick={addSkill} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.watch("skills") || []).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <FormLabel>Social Links</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://linkedin.com/in/username"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://twitter.com/username"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="github"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://github.com/username"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => form.reset(initialValues)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending || !hasChanges}>
                    <Save className="h-4 w-4 mr-2" />
                    {isPending
                      ? mode === "create"
                        ? "Adding member..."
                        : "Updating member..."
                      : mode === "create"
                      ? "Add Team Member"
                      : "Update Member"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload a square image for best results
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarImage
                src={form.watch("avatar")}
                alt={form.watch("name")}
              />
              <AvatarFallback className="text-lg">
                {form.watch("name") ? getInitials(form.watch("name")) : ""}
              </AvatarFallback>
            </Avatar>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              className="hidden"
              onChange={onAvatarChange}
              multiple={false}
              disabled={isPending}
            />
            <Button
              onClick={onAvatarClick}
              variant="outline"
              size="sm"
              disabled={isPending}
            >
              <Upload className="h-4 w-4 mr-2" />
              {form.watch("avatar") ? "Change Photo" : "Upload Photo"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="capitalize">{form.watch("status")}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "active")}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "inactive")}
                >
                  Inactive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => form.setValue("status", "suspended")}
                >
                  Suspended
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
