import type { ReactNode } from "react";
import { Navigation } from "@/components/shell/navigation/navigation";

export function PrimaryWorkspace({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col lg:h-dvh lg:min-h-0 lg:overflow-y-auto">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}
