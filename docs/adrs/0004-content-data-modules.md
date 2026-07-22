# ADR-0004: Content Data Modules

Status: Accepted
Date: 2026-07-22

## Context

Milestone 3 is the first milestone with real content (drawn from
`Master-Resume-Database.md`, an external, career-sensitive source of
truth — ownership scoping per project, confidential internal client
names that must never surface publicly, and a naming convention where
every project is referred to only by its resume-safe display name).

The Design Bible's Module System (0.5 §7) explicitly calls for one
Project Module reused across contexts — "Homepage → Project Page →
Search Results → Recommendations" — rather than each surface owning its
own copy of project data. That reuse only works if there's a single
data source those modules read from.

## Decision

Introduce `lib/content/` as the single source of truth for portfolio
content, consumed by page/module components — never hardcoded copy
duplicated across files:

- `lib/content/profile.ts` — identity (name, title, intro copy) and
  contact links.
- `lib/content/projects.ts` — all 12 documented projects, but only the
  fields something actually renders today: `slug`, `name`, `oneLiner`,
  `repoUrl`, `featured`. Deeper fields the source document has plenty
  of (architecture, challenges, engineering decisions, lessons
  learned) are deliberately **not** transcribed yet — nothing consumes
  them until the Projects module milestone actually builds
  `/projects` and `/projects/:slug` out. Building that data now with
  no reader would be exactly the speculative-abstraction problem
  ADR-0003 already flagged once.

Data is plain TypeScript objects/arrays — no CMS, no database, no
content-management dependency. A portfolio's content volume doesn't
justify one, and this keeps content changes a one-line code edit
reviewed like any other change, consistent with "no unnecessary
abstraction."

## Rejected

- **Inlining copy directly in each card component** — rejected because
  the Bible explicitly wants the same project data reachable from
  multiple future surfaces (Homepage, Project Page, Search,
  Recommendations); inlining would mean re-typing HireIQ's one-liner
  in four different files with four chances to drift.
- **A CMS or database-backed content layer** — no concrete requirement
  for non-technical editing or content versioning exists yet; revisit
  only if one does.
- **Transcribing full per-project detail now** — rejected per the
  "emerge from the application" rule: only the Homepage reads project
  data in Milestone 3, so only Homepage's fields get built.

## Consequences

- Future modules (Projects listing, Project detail page, Search) read
  from `lib/content/projects.ts` and extend it with the fields they
  need, rather than each inventing their own project list.
- Any new project added to the portfolio is one array entry, not a
  find-and-replace across multiple components.
- Content sourced from `Master-Resume-Database.md` respects that
  document's naming convention (resume-safe display names only,
  e.g. "HireIQ" never "Trajectry") and ownership-scoping discipline
  (no flattening "core platform contributor" into "built X") —
  Spec-0003 carries this through into the actual card copy.
