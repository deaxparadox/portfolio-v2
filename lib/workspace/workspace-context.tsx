"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";

type WorkspaceState = {
  companionOpen: boolean;
  hasEverOpenedCompanion: boolean;
};

type WorkspaceAction =
  | { type: "OPEN_COMPANION" }
  | { type: "CLOSE_COMPANION" }
  | { type: "TOGGLE_COMPANION" };

function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction,
): WorkspaceState {
  switch (action.type) {
    case "OPEN_COMPANION":
      return { ...state, companionOpen: true, hasEverOpenedCompanion: true };
    case "CLOSE_COMPANION":
      return { ...state, companionOpen: false };
    case "TOGGLE_COMPANION":
      return {
        ...state,
        companionOpen: !state.companionOpen,
        hasEverOpenedCompanion:
          state.hasEverOpenedCompanion || !state.companionOpen,
      };
  }
}

const WorkspaceStateContext = createContext<WorkspaceState | null>(null);
const WorkspaceDispatchContext = createContext<React.Dispatch<WorkspaceAction> | null>(
  null,
);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, {
    companionOpen: false,
    hasEverOpenedCompanion: false,
  });

  return (
    <WorkspaceStateContext.Provider value={state}>
      <WorkspaceDispatchContext.Provider value={dispatch}>
        {children}
      </WorkspaceDispatchContext.Provider>
    </WorkspaceStateContext.Provider>
  );
}

export function useWorkspaceState() {
  const context = useContext(WorkspaceStateContext);
  if (!context) {
    throw new Error("useWorkspaceState must be used within a WorkspaceProvider");
  }
  return context;
}

export function useWorkspaceDispatch() {
  const context = useContext(WorkspaceDispatchContext);
  if (!context) {
    throw new Error(
      "useWorkspaceDispatch must be used within a WorkspaceProvider",
    );
  }
  return context;
}
