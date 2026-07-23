import { RouteContainer } from "@/components/routes/route-container";
import { SkeletonLine } from "@/components/routes/skeleton-shapes";

export function HomeSkeleton() {
  return (
    <RouteContainer>
      <div className="animate-pulse">
        <SkeletonLine className="w-56" />
        <SkeletonLine className="mt-2 w-full max-w-xl" />

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
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
