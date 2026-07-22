"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useWorkspaceDispatch,
  useWorkspaceState,
} from "@/lib/workspace/workspace-context";
import { PillButton } from "@/components/shell/pill-button";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/resume", label: "Resume" },
  { href: "/engineering", label: "Engineering" },
  { href: "/contact", label: "Contact" },
  { href: "/search", label: "Search" },
];

export function Navigation() {
  const pathname = usePathname();
  const { companionOpen } = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background px-6 py-4"
    >
      <ul className="flex flex-wrap gap-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "text-sm font-medium text-foreground"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <PillButton
        onClick={() => dispatch({ type: "TOGGLE_COMPANION" })}
        aria-pressed={companionOpen}
      >
        {companionOpen ? "Close Assistant" : "Ask Deax"}
      </PillButton>
    </nav>
  );
}
