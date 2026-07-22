"use client";

import { useEffect, useRef } from "react";
import {
  useWorkspaceDispatch,
  useWorkspaceState,
} from "@/lib/workspace/workspace-context";
import { useIdle } from "@/lib/workspace/use-idle";

export function AssistantTrigger() {
  const { companionOpen, hasEverOpenedCompanion } = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();
  const isIdle = useIdle();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Re-mounts every time the Companion closes (this component returns null
  // while it's open). Only steal focus back on a real close — never on the
  // very first render, which would yank focus away from wherever the page
  // actually loaded.
  useEffect(() => {
    if (hasEverOpenedCompanion && !companionOpen) {
      buttonRef.current?.focus();
    }
  }, [hasEverOpenedCompanion, companionOpen]);

  if (companionOpen) return null;

  const showNudge = isIdle && !hasEverOpenedCompanion;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => dispatch({ type: "OPEN_COMPANION" })}
      aria-label="Open Deax assistant"
      className={`fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold shadow-sm transition-transform hover:scale-105 ${
        showNudge ? "animate-pulse" : ""
      }`}
    >
      Deax
    </button>
  );
}
