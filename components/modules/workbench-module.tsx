"use client";

import { useState } from "react";
import Link from "next/link";

export type ModuleSize = "hero" | "large" | "medium" | "small";

const SIZE_CLASS: Record<ModuleSize, string> = {
  hero: "md:col-span-2 md:row-span-2",
  large: "md:col-span-2",
  medium: "",
  small: "",
};

/**
 * The shared shell every Workbench Module is built on: a size tier
 * (visual weight — an editorial choice, independent of object type), a
 * kind label + state badge, and click/tap-only collapsed-to-expanded
 * disclosure (never hover-gated). The type-specific reading rhythm lives
 * in whatever's passed as summary/detail, not in this shell.
 */
export function WorkbenchModule({
  size,
  kind,
  badge,
  title,
  summary,
  detail,
  href,
}: {
  size: ModuleSize;
  kind: string;
  badge?: { label: string; attention?: boolean };
  title: string;
  summary: string;
  detail: string;
  href: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-lg border border-border p-5 ${SIZE_CLASS[size]}`}>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="block w-full text-left"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {kind}
          </span>
          {badge && (
            <span
              className={`text-xs font-medium uppercase tracking-wide ${
                badge.attention ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {badge.attention && <span aria-hidden="true">● </span>}
              {badge.label}
            </span>
          )}
        </div>
        <p className={`mt-2 font-semibold ${size === "hero" ? "text-xl" : "text-base"}`}>
          {title}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="mt-3 border-t border-border pt-3">
            <p className="text-sm">{detail}</p>
            <Link
              href={href}
              className="mt-3 inline-block text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
            >
              View full Case File →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
