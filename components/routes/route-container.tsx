import type { ReactNode } from "react";

export function RouteContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-4xl px-6 py-16">{children}</div>;
}
