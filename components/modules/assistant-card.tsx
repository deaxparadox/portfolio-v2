"use client";

import { useWorkspaceDispatch } from "@/lib/workspace/workspace-context";
import { dashboardCardClassName } from "@/components/modules/dashboard-card";

export function AssistantCard() {
  const dispatch = useWorkspaceDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: "OPEN_COMPANION" })}
      className={`${dashboardCardClassName} w-full`}
    >
      <h3 className="text-base font-semibold">Assistant</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Want a guided tour instead? Ask Deax.
      </p>
    </button>
  );
}
