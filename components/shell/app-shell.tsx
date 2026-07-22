import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/lib/workspace/workspace-context";
import { PrimaryWorkspace } from "@/components/shell/primary-workspace/primary-workspace";
import { CompanionWorkspace } from "@/components/shell/companion-workspace/companion-workspace";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <div className="lg:flex lg:h-dvh lg:overflow-hidden">
        <PrimaryWorkspace>{children}</PrimaryWorkspace>
        <CompanionWorkspace />
      </div>
    </WorkspaceProvider>
  );
}
