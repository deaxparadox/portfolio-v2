import { RoutePlaceholder } from "@/components/routes/route-placeholder";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <RoutePlaceholder
      title={`Project: ${slug}`}
      description="Placeholder — project detail content arrives in a later milestone."
    />
  );
}
