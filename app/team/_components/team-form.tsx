"use client";

import {
  useMemo,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
import { ChevronDown, Save, Upload } from "lucide-react";

import { TeamMemberSchema } from "@/lib/schemas";
import { createTeamMemberAction, updateTeamMemberAction } from "@/lib/actions";
import { getInitials, handleFileUpload } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface TeamFormProps {
  initialData?: TeamMember | null;
  mode: "create" | "edit";
  addedBy: string; // current user id
}

export default function TeamForm({
  initialData,
  mode,
  addedBy,
}: TeamFormProps) {
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [skillsInput, setSkillsInput] = useState("");

  const initialValues = useMemo(
    () => ({
      name: initialData?.name || "",
      role: initialData?.role || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      bio: initialData?.bio || "",
      status: (initialData?.status as any) || "active",
      avatar: initialData?.avatar || "",
      joinDate: initialData?.joinDate
        ? new Date(initialData.joinDate as any).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      department: initialData?.department || "",
      location: initialData?.location || "",
      skills: initialData?.skills || [],
      socialLinks: {
        linkedin: (initialData as any)?.linkedin || "",
        twitter: (initialData as any)?.twitter || "",
        github: (initialData as any)?.github || "",
      },
    }),
    [initialData]
  );

  const form = useForm<z.infer<typeof TeamMemberSchema>>({
    resolver: zodResolver(TeamMemberSchema),
    defaultValues: initialValues,
  });

  const addSkill = () => {
    const skill = skillsInput.trim();
    if (!skill) return;
    const current = form.getValues("skills") || [];
    if (current.includes(skill)) return;
    form.setValue("skills", [...current, skill]);
    setSkillsInput("");
  };

  const removeSkill = (skill: string) => {
    const current = form.getValues("skills") || [];
    form.setValue(
      "skills",
      current.filter((s) => s !== skill)
    );
  };

  const onAvatarClick = () => inputRef.current?.click();

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 1) {
      toast.error("Please select only one file");
      e.target.value = "";
      return;
    }
    const file = files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use jpg, jpeg, png, or gif.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    const dismiss = toast.loading("Uploading...");
    startTransition(() => {
      void (async () => {
        try {
          const objectUrl = await handleFileUpload(e, "profile");
          if (!objectUrl) {
            toast.error("Upload failed");
            return;
          }
          form.setValue("avatar", objectUrl);
          toast.success("Photo uploaded");
        } catch (err) {
          toast.error("Something went wrong");
        } finally {
          toast.dismiss(dismiss);
          e.target.value = "";
        }
      })();
    });
  };

  const onSubmit = (values: z.infer<typeof TeamMemberSchema>) => {
    startTransition(() => {
      if (mode === "create") {
        createTeamMemberAction(values, addedBy).then((res) => {
          if (res?.error) toast.error(res.error);
          if (res?.success) {
            toast.success(res.success);
            form.reset();
          }
        });
      } else if (mode === "edit" && initialData?.id) {
        updateTeamMemberAction(initialData.id, values).then((res) => {
          if (res?.error) toast.error(res.error);
          if (res?.success) toast.success(res.success);
        });
      }
    });
  };

  const values = form.watch();
  const arraysEqual = (a: string[] = [], b: string[] = []) =>
    a.length === b.length && a.every((v, i) => v === b[i]);
  const hasChanges =
    values.name !== initialValues.name ||
    values.role !== initialValues.role ||
    values.email !== initialValues.email ||
    values.phone !== initialValues.phone ||
    values.bio !== initialValues.bio ||
    values.status !== initialValues.status ||
    values.avatar !== initialValues.avatar ||
    values.joinDate !== initialValues.joinDate ||
    values.department !== initialValues.department ||
    values.location !== initialValues.location ||
    !arraysEqual(values.skills || [], initialValues.skills || []) ||
    (values.socialLinks?.linkedin || "") !==
      (initialValues.socialLinks?.linkedin || "") ||
    (values.socialLinks?.twitter || "") !==
      (initialValues.socialLinks?.twitter || "") ||
    (values.socialLinks?.github || "") !==
      (initialValues.socialLinks?.github || "");

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
                      name="socialLinks.linkedin"
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
                      name="socialLinks.twitter"
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
                      name="socialLinks.github"
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
                        ? "Creating member..."
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
                src={form.watch("avatar") || "/placeholder.svg"}
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
