# ADR-0001: Technology Stack

Status: Accepted
Date: 2026-07-22

## Context

Portfolio v2 is greenfield — no framework, language, styling system, or
package manager has been chosen. The Design Bible (references/0.1–0.5-draft.md)
does not name a stack explicitly, but its vocabulary constrains the choice:

- "Prefer Server Components where possible" (0.3 §18, CLAUDE.md)
- Static rendering with hydrated interactive islands (0.3 §18)
- File-based route list matching exactly: `/`, `/projects`, `/projects/:slug`,
  `/experience`, `/resume`, `/engineering`, `/contact`, `/search` (0.5 §6)
- Mandatory Skeleton / Error / Empty / Loaded states per route (0.5 §8)
- Lighthouse targets: Performance 95+, Accessibility/Best Practices/SEO 100 (0.3 §19)
- "The application shell never remounts. Navigation persists." (CLAUDE.md, 0.5 §5)

These are React Server Component concerns, and Next.js App Router is the only
production-stable framework satisfying all of them simultaneously today.

## Decision

- **Framework:** Next.js 16.2.x, App Router. Confirmed current stable release
  (Turbopack default bundler, React 19.2) as of 2026-07-22.
- **Language:** TypeScript, strict mode.
- **Styling:** Tailwind CSS 4.3.x. Zero-runtime-cost utility CSS pairs naturally
  with Server Components — no client-side CSS-in-JS bundle tax, no
  runtime style computation. Chosen over CSS Modules because this project's
  layout-heavy shell (grid-based workspace split, responsive breakpoint
  logic) is exactly the case where utility classes reduce boilerplate without
  adding an abstraction layer — it isn't a framework, just a shorthand for the
  same CSS that would otherwise live in modules.
- **Package manager:** pnpm, activated via Corepack (bundled with Node, no
  global install required).
- **Runtime:** Node.js LTS (v24.18.0 at time of writing), managed via nvm.

## Rationale — why Next.js App Router specifically

- Nested layouts persist across route changes by default — this is the
  native mechanism that satisfies "shell never remounts, navigation persists"
  (CLAUDE.md) without custom plumbing.
- `loading.tsx` / `error.tsx` map directly onto the Bible's mandatory
  Skeleton/Error states per route (0.5 §8) — no bespoke state-machine needed.
- Server Components by default, with explicit `"use client"` opt-in, gives
  the "hydrate only interactive islands" requirement (0.3 §18) for free
  rather than as something we have to engineer.
- File-based routing under `app/` maps 1:1 onto the route table in 0.5 §6.

## Alternatives considered

- **Remix / React Router v7 (RSC mode):** also supports Server Components,
  but RSC support is newer and less battle-tested there than in Next.js App
  Router; no concrete requirement favors it over the more mature option.
- **CSS Modules / vanilla-extract:** rejected only as the *default* — not
  prohibited. If a specific component's styling genuinely doesn't fit
  utility classes, scoped CSS Modules remain available alongside Tailwind.
- **npm/yarn:** npm ships with Node and would work; pnpm was preferred for
  stricter dependency resolution (surfaces phantom dependencies immediately
  rather than letting them accumulate silently), consistent with "root-cause
  fixes only."

## Consequences

- All new UI is authored as Server Components unless it requires
  interactivity, browser APIs, or state — those get an explicit `"use client"`
  boundary, kept as small and as low in the tree as possible.
- Tailwind config becomes the single source of truth for design tokens
  (spacing, color, typography) referenced by the future Design System —
  no parallel token system.
- Scaffolding must go through `create-next-app` (per CLAUDE.md's
  "scaffold with the framework's own generator" rule) rather than being
  hand-assembled.
