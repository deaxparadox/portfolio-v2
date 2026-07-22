# ADR-0003: Design Token Vocabulary

Status: Accepted
Date: 2026-07-22

## Context

Milestone 1 shipped the application shell with ad-hoc Tailwind utility
values repeated by hand at every call site. An audit of the shipped code
confirms concrete duplication, not a hypothetical risk:

- `border-black/10 ... dark:border-white/10` — 5 occurrences
  (`navigation.tsx`, `companion-workspace.tsx`, `route-error.tsx`).
- `text-foreground/60` (muted text) — 6 occurrences across 4 files.
- The pill-button chrome (`rounded-full border ... hover:bg-black/5
  dark:hover:bg-white/5`) — byte-identical in `navigation.tsx` and
  `route-error.tsx`.
- The content-container pattern (`mx-auto max-w-2xl px-6 py-16`) —
  byte-identical in `route-placeholder.tsx`, `route-error.tsx`,
  `route-skeleton.tsx`.
- Zero motion vocabulary exists; the one place the Design Bible
  explicitly calls for motion (Companion Workspace open/close,
  0.3 §7: "Animated resize") was deliberately left un-animated in
  Milestone 1 per that spec's "no animations beyond what's necessary to
  validate layout" scope note.

ADR-0001 already established that Tailwind's CSS-first theme
(`app/globals.css`'s `@theme inline` block) is the single source of
truth for design tokens — this ADR decides the *shape* of that
vocabulary now that real duplication exists to abstract from.

## Decision

Introduce new tokens only where Tailwind's own default scale doesn't
already provide one. That distinction matters and was almost missed
while drafting this ADR:

- Tailwind's built-in radius scale (`rounded-full`, `rounded-2xl`) and
  duration/easing scale (`duration-200`, `ease-out`) are *already* a
  consistent, named vocabulary — reusing them by name at multiple call
  sites is not duplication, it's exactly what a shared scale is for.
  No custom `--radius-*` / `--duration-*` tokens are introduced; call
  sites just need to actually use the shared scale consistently
  (Companion Workspace currently doesn't use it for motion at all,
  since Milestone 1 shipped it with none).
- The genuine duplication is in **raw color values with no shared
  name** — `black/10` / `white/10` / `foreground/60` are hand-typed at
  every call site with no scale entry backing them, which is exactly
  the drift risk a token exists to remove (next person writes `/15` by
  accident, nothing catches it).

So the token layer added to `app/globals.css` (extending the existing
`:root` / `.dark` / `@theme inline` blocks) is deliberately small:

- **Color only:** `--color-border`, `--color-muted-foreground` (in
  addition to the existing `--color-background` / `--color-foreground`),
  generating `border-border` / `text-muted-foreground` utilities the
  same way `--color-background` already generates `bg-background`.
- **Container:** one shared layout primitive (see ADR consequences)
  replacing the three copies of `mx-auto max-w-2xl px-6 py-16`.
- **Motion:** no new token — Companion Workspace's open/close adopts
  Tailwind's existing `duration-200 ease-out`, the first real use of
  motion in the app, justified by the Bible's explicit "Animated
  resize" requirement (0.3 §7) rather than decoration.

Components consume the new color tokens via Tailwind utilities that
reference them — never raw opacity values like `black/10` in new or
touched code.

**Rule going forward:** if a *raw, unnamed* value is used identically
at a second call site, it graduates to a token before a third copy is
allowed. Values that already come from Tailwind's own scale don't need
a wrapper token just to be reused. This is the concrete form of "the
design system emerges from the application" — tokens are extracted
from duplication that already happened, not predicted, and only where
no existing scale already covers it.

## Rejected

- **A separate JS/TS tokens file** (e.g. `lib/tokens.ts`) duplicating
  what Tailwind's `@theme` already expresses in CSS — rejected as a
  parallel source of truth, which ADR-0001 already ruled out.
- **A general-purpose component library** (Button, Card, Input, etc.)
  — rejected for this milestone per explicit scope: the shell owns
  exactly the components it currently needs (pill button, panel), and
  nothing is built for content modules that don't exist yet. Milestone 3
  builds real primitives against real content requirements.
- **Skeletons as one generic shape** — rejected because the Bible
  (0.3 §17) explicitly prohibits it ("never generic grey blocks... 
  skeletons should resemble final content"). See Spec-0002 for the
  atomic-shape resolution.

## Consequences

- `app/globals.css` grows by two color tokens; no new dependency, no
  new config file, no new custom radius/duration/easing namespace.
- The duplicated call sites (border color, muted text, pill button,
  container) are refactored to consume the new tokens/primitive —
  behavior-preserving, not a redesign.
- Companion Workspace gains an open/close transition using Tailwind's
  existing scale — the first (and currently only) motion in the app.
- Future components reference the color tokens by name; introducing a
  new raw color value outside this vocabulary is a code-review flag.
  Radius/duration/easing stay on Tailwind's own scale — no parallel
  naming to maintain.
