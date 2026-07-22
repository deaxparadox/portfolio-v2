# ADR-0002: Workspace Architecture & Scroll Strategy

Status: Accepted
Date: 2026-07-22

## Context

The Design Bible (0.3, 0.5) describes Primary Workspace (portfolio) and
Companion Workspace (Deax) as "independent workspaces" and states browser
scrolling is disabled in favor of workspace-container scrolling. Both
statements are ambiguous as written and needed to be resolved before any
folder structure or component boundary could be designed:

1. Does "independent workspaces" mean package-level separation (monorepo)
   or component-tree separation within one app?
2. Does "browser scrolling disabled" apply universally, or only to the
   layout where it's structurally necessary?

## Decision 1 — Single app, two component trees (no monorepo)

Primary Workspace and Companion Workspace are architectural domains, not
deployment units:

- One Next.js application, one `package.json`, one build, one deploy,
  one router, one design system.
- They live as sibling component trees under the application shell.
- Neither imports the other's internals. Communication crosses the
  boundary only through a well-defined interface: shared application state
  and an event bus (see Decision 3) — never direct component coupling.
- Companion Workspace must be removable or replaceable with minimal impact
  on Primary Workspace, but it is **not** intended to be developed, versioned,
  or deployed independently. It does not get its own `package.json`.

**Rejected:** pnpm/npm workspaces with `primary-workspace` and
`companion-workspace` as separate packages. No concrete requirement (e.g. a
need to publish Companion standalone, or reuse it in another app) justifies
that complexity today. Revisit only if such a requirement materializes —
per CLAUDE.md, this project earns its complexity, it doesn't pre-pay for it.

## Decision 2 — Scroll strategy is desktop-only, not universal

"Browser scrolling disabled" (0.3 §17) is motivated entirely by the desktop
split-pane layout, where Primary and Companion render as literal side-by-side
siblings and a scrolling `<body>` would scroll past the fixed Companion pane.
That structural reason does not exist on tablet/mobile, where Companion is
already specified (0.4 §16, 0.5 §5) to render as an overlay (drawer / bottom
sheet), not a persistent sibling pane.

Applying document-scroll-lock universally would forfeit, on every
breakpoint, things the browser gives for free: scroll-position restoration
on back/forward, correct dynamic-viewport-height behavior on mobile Safari,
native overscroll/pull-to-refresh, and keyboard scroll semantics (Space,
PgDn, Home/End). Paying that cost on mobile — where the two-pane layout
doesn't even exist — has no offsetting benefit.

**Resolution:**

- **Desktop** (≥ the breakpoint where Primary + Companion render side by
  side): the application behaves like a desktop application. The viewport is
  fixed; `<body>`/`<html>` do not scroll; Primary Workspace and Companion
  Workspace each own an internal scroll container.
- **Tablet / Mobile**: the application behaves like a native mobile
  experience. Normal document scrolling is used. Companion renders as an
  overlay (drawer on tablet, bottom sheet on mobile) with its own internal
  scroll only if its content requires it. Platform convention is not
  sacrificed to preserve architectural symmetry with desktop.
- The component/state architecture is identical across breakpoints — only
  the CSS layout mode and Companion's chrome (inline pane vs. overlay)
  change. This satisfies 0.5 §9 ("architecture must remain identical,
  presentation changes") literally: same component tree, same state
  contract, breakpoint-driven presentation.

Guiding principle carried forward into implementation: **desktop is
workspace-oriented, mobile is platform-native — the architecture doesn't
change, the interaction does.**

## Decision 3 — Cross-workspace communication mechanism

Deferred to the Milestone 1 spec (docs/specs/0001-application-shell.md):
the shell needs, at minimum, a state contract for Companion's open/closed
state. Given CLAUDE.md's "global state exists only for true
application-wide concerns," this is implemented with React Context + a
reducer (no external state-management dependency) unless the spec surfaces
a concrete reason that's insufficient.

## Consequences

- Folder structure separates `primary-workspace/` and `companion-workspace/`
  as sibling directories under a shared app shell — not as separate
  packages.
- Responsive/breakpoint logic lives at the shell level (deciding *how*
  Companion renders), not duplicated inside Companion's own components.
- No `overflow: hidden` on `<body>` at the global stylesheet level — scroll
  locking is scoped to the desktop layout only, applied conditionally.
