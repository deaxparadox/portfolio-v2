import type { CaseFile, Ownership, CaseFileStatus } from "@/lib/content/types";

const OWNERSHIP_LABEL: Record<Ownership, string> = {
  solo: "Solo build",
  "core-contributor": "Core contributor",
  rescue: "Rescue engagement",
  inherited: "Inherited codebase",
};

const STATUS_LABEL: Record<CaseFileStatus, string> = {
  active: "Active",
  dormant: "Dormant",
  closed: "Closed",
  production: "In production",
};

export function CaseFileBadges({ caseFile }: { caseFile: CaseFile }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      <span>{OWNERSHIP_LABEL[caseFile.ownership]}</span>
      <span aria-hidden="true">·</span>
      <span>{STATUS_LABEL[caseFile.status]}</span>
      {caseFile.hasOpenRisk && (
        <>
          <span aria-hidden="true">·</span>
          <span className="text-foreground">
            <span aria-hidden="true">● </span>
            Needs attention
          </span>
        </>
      )}
    </div>
  );
}
