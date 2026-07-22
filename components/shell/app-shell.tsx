import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/lib/workspace/workspace-context";
import { Navigation } from "@/components/shell/navigation/navigation";
import { PrimaryWorkspace } from "@/components/shell/primary-workspace/primary-workspace";
import { CompanionWorkspace } from "@/components/shell/companion-workspace/companion-workspace";
import { AssistantTrigger } from "@/components/shell/assistant-trigger/assistant-trigger";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <div className="lg:flex lg:h-dvh lg:gap-4 lg:overflow-hidden lg:p-4">
        <div className="flex flex-1 flex-col lg:min-h-0 lg:gap-4">
          <Navigation />
          <PrimaryWorkspace>{children}</PrimaryWorkspace>
        </div>
        <CompanionWorkspace />
      </div>
      <AssistantTrigger />
    </WorkspaceProvider>
  );
}
