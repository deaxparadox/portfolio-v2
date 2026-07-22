export function SkeletonHeading({ className }: { className?: string }) {
  return <div className={`h-8 rounded bg-foreground/10 ${className ?? ""}`} />;
}

export function SkeletonLine({ className }: { className?: string }) {
  return <div className={`h-4 rounded bg-foreground/10 ${className ?? ""}`} />;
}
