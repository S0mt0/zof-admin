import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TextareaField, TextField } from "@/components/common/form-controls";

export function SectionCopyCard({
  title,
  intro,
  onIntroChange,
  children,
  footer,
}: {
  title: string;
  intro: SectionIntroContent;
  onIntroChange: (intro: SectionIntroContent) => void;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          The small theme title, main heading, and paragraph shown on the
          frontend.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid items-start gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid content-start gap-6">
          <TextField
            label="Small theme title"
            value={intro.eyebrow}
            onChange={(eyebrow) => onIntroChange({ ...intro, eyebrow })}
          />
          <TextField
            label="Heading"
            value={intro.heading}
            maxLength={120}
            onChange={(heading) => onIntroChange({ ...intro, heading })}
          />
          <TextareaField
            label="Description"
            value={intro.description}
            maxLength={280}
            onChange={(description) => onIntroChange({ ...intro, description })}
          />
        </div>
        <div className="grid content-start gap-4">{children}</div>
      </CardContent>
      {footer ? (
        <CardFooter className="justify-end border-t bg-muted/20 px-6 py-4">
          {footer}
        </CardFooter>
      ) : null}
    </Card>
  );
}
