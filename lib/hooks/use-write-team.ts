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

import { TeamMemberSchema } from "../schemas";
import { handleFileUpload } from "../utils";
import {
  createTeamMemberAction,
  updateTeamMemberAction,
} from "../actions/team";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export const useWriteTeam = ({
  initialData,
  mode,
}: {
  initialData?: TeamMember | null;
  mode: "create" | "edit";
}) => {
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
      status: initialData?.status || "active",
      avatar: initialData?.avatar || "",
      joinDate: initialData?.joinDate
        ? new Date(initialData.joinDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      department: initialData?.department || "",
      location: initialData?.location || "",
      skills: initialData?.skills || [],
      linkedin: initialData?.linkedin || "",
      twitter: initialData?.twitter || "",
      github: initialData?.github || "",
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
      toast.error("File size must not be more than 8MB");
      e.target.value = "";
      return;
    }

    const dismiss = toast.loading("Uploading...");
    startTransition(() => {
      handleFileUpload(e, "profile")
        .then((objectUrl) => {
          if (!objectUrl) {
            toast.error("Upload failed");
            return;
          }
          form.setValue("avatar", objectUrl || initialValues.avatar);
          console.log({ objectUrl });
        })
        .catch((err) => {
          toast.error("Something went wrong");
        })
        .finally(() => {
          toast.dismiss(dismiss);
          e.target.value = "";
        });
    });
  };

  const onSubmit = (values: z.infer<typeof TeamMemberSchema>) => {
    startTransition(() => {
      const payload = {
        ...values,
        joinDate: new Date(values.joinDate),
      } as any;

      if (mode === "create") {
        createTeamMemberAction(payload).then((res) => {
          if (res?.error) toast.error(res.error);
          if (res?.success) {
            toast.success(res.success);
            form.reset();
          }
        });
      } else if (mode === "edit" && initialData?.id) {
        updateTeamMemberAction(initialData.id, payload).then((res) => {
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
    (values.linkedin || "") !== (initialValues.linkedin || "") ||
    (values.twitter || "") !== (initialValues.twitter || "") ||
    (values.github || "") !== (initialValues.github || "");

  return {
    hasChanges,
    isPending,
    form,
    inputRef,
    skillsInput,
    initialValues,
    setSkillsInput,
    addSkill,
    removeSkill,
    onAvatarClick,
    onAvatarChange,
    onSubmit,
  };
};
