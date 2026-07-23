# Spec 0006: Project Browser

Status: Proposed
Branch: `feat/project-browser` off `main`
Depends on: [ADR-0006](../adrs/0006-portfolio-evidence-model.md), [ADR-0007](../adrs/0007-presentation-system.md), [Spec 0005](0005-remaining-case-files-migration.md)

## What's being built

Replaces the `/projects` placeholder with a real listing of all 12
Case Files, each rendered as a new **List Row** presentation variant —
anticipated in ADR-0007 but not yet built, since nothing needed it
until now. This is the first real "consumer" (per the current roadmap)
built after all 12 projects became one object type: it exists
specifically to test whether List Row holds up across objects of real,
varying depth (4 anchors with Investigations/Decision Records/Notes
linked, 8 with base fields only) — not to add filtering, search, or
grouping logic, which are explicitly out of scope.

## Current state (verified this session)

- `app/projects/page.tsx` renders `RoutePlaceholder` — no data
  dependency at all.
- `lib/content/case-files.ts` exports `caseFiles: CaseFile[]` (12
  entries) and `getCaseFile(slug)`. No `getAllCaseFiles()` or similar
  exists yet — nothing has ever needed to iterate the full array.
- `components/modules/case-file-view.tsx` (the existing Focus/full-page
  presentation) defines `OWNERSHIP_LABEL`/`STATUS_LABEL` maps and the
  ownership/status/`hasOpenRisk` badge row **inline**, not as a shared
  component. Building a second presentation variant that needs the same
  badges would either duplicate those maps (exactly the drift ADR-0007
  exists to prevent) or import them from a component whose name
  (`CaseFileView`) doesn't suggest it exports anything reusable.

## Proposed design

- **Extract the badge row** out of `case-file-view.tsx` into
  `components/modules/case-file-badges.tsx` (`CaseFileBadges({
  caseFile })`), keeping `OWNERSHIP_LABEL`/`STATUS_LABEL` and the
  `hasOpenRisk` dot indicator as the one source of truth. `CaseFileView`
  is updated to use it instead of its inline version — no visual change
  to existing Case File pages.
- **New List Row variant**: `components/modules/case-file-list-item.tsx`
  (`CaseFileListItem({ caseFile })`) — renders `displayName`, the
  `question` (this variant's one line of "why this is here," not
  truncated context/outcome text), and `CaseFileBadges`, the whole row
  wrapped in a `Link` to `/projects/{slug}`. Authored for its own space
  per ADR-0007 — a one-line list row, not a shrunk Case File page.
- **`app/projects/page.tsx`**: Server Component rendering `caseFiles`
  (imported directly — no new `getAllCaseFiles()` wrapper needed for a
  plain array already exported) through `CaseFileListItem`, in the
  array's existing declaration order (the 4 anchors first, then the 8
  base-shape projects) — no sorting/grouping by status or ownership.
  Order is a real editorial fact already encoded in the file (anchors
  first because they're the strongest evidence), not something to
  re-derive.
- No pagination, filtering, search box, or status grouping — 12 items
  renders as one flat list.

## Explicitly out of scope

- Filtering/search UI — that's the Search consumer's job, not
  Project Browser's, per the agreed roadmap.
- Any new Investigation/Decision Record/Note content.
- Changing `/projects/[slug]`'s existing rendering — untouched.
- A "Preview" or "Search Result" presentation variant — only List Row
  is needed here; other variants get built when a consumer that
  actually needs them exists (per ADR-0007's "smallest convincing set"
  rule for presentation variants).

## Verification plan

- `pnpm build`/`pnpm lint` clean.
- Visit `/projects`: all 12 Case Files render as list rows in the
  expected order, each linking to its real `/projects/{slug}` page.
- Visit a couple of the linked pages directly from the list to confirm
  the link targets are correct for both an anchor (e.g. `hireiq`) and a
  base-shape project (e.g. `staffmind`).
- Confirm `/projects/hireiq` (and one other anchor) render identically
  to before, now that `CaseFileBadges` is shared rather than inline —
  no visual regression from the extraction.
- Keyboard: tab through the list, confirm every row is reachable and
  each link has a visible focus state.
- No console errors.

## Open items requiring your approval before implementation

1. List Row's exact content — `displayName` + `question` + badges, no
   truncated `context`/`outcome` snippet. Flag if you want a short
   context line included too.
2. Declaration order (anchors first, then the 8 migrated projects) as
   the display order, with no re-sorting — flag if you'd rather order
   by status (active/production first) or alphabetically.
3. Once confirmed, implementation proceeds on `feat/project-browser`,
   verified per plan, then `todo.md`/`CHANGELOG.md` updated in the
   closing commit.
