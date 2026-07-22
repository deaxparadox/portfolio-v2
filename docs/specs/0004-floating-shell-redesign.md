# Spec 0004: Floating Shell Redesign (Milestone 4)

Status: Implemented
Branch: `feat/floating-shell` off `main`
Depends on: [ADR-0005](../adrs/0005-floating-container-shell.md)

## What's being built

Restyles and restructures the shell built in Milestones 1-2 from
flush/bordered "OS-window-manager" chrome to a floating-widget visual
language (Spotify/LinkedIn-referenced), per ADR-0005. Extracts Navbar
into its own floating container, replaces the Navigation-embedded
"Ask Deax" toggle with a dedicated floating trigger button present at
every breakpoint, and adds idle-detection so that trigger nudges an
inactive visitor once, non-intrusively.

This reorders the roadmap in `docs/context/06-roadmap.md`: this becomes
Milestone 4, pushing the previously-planned "Featured Module" to
Milestone 5. Content built in Milestone 3 is untouched — this is shell
and Assistant-presentation work only.

## Layout structure (desktop / `lg:` and up)

```
<div class="lg:flex lg:h-dvh lg:gap-4 lg:overflow-hidden lg:p-4">
  <div class="flex flex-1 flex-col lg:gap-4 lg:min-h-0">
    <Navigation />        floating, fixed height, rounded
    <PrimaryWorkspace />  floating, flex-1, rounded, scrolls internally
  </div>
  <CompanionWorkspace />  floating, conditional width, rounded, full height
</div>
<AssistantTrigger />      fixed bottom-6 right-6, outside the flex layout
```

Shared floating chrome for all three named containers:
`rounded-2xl border border-border bg-background shadow-sm` — reuses
existing tokens from Milestone 2 (`border-border`), no new color/radius
tokens needed (`rounded-2xl` is already Tailwind's own scale, per
ADR-0003's reasoning).

## Component changes

- **`components/shell/navigation/navigation.tsx`**: extracted from
  `PrimaryWorkspace`'s render tree into its own sibling floating
  container. Drops the "Ask Deax" toggle button entirely (replaced by
  `AssistantTrigger`, used at every breakpoint) — Navigation no longer
  needs `useWorkspaceState`/`useWorkspaceDispatch`, only `usePathname`
  for active-link highlighting (stays a Client Component for that
  reason alone).
- **`components/shell/primary-workspace/primary-workspace.tsx`**: no
  longer renders `<Navigation />` internally. Restyled to floating
  chrome; scroll-containment behavior from ADR-0002 unchanged.
- **`components/shell/companion-workspace/companion-workspace.tsx`**:
  restyled to floating chrome at all breakpoints (rounded even at
  desktop, consistent margin/shadow) instead of today's flush
  edge-attached panel. Docking behavior (resizes `PrimaryWorkspace`,
  fills full parent height) and the mobile/tablet drawer/bottom-sheet
  presentation from ADR-0002 are otherwise unchanged.
- **`components/shell/assistant-trigger/assistant-trigger.tsx`** (new):
  floating action button, `fixed bottom-6 right-6`, present at every
  breakpoint from first paint. Dispatches `OPEN_COMPANION`. Hidden
  (renders `null`) while the Companion is already open — closing is
  handled by the Companion's own close control. Applies a subtle
  `animate-pulse` when idle and not yet opened this session (see below).
- **`components/shell/app-shell.tsx`**: restructured per the layout
  above — groups Navigation + PrimaryWorkspace in a flex column,
  CompanionWorkspace as its sibling, AssistantTrigger outside the flex
  flow entirely (fixed positioning).

## State changes

- **`lib/workspace/workspace-context.tsx`**: adds `hasEverOpenedCompanion:
  boolean` to state, defaulting `false`. `OPEN_COMPANION` (and
  `TOGGLE_COMPANION` when transitioning closed→open) sets it `true`;
  it never resets back to `false` once set. This is what makes the idle
  nudge stop recurring after the first real open, per your direction.
- **`lib/workspace/use-idle.ts`** (new): a hook tracking time since last
  `mousemove`/`keydown`/`scroll`/`touchstart`, exposing an `isIdle`
  boolean. 5-minute timeout, resets on any of those events. Generic and
  reusable — not embedded inside `AssistantTrigger` directly, consistent
  with `lib/workspace/`'s existing organization.

`AssistantTrigger`'s nudge condition: `isIdle && !hasEverOpenedCompanion
&& !companionOpen`.

## Explicitly out of scope

- Any change to Companion Workspace's *internal* content (still the
  Milestone-1 placeholder — chat/voice functionality is Milestone 9 per
  the roadmap).
- Mobile/tablet drawer and bottom-sheet presentation logic — unchanged
  from ADR-0002, only visual chrome (rounding/margin) is touched.
- The originally-planned Milestone 4 "Featured Module" deep-dive — pushed
  to Milestone 5.

## Verification plan

- `pnpm build` / `pnpm lint` clean.
- Visual check at desktop/tablet/mobile: floating chrome renders
  correctly (gaps, rounding, shadows) at all three; Navigation reads as
  visually distinct from Workspace, not flush-attached.
- Click the floating trigger: Companion docks in, Workspace resizes,
  trigger itself disappears while open.
- Idle check: fast-forward or simulate 5 minutes of no interaction,
  confirm the trigger nudges; open Companion once, confirm the nudge
  never recurs afterward in that session even after further idle time.
- Confirm keyboard/focus behavior is unaffected by the Navigation
  extraction (tab order still reaches all nav links, then the trigger).
- No console errors.

## Open items requiring your approval before implementation

1. Exact floating chrome values (`rounded-2xl`, `shadow-sm`, `p-4`/`gap-4`
   spacing) — reasonable defaults reusing existing tokens; flag if you
   want different values.
2. Removing the Navigation-embedded toggle entirely in favor of one
   universal `AssistantTrigger` FAB (rather than keeping two different
   entry points across breakpoints) — flag if you'd rather keep a
   secondary entry point in the navbar too.
3. Once confirmed, implementation proceeds on `feat/floating-shell`,
   verified per plan, then `todo.md`/`CHANGELOG.md` updated in the
   closing commit.
