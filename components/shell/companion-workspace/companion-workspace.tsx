"use client";

import { useEffect, useRef } from "react";
import {
  useWorkspaceDispatch,
  useWorkspaceState,
} from "@/lib/workspace/workspace-context";

export function CompanionWorkspace() {
  const { companionOpen } = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (companionOpen) {
      closeButtonRef.current?.focus();
    }
  }, [companionOpen]);

  return (
    <div
      role="complementary"
      aria-label="Deax Assistant"
      aria-hidden={!companionOpen}
      inert={!companionOpen}
      className={`fixed inset-x-0 bottom-0 z-20 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-background shadow-xl transition-[transform,width] duration-200 ease-out md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-[360px] md:rounded-t-none md:rounded-l-2xl md:border-l md:border-t-0 lg:static lg:h-full lg:flex-shrink-0 lg:translate-x-0 lg:translate-y-0 lg:shadow-sm ${
        companionOpen
          ? "translate-y-0 md:translate-x-0 md:translate-y-0 lg:w-[380px] lg:rounded-2xl lg:border lg:border-border"
          : "translate-y-full md:translate-x-full md:translate-y-0 lg:w-0 lg:overflow-hidden lg:border-none"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border p-4">
        <span className="text-sm font-semibold">Deax</span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => dispatch({ type: "CLOSE_COMPANION" })}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        Assistant placeholder — chat and voice arrive in a later milestone.
      </div>
    </div>
  );
}
