import { RouteContainer } from "@/components/routes/route-container";
import { SkeletonHeading, SkeletonLine } from "@/components/routes/skeleton-shapes";

export function RouteSkeleton() {
  return (
    <RouteContainer>
      <div className="animate-pulse">
        <SkeletonHeading className="w-48" />
        <SkeletonLine className="mt-4 w-full max-w-md" />
      </div>
    </RouteContainer>
  );
}
