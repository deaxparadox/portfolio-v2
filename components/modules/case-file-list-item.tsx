import Link from "next/link";
import type { CaseFile } from "@/lib/content/types";
import { CaseFileBadges } from "@/components/modules/case-file-badges";

export function CaseFileListItem({ caseFile }: { caseFile: CaseFile }) {
  return (
    <Link
      href={`/projects/${caseFile.slug}`}
      className="block rounded-lg border border-border p-5 transition-colors hover:border-foreground/30"
    >
      <p className="text-base font-semibold">{caseFile.displayName}</p>
      <p className="mt-1 text-sm text-muted-foreground">{caseFile.question}</p>
      <div className="mt-3">
        <CaseFileBadges caseFile={caseFile} />
      </div>
    </Link>
  );
}
