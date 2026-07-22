"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useWorkspaceDispatch,
  useWorkspaceState,
} from "@/lib/workspace/workspace-context";

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
      className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/10 bg-background px-6 py-4 dark:border-white/10"
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
                    : "text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => dispatch({ type: "TOGGLE_COMPANION" })}
        aria-pressed={companionOpen}
        className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
      >
        {companionOpen ? "Close Assistant" : "Ask Deax"}
      </button>
    </nav>
  );
}
