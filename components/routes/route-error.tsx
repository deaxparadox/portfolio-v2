"use client";

import { RouteContainer } from "@/components/routes/route-container";
import { PillButton } from "@/components/shell/pill-button";

export function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteContainer>
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <PillButton onClick={reset} className="mt-6">
        Try again
      </PillButton>
    </RouteContainer>
  );
}
