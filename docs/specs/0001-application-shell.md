# Spec 0001: Application Shell (Milestone 1)

Status: Implemented
Branch: `feat/application-shell` off `main`
Depends on: [ADR-0001](../adrs/0001-technology-stack.md), [ADR-0002](../adrs/0002-workspace-architecture-and-scroll-strategy.md)

## What's being built

The first implementation milestone: a stable, largely-permanent application
shell. No portfolio content, no Deax functionality, no business features —
only the structural skeleton that every future feature will be added inside
of, per the Design Bible (0.3, 0.5) and the explicit scope given for this
milestone.

Concretely:

1. Project initialization (Next.js 16.2.x, App Router, TypeScript, Tailwind
   CSS 4.3.x, pnpm) — per ADR-0001.
2. Folder architecture reflecting the sibling-workspace model — per ADR-0002.
3. Root Layout — Server Component, positioning only, no logic.
4. Primary Workspace shell — routing outlet + navigation, no content yet.
5. Companion Workspace shell — empty container + open/closed state contract,
   no chat/voice logic.
6. Navigation — persistent, non-remounting across route changes.
7. Routing foundation — route segments for every URL in Bible 0.5 §6, each
   rendering a placeholder page with correct loading/error states.
8. Theme foundation — light/dark via `next-themes`.
9. Basic responsive layout — desktop split-pane vs. tablet/mobile
   platform-native, per ADR-0002 Decision 2.

## Design rationale (already settled — see ADRs)

- Single Next.js app, two component trees, no monorepo (ADR-0002 §1).
- Scroll lock is desktop-only; tablet/mobile use native document scroll with
  Companion as an overlay (ADR-0002 §2).
- Cross-workspace state via React Context + reducer, no external state
  library (ADR-0002 §3).
- Server Components by default; `"use client"` only where interactivity is
  required (ADR-0001).

## Folder architecture

```
app/
  layout.tsx                    Root Layout (Server Component) — renders <AppShell>
  page.tsx                      Route: /            (placeholder)
  loading.tsx / error.tsx       Root-level loading/error states
  projects/
    page.tsx                    Route: /projects            (placeholder)
    [slug]/page.tsx              Route: /projects/:slug       (placeholder)
    loading.tsx / error.tsx
  experience/page.tsx           Route: /experience           (placeholder)
  resume/page.tsx               Route: /resume                (placeholder)
  engineering/page.tsx          Route: /engineering           (placeholder)
  contact/page.tsx              Route: /contact                (placeholder)
  search/page.tsx               Route: /search                 (placeholder)
  globals.css                   Tailwind entry + CSS custom properties (theme tokens)

components/
  shell/
    app-shell.tsx               Client Component: owns breakpoint detection,
                                 desktop scroll-lock, workspace grid layout
    navigation/
      navigation.tsx            Persistent nav, renders inside Primary Workspace
    primary-workspace/
      primary-workspace.tsx     Renders {children} route outlet + Navigation,
                                 owns its own scroll container
    companion-workspace/
      companion-workspace.tsx   Empty shell: container + open/closed chrome
                                 (inline pane on desktop, drawer/sheet overlay
                                 on tablet/mobile) — no chat/voice logic
  theme/
    theme-provider.tsx          Wraps next-themes ThemeProvider

lib/
  workspace/
    workspace-context.tsx       React Context + reducer: companion isOpen state
    use-breakpoint.ts           Hook: 'desktop' | 'tablet' | 'mobile'
```

Every `page.tsx` in this milestone renders a minimal placeholder (route name
+ "under construction") — real content is out of scope. Every route gets its
`loading.tsx` (skeleton, per Bible 0.5 §8) even though there's nothing to
load yet, because the shell must prove the loading-state pattern works
before content is added on top of it.

## Explicitly out of scope for this milestone

- Portfolio content (projects, experience, resume data, engineering write-ups)
- Deax functionality (chat, voice, any LiveKit/AI dependency)
- Design system / component library beyond what the shell itself needs
- Search implementation (route exists, renders placeholder only)
- Animations beyond what's needed to validate the desktop split-pane
  resize and mobile drawer/sheet transitions

## Verification plan

- `pnpm build` succeeds; `pnpm lint` clean.
- Manual check across three breakpoints (desktop/tablet/mobile, via browser
  devtool viewport presets): Companion opens/closes correctly at each; no
  document-level scroll on desktop, native scroll on tablet/mobile.
- Navigate between all placeholder routes: Navigation and Companion state
  must not remount or reset (verified by toggling Companion open, then
  navigating — it must stay open).
- Keyboard navigation reaches Navigation links and the Companion
  open/close control; focus is visibly managed.
- Lighthouse run against the placeholder home route as a baseline (not
  expected to hit 95+/100/100/100 yet with zero content, but no regressions
  from shell-added JS should be present — check bundle size of the
  client-boundary components).

## Open items requiring your approval before implementation

1. **Git repository**: no `.git` exists yet. I'll run `git init`, create
   `main` as the default branch with an initial commit, then create
   `feat/application-shell` off it — confirming here since branch/repo
   creation is human-directed per CLAUDE.md. Say go-ahead or adjust.
2. Everything above (folder architecture, scope boundaries) — once
   confirmed, implementation proceeds on `feat/application-shell`, committed
   incrementally, tested per the verification plan, then `todo.md` and
   `CHANGELOG.md` updated in the closing commit.
