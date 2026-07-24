import { caseFiles } from "@/lib/content/case-files";
import { CaseFileBrowser } from "@/components/modules/case-file-browser";

// Not using RouteContainer here: CaseFileBrowser composes its own header,
// rail, and stage directly inside PrimaryWorkspace's existing frame (no
// second nested border) — the coverflow's circular geometry is also far
// wider than the standard max-w-4xl content width, and needs its own
// overflow-hidden wrapper so the off-screen side cards don't create
// horizontal page scroll (PrimaryWorkspace only contains vertical overflow).
export default function ProjectsPage() {
  return (
    <div className="h-full overflow-hidden">
      <CaseFileBrowser caseFiles={caseFiles} />
    </div>
  );
}
