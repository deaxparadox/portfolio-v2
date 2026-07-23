import type { DecisionRecord } from "@/lib/content/types";
import { EvidenceField } from "@/components/modules/evidence-field";

export function DecisionRecordView({ record }: { record: DecisionRecord }) {
  return (
    <section className="rounded-lg border border-border p-5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Decision Record
      </span>
      <h3 className="mt-1 text-base font-semibold">{record.title}</h3>
      <dl>
        <EvidenceField label="Problem" text={record.problem} />
        <EvidenceField label="Alternatives" text={record.alternatives} />
        <EvidenceField label="Decision" text={record.decision} />
        <EvidenceField label="Trade-offs" text={record.tradeoffs} />
        <EvidenceField label="Consequences" text={record.consequences} />
      </dl>
    </section>
  );
}
