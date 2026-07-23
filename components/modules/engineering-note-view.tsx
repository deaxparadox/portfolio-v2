import type { EngineeringNote } from "@/lib/content/types";

export function EngineeringNoteView({ note }: { note: EngineeringNote }) {
  return (
    <div className="rounded-lg border border-border bg-foreground/5 p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Engineering Note
      </span>
      <p className="mt-1 text-sm font-semibold">{note.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{note.insight}</p>
    </div>
  );
}
