import type { TimelineRecord } from "@/lib/content/types";

/**
 * Deliberately not a WorkbenchModule — a timeline entry has nothing further
 * to reveal on click, so it doesn't get an expand affordance it can't use.
 * Not every object needs the same interaction.
 */
export function TimelineStrip({ record }: { record: TimelineRecord }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Timeline
      </span>
      <p className="mt-2 text-base font-semibold">{record.organization}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {record.role} · {record.period}
      </p>
    </div>
  );
}
