import type { CaseFile, Ownership, CaseFileStatus } from "@/lib/content/types";
import { getInvestigationsForCaseFile } from "@/lib/content/investigations";
import { getDecisionRecordsForCaseFile } from "@/lib/content/decision-records";
import { getEngineeringNotesForCaseFile } from "@/lib/content/engineering-notes";
import { InvestigationView } from "@/components/modules/investigation-view";
import { DecisionRecordView } from "@/components/modules/decision-record-view";
import { EngineeringNoteView } from "@/components/modules/engineering-note-view";

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

export function CaseFileView({ caseFile }: { caseFile: CaseFile }) {
  const investigations = getInvestigationsForCaseFile(caseFile.slug);
  const decisionRecords = getDecisionRecordsForCaseFile(caseFile.slug);
  const notes = getEngineeringNotesForCaseFile(caseFile.slug);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span>{OWNERSHIP_LABEL[caseFile.ownership]}</span>
        <span aria-hidden="true">·</span>
        <span>{STATUS_LABEL[caseFile.status]}</span>
      </div>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{caseFile.displayName}</h1>
      <p className="mt-3 text-lg">{caseFile.question}</p>
      <p className="mt-3 text-sm text-muted-foreground">{caseFile.context}</p>

      {(investigations.length > 0 || decisionRecords.length > 0) && (
        <div className="mt-8 space-y-4">
          {investigations.map((investigation) => (
            <InvestigationView key={investigation.slug} investigation={investigation} />
          ))}
          {decisionRecords.map((record) => (
            <DecisionRecordView key={record.slug} record={record} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Outcome
        </span>
        <p className="mt-1 text-sm">{caseFile.outcome}</p>
      </div>

      {notes.length > 0 && (
        <div className="mt-8 space-y-3">
          {notes.map((note) => (
            <EngineeringNoteView key={note.slug} note={note} />
          ))}
        </div>
      )}

      {caseFile.artifacts.length > 0 && (
        <div className="mt-8 border-t border-border pt-4">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Verify
          </span>
          <ul className="mt-1 space-y-1">
            {caseFile.artifacts.map((artifact) => (
              <li key={artifact.url}>
                <a
                  href={artifact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
                >
                  {artifact.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
