# Spec 0008: Project Browser Workspace Frame

Status: Proposed
Branch: `feat/project-browser-workspace-frame` off `main`
Depends on: [ADR-0005](../adrs/0005-floating-container-shell.md) (floating-container visual language, reused here), [ADR-0007](../adrs/0007-presentation-system.md) (Browse motion, Coverflow-as-consumer-layout), [Spec 0007](0007-project-browser-coverflow.md)

## What's being built

This followed an extended design-critique conversation (not a bug fix
or a fresh feature) that concluded the coverflow's real problem wasn't
its own size — it was that the page around it was four disconnected
zones (title row, rail, stage, floating prev/next controls) with no
compositional relationship to each other. This spec reframes the page
from "a carousel component" into a single, dedicated navigation
workspace — structure and responsiveness only, no visual polish.

## Decisions from the design conversation (context for the changes below)

- **No evidence preview inside carousel cards** — reversed from an
  earlier direction in the same conversation. The Project Browser's
  job is choosing a project, not showcasing evidence (that's the
  Case File's and homepage Workspace's job). Only 4 of 12 Case Files
  have linked Investigations/Decision Records; previewing that inside
  the browser would expose which projects happen to have deeper
  write-ups so far as if it were an editorial claim about importance.
  All 12 stay equally lightweight in the browser — depth is revealed
  only after entering a Case File.
- **Explicit navigation stays, but consolidates into the rail.** Side
  cards already step the drum by one; keyboard/touch/wheel already
  work. The floating prev/next row was redundant with side-card click
  and visually disconnected from everything else. Folding chevrons into
  the rail (above "01," below "12") makes the rail a single, complete
  navigation instrument — jump-to via numbers, step via chevrons — and
  removes a floating control that had no compositional relationship to
  the rest of the page.
- **The stage stays visually quiet** — cards only, nothing else. All
  interactive chrome besides side-card-click lives in the rail.
- **Structure before polish.** This spec is composition and
  responsiveness only. Explicitly NOT in scope: the opacity-vs-brightness
  motion refinement, stronger shadow/weight differentiation between
  focus and neighbor cards, and the rail's active-entry-shows-name idea
  — all deferred to a later pass once the structural composition is
  validated.

## Layout

```
Project Browser (single frame: rounded-2xl border border-border
                  bg-background shadow-sm — same tokens as
                  Navigation/PrimaryWorkspace/CompanionWorkspace)
┌──────────────────────────────────────────────────┐
│ Title + Counter                    (full width,   │
│                                     border-b)     │
├───────────────┬────────────────────────────────────┤
│ ▲ prev        │                                    │
│ 01            │                                    │
│ 02            │              Stage                 │
│ ...           │         (cards only)                │
│ 12            │                                    │
│ ▼ next        │                                    │
│ (border-r)    │                                    │
└───────────────┴────────────────────────────────────┘
```

- The frame gets real margin from the viewport (matching the shell's
  own `p-4`/`gap-4` scale from `app-shell.tsx`), not edge-to-edge —
  consistent with how Navigation/PrimaryWorkspace/CompanionWorkspace
  already float rather than sit flush.
- Header spans the full frame width, capping it — not folded into
  either column, and not part of the stage.
