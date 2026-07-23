import { RouteContainer } from "@/components/routes/route-container";
import { caseFiles } from "@/lib/content/case-files";
import { CaseFileListItem } from "@/components/modules/case-file-list-item";

export default function ProjectsPage() {
  return (
    <RouteContainer>
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <div className="mt-6 space-y-3">
        {caseFiles.map((caseFile) => (
          <CaseFileListItem key={caseFile.slug} caseFile={caseFile} />
        ))}
      </div>
    </RouteContainer>
  );
}
