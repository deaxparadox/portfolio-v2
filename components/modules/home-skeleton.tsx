import { RouteContainer } from "@/components/routes/route-container";
import { SkeletonHeading, SkeletonLine } from "@/components/routes/skeleton-shapes";

export function HomeSkeleton() {
  return (
    <RouteContainer>
      <div className="animate-pulse">
        <SkeletonHeading className="w-48" />
        <SkeletonLine className="mt-3 w-32" />
        <SkeletonLine className="mt-4 w-full max-w-xl" />

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="h-64 rounded-lg bg-foreground/10 md:col-span-2 md:row-span-2" />
          <div className="h-28 rounded-lg bg-foreground/10" />
          <div className="h-28 rounded-lg bg-foreground/10" />
          <div className="h-24 rounded-lg bg-foreground/10" />
          <div className="h-24 rounded-lg bg-foreground/10" />
        </div>
      </div>
    </RouteContainer>
  );
}