- Rail and stage are divided by a single `border-r border-border`
  (the rail's existing internal divider language, kept).

## Component changes

- **`components/modules/case-file-drum.tsx` → renamed
  `components/modules/case-file-browser.tsx`** (`CaseFileBrowser`):
  its scope has grown from "the drum" to "the whole navigation
  workspace" (frame, header, rail-as-instrument, stage) — the name
  should say what it now does, matching this project's existing
  discipline about not letting a component's name undersell its scope.
  `app/projects/page.tsx` updates its import accordingly.
- **Rail**: gains a chevron button above the numbered column (step
  back) and one below it (step forward), reusing the existing
  `step()`/disabled-at-bounds logic already built for the old floating
  buttons — no new interaction logic, just relocated.
- **Stage**: the floating `<div>` containing the old prev/next buttons
  is deleted outright. The stage renders only the track/cards, exactly
  as before minus that block.
- **Frame + header**: new wrapping markup applying the
  border/rounded/shadow/background tokens and the title+counter bar,
  replacing today's loose `<div className="flex overflow-hidden">`
  root.

## Responsive geometry (single source of truth)

Card size, radius, and perspective currently exist as independent
fixed constants (260/340/780/1900) tuned by eye against one viewport.
This replaces them with values *derived* from the stage's real,
measured width, so the whole geometry scales together and stays
correct at any size:

- A `ResizeObserver` on the stage container measures its actual
  rendered width after mount (SSR/first paint uses the original
  validated constants as a safe default, so there's no flash of
  unsized content before the observer fires).
- `cardWidth = clamp(stageWidth * FRACTION, MIN_CARD_WIDTH, MAX_CARD_WIDTH)`
  — exact `FRACTION`/`MIN`/`MAX` values to be tuned visually during
  implementation, the same way `RADIUS`/`ANGLE_PER_CARD` were tuned
  against the artifact in Spec 0007 — proposing to start from a
  fraction that keeps the focus card and its immediate neighbor
  comfortably clear of each other, accepting that the outer (`d=2`,
  `d=3`) cards may partially clip at the stage edge on narrower
  viewports, exactly as they already can today.
- `cardHeight`, `RADIUS`, and `perspective` are all derived from
  `cardWidth` via the *same ratios* the validated geometry already
  has (`RADIUS = cardWidth * 3`, `perspective = cardWidth * (1900/260)`,
  `cardHeight = cardWidth * (340/260)`) — the shape of the drum doesn't
  change, only its absolute scale.
- `ANGLE_PER_CARD` (26°) and `MAX_VISIBLE` (3) stay fixed constants —
  they describe the drum's angular geometry, not its physical size, and
  changing them was never part of the overlap/spacing problem.

## Explicitly out of scope

- Evidence preview inside cards — reversed, not deferred; not part of
  this page going forward.
- Opacity-vs-brightness motion refinement (dropping/reducing the
  opacity falloff in favor of scale/z/brightness for the "receding"
  read) — a real, agreed-on improvement, but visual refinement, saved
  for after structure is validated.
- Stronger shadow/weight differentiation between focus and neighbor
  cards — same reasoning, deferred.
- Rail's active-entry-shows-name idea — a smaller enhancement, not yet
  confirmed as wanted, deferred rather than assumed.

## Verification plan

- `pnpm build`/`pnpm lint` clean.
- Visit `/projects`: confirm the whole browser reads as one framed
  workspace (border/rounded/shadow visible around the full rail+stage
  region), with the title/counter capping it above, not floating
  separately.
- Confirm the floating prev/next row is gone, and the rail's new
  chevrons perform the same step behavior (including disabled state at
  index 0/11).
- Resize the browser window (or test at a few viewport widths):
  confirm card size/radius/perspective visibly scale together rather
  than staying fixed, and that focus + immediate neighbor never overlap
  at any tested width.
- Re-run the full existing interaction check (wheel, keyboard, rail
  click, touch swipe, reduced motion, focus-card link navigation, no
  console errors, no horizontal page overflow) against the restructured
  component — same coverage as Spec 0007's verification, since the
  underlying interactions aren't changing, only their layout.

## Open items requiring your approval before implementation

1. The rename `CaseFileDrum` → `CaseFileBrowser` — flag if you'd rather
   keep the existing name despite the expanded scope.
2. The exact `FRACTION`/`MIN_CARD_WIDTH`/`MAX_CARD_WIDTH` constants for
   responsive sizing are proposed as "tune visually during
   implementation" rather than fixed numbers here — flag if you want
   specific target values decided up front instead.
3. Once confirmed, implementation proceeds on
   `feat/project-browser-workspace-frame`, verified per plan, then
   `todo.md`/`CHANGELOG.md` updated in the closing commit.
