"use client";

import {
  useWorkspaceDispatch,
  useWorkspaceState,
} from "@/lib/workspace/workspace-context";

export function CompanionWorkspace() {
  const { companionOpen } = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();

  if (!companionOpen) return null;

  return (
    <div
      role="complementary"
      aria-label="Deax Assistant"
      className="fixed inset-x-0 bottom-0 z-20 max-h-[70dvh] overflow-y-auto rounded-t-2xl border-t border-black/10 bg-background shadow-xl md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-[360px] md:rounded-t-none md:rounded-l-2xl md:border-l md:border-t-0 lg:static lg:h-full lg:w-[380px] lg:flex-shrink-0 lg:rounded-none lg:border-l lg:border-t-0 lg:shadow-none dark:border-white/10"
    >
      <div className="flex items-center justify-between border-b border-black/10 p-4 dark:border-white/10">
        <span className="text-sm font-semibold">Deax</span>
        <button
          type="button"
          onClick={() => dispatch({ type: "CLOSE_COMPANION" })}
          className="text-sm text-foreground/60 hover:text-foreground"
        >
          Close
        </button>
      </div>
      <div className="p-4 text-sm text-foreground/60">
        Assistant placeholder — chat and voice arrive in a later milestone.
      </div>
    </div>
  );
}
