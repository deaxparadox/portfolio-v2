"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

type ModuleContent = {
  kind: string;
  small: { title: string; body: string };
  focus: { title: string; body: string[] };
  href?: string;
};

const MODULES: Record<string, ModuleContent> = {
  investigation: {
    kind: "Investigation",
    small: {
      title: "Nine symptoms, one root cause",
      body: "A PSTN echo feedback loop — the agent's own voice, fed back to itself.",
    },
    focus: {
      title: "Nine symptoms, one root cause — diagnosed with no call audio",
      body: [
        "A production voice AI was hallucinating mid-call, self-interrupting, and failing bookings — reported as separate issues, days before a client demo.",
        "A single shared cause explained all three: a PSTN echo feedback loop — the agent's own text-to-speech, picked up by speech-to-text and fed back to GPT-4o as if it were the user talking.",
      ],
    },
    href: "/projects/vocalyst",
  },
  decision: {
    kind: "Decision Record",
    small: {
      title: "Removing the API layer",
      body: "The browser talks to Postgres directly. No API server to get wrong.",
    },
    focus: {
      title: "Removing the API layer instead of hardening it",
      body: [
        "A traditional backend API server is itself an attack surface — every route is one more place authorization logic can be gotten wrong.",
        "Row-Level Security, column-scoped grants, and database triggers become the entire authorization layer — an entire vulnerability class removed by removing the layer itself.",
      ],
    },
    href: "/projects/buildconnect-usa",
  },
  casefile: {
    kind: "Case File",
    small: {
      title: "HireIQ",
      body: "Solo-built AI career platform, ~36,000 lines, two voice agents.",
    },
    focus: {
      title: "HireIQ",
      body: [
        "A solo-built AI career-discovery platform — ~36,000 lines, two independently-tuned voice agents, a deterministic matching engine.",
        "The employer module is still mid-development, and a Gemini 3.x migration deadline was missed — both stated plainly, not hidden.",
      ],
    },
    href: "/projects/hireiq",
  },
  note: {
    kind: "Engineering Note",
    small: {
      title: "Silent failures",
      body: "A metric that looks fine is more dangerous than one that crashes.",
    },
    focus: {
      title: "A metric that silently looks fine is more dangerous than one that crashes",
      body: [
        "A wrong number that produces no error and no crash can drive a real decision before anyone notices something's off.",
        "Generalized from SellerPulse's unit-scale account-health bug.",
      ],
    },
    href: "/projects/sellerpulse",
  },
  timeline: {
    kind: "Timeline",
    small: {
      title: "Excellence Technologies",
      body: "Backend / AI Engineer · Jan 2025 – Present",
    },
    focus: {
      title: "Excellence Technologies — Backend / AI Engineer",
      body: [
        "Jan 2025 – Present. Owns backend architecture end to end for assigned client SaaS products: schema design, API design, auth, background jobs, third-party integrations.",
        "Builds and integrates real-time AI systems — multi-agent orchestration, voice agents, RAG pipelines — as a core, recurring part of the work, not a separate specialization.",
      ],
    },
    // No href yet — /experience is still a placeholder page, so this stays
    // un-linked rather than pointing at a dead end.
  },
};

const SLOT_NAMES = ["focus", "medium1", "medium2", "small1", "small2"] as const;
type SlotName = (typeof SLOT_NAMES)[number];

const SLOT_CLASS: Record<SlotName, string> = {
  focus: "md:col-span-2 md:row-span-2",
  medium1: "",
  medium2: "",
  small1: "",
  small2: "",
};

type PendingSwap = {
  a: SlotName;
  b: SlotName;
  rects: Partial<Record<SlotName, DOMRect>>;
};

export function HomeWorkspace() {
  const [assignment, setAssignment] = useState<Record<SlotName, string>>({
    focus: "investigation",
    medium1: "decision",
    medium2: "casefile",
    small1: "note",
    small2: "timeline",
  });
  const slotRefs = useRef<Partial<Record<SlotName, HTMLDivElement | null>>>({});
  const pendingSwap = useRef<PendingSwap | null>(null);

  function handlePromote(clickedSlot: SlotName) {
    if (clickedSlot === "focus") return;

    const rects: Partial<Record<SlotName, DOMRect>> = {};
    (["focus", clickedSlot] as SlotName[]).forEach((name) => {
      const el = slotRefs.current[name];
      if (el) rects[name] = el.getBoundingClientRect();
    });
    pendingSwap.current = { a: "focus", b: clickedSlot, rects };

    setAssignment((prev) => ({
      ...prev,
      focus: prev[clickedSlot],
      [clickedSlot]: prev.focus,
    }));
  }

  // The workspace metaphor is "focus changed," not "a card got bigger" — the
  // FLIP technique below is what makes that legible: measure positions
  // before the swap (in handlePromote), let React re-render with the new
  // assignment, then measure again here and animate the delta so each
  // module visually travels to its new slot instead of instantly teleporting.
  useLayoutEffect(() => {
    const swap = pendingSwap.current;
    pendingSwap.current = null;
    if (!swap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    (["a", "b"] as const).forEach((key) => {
      const slotName = swap[key];
      const otherName = key === "a" ? swap.b : swap.a;
      const el = slotRefs.current[slotName];
      const beforeRect = swap.rects[otherName];
      if (!el || !beforeRect) return;

      const afterRect = el.getBoundingClientRect();
      const dx = beforeRect.left - afterRect.left;
      const dy = beforeRect.top - afterRect.top;
      const sx = beforeRect.width / afterRect.width;
      const sy = beforeRect.height / afterRect.height;

      const child = el.firstElementChild as HTMLElement | null;
      if (!child) return;
      child.style.transformOrigin = "top left";
      child.animate(
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
          { transform: "translate(0, 0) scale(1, 1)" },
        ],
        { duration: 320, easing: "cubic-bezier(0.2, 0, 0, 1)" },
      );
    });
  }, [assignment]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {SLOT_NAMES.map((slotName) => {
        const objectId = assignment[slotName];
        const content = MODULES[objectId];
        const isFocus = slotName === "focus";

        return (
          <div
            key={slotName}
            ref={(el) => {
              slotRefs.current[slotName] = el;
            }}
            className={SLOT_CLASS[slotName]}
          >
            <div
              role={isFocus ? undefined : "button"}
              tabIndex={isFocus ? undefined : 0}
              onClick={isFocus ? undefined : () => handlePromote(slotName)}
              onKeyDown={
                isFocus
                  ? undefined
                  : (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handlePromote(slotName);
                      }
                    }
              }
              className={`h-full rounded-lg border border-border p-5 ${
                isFocus ? "" : "cursor-pointer hover:border-foreground/30"
              }`}
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {content.kind}
              </span>
              {isFocus ? (
                <>
                  <p className="mt-2 text-xl font-semibold">{content.focus.title}</p>
                  {content.focus.body.map((paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? "mt-2 text-sm"
                          : "mt-3 border-t border-border pt-3 text-sm text-muted-foreground"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                  {content.href && (
                    <Link
                      href={content.href}
                      className="mt-3 inline-block text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
                    >
                      View full Case File →
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-2 text-base font-semibold">{content.small.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{content.small.body}</p>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
