import type { ReactNode } from "react";

export function PrimaryWorkspace({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col lg:h-dvh lg:min-h-0 lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-border lg:bg-background lg:shadow-sm">
      <main className="flex-1">{children}</main>
    </div>
  );
}
