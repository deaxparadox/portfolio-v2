import { getCaseFile } from "@/lib/content/case-files";
import { RouteContainer } from "@/components/routes/route-container";
import { CaseFileView } from "@/components/modules/case-file-view";
import { RoutePlaceholder } from "@/components/routes/route-placeholder";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseFile = getCaseFile(slug);

  if (!caseFile) {
    return (
      <RoutePlaceholder
        title={`Project: ${slug}`}
        description="Placeholder — this project's Case File hasn't been written up yet."
      />
    );
  }

  return (
    <RouteContainer>
      <CaseFileView caseFile={caseFile} />
    </RouteContainer>
  );
}
