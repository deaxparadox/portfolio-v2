import { RouteContainer } from "@/components/routes/route-container";

export function RoutePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <RouteContainer>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </RouteContainer>
  );
}
