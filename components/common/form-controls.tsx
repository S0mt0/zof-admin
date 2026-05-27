"use client";

import Image from "next/image";
import type { ChangeEvent, RefObject } from "react";
import { ImagePlus, Save, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function TextField({
  label,
  value,
  onChange,
  maxLength,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  type?: string;
}) {
  return (
    <div className="grid min-w-0 content-start gap-2">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
      />
      {maxLength ? (
        <p className="text-xs text-muted-foreground">
          {value.length}/{maxLength} characters
        </p>
      ) : null}
    </div>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <div className="grid min-w-0 content-start gap-2">
      <Label>{label}</Label>
      <Textarea
        value={value}
        maxLength={maxLength}
        rows={6}
        onChange={(event) => onChange(event.target.value)}
        className="scrollbar-none"
      />
      {maxLength ? (
        <p className="text-xs text-muted-foreground">
          {value.length}/{maxLength} characters
        </p>
      ) : null}
    </div>
  );
}

export function PublishSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-muted/20 px-4 py-3">
      <div>
        <Label>Published</Label>
        <p className="text-xs text-muted-foreground">
          Draft items stay saved but hidden from the website.
        </p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function ImagePicker({
  label,
  value,
  inputRef,
  onUpload,
}: {
  label: string;
  value: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="grid min-w-0 content-start gap-3">
      <Label>{label}</Label>
      <div className="overflow-hidden rounded-xl border bg-muted">
        {value ? (
          <div className="relative h-52">
            <Image src={value} alt={label} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-52 flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm">No image selected</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/heic"
        className="hidden"
        onChange={onUpload}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {value ? "Change image" : "Upload image"}
      </Button>
    </div>
  );
}

export function SaveButton({
  onClick,
  pending,
  label = "Save Changes",
}: {
  onClick: () => void;
  pending: boolean;
  label?: string;
}) {
  return (
    <Button onClick={onClick} disabled={pending}>
      <Save className="mr-2 h-4 w-4" />
      {pending ? "Saving..." : label}
    </Button>
  );
}
