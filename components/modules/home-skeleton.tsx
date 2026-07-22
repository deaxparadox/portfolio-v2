import { RouteContainer } from "@/components/routes/route-container";
import { SkeletonHeading, SkeletonLine } from "@/components/routes/skeleton-shapes";

export function HomeSkeleton() {
  return (
    <RouteContainer>
      <div className="animate-pulse">
        <SkeletonHeading className="w-48" />
        <SkeletonLine className="mt-3 w-32" />
        <SkeletonLine className="mt-4 w-full max-w-xl" />

        <div className="mt-10 h-32 rounded-lg bg-foreground/10" />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 rounded-lg bg-foreground/10" />
          ))}
        </div>
      </div>
    </RouteContainer>
  );
}
