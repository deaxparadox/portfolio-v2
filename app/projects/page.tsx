import { caseFiles } from "@/lib/content/case-files";
import { CaseFileDrum } from "@/components/modules/case-file-drum";

// Not using RouteContainer here: the coverflow's circular geometry is far
// wider than the standard max-w-4xl content width, and needs its own
// overflow-hidden wrapper so the off-screen side cards don't create
// horizontal page scroll (PrimaryWorkspace only contains vertical overflow).
export default function ProjectsPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden py-8">
      <CaseFileDrum caseFiles={caseFiles} />
    </div>
  );
}
