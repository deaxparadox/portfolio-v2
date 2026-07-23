export function EvidenceField({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-t border-border py-3 first:border-t-0 first:pt-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{text}</dd>
    </div>
  );
}
