import type { Investigation } from "@/lib/content/types";
import { EvidenceField } from "@/components/modules/evidence-field";

export function InvestigationView({ investigation }: { investigation: Investigation }) {
  return (
    <section className="rounded-lg border border-border p-5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Investigation
      </span>
      <h3 className="mt-1 text-base font-semibold">{investigation.title}</h3>
      <dl>
        <EvidenceField label="Problem" text={investigation.problem} />
        <EvidenceField label="Symptoms" text={investigation.symptoms} />
        <EvidenceField label="Initial assumptions" text={investigation.initialAssumptions} />
        <EvidenceField label="Investigation" text={investigation.investigationTimeline} />
        <EvidenceField label="Root cause" text={investigation.rootCause} />
        <EvidenceField label="Verification" text={investigation.verification} />
        <EvidenceField label="Fix" text={investigation.fix} />
        <EvidenceField label="Prevention" text={investigation.prevention} />
      </dl>
    </section>
  );
}
