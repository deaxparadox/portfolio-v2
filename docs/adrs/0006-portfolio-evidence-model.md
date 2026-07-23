# ADR-0006: Portfolio Evidence Model

Status: Accepted
Date: 2026-07-23

## Context

Milestones 1-4 built the application shell. Before any further homepage or
content work, an extended design session worked through the actual content
strategy: visitor-journey mapping across four personas (Recruiter, Hiring
Manager, Senior Engineer, Curious Developer), six recurring engineering
behaviors found across the 12 projects in `Master-Resume-Database.md`,
compressed into three principles, and — deliberately, before any homepage
or route design — the underlying model that all future content, search,
Deax, and navigation should operate on.

This ADR records that model. It intentionally does not touch homepage
layout, navigation labels, or routes — those are later, separate specs
built as views over what's defined here.

## Philosophy — this is an evidence model, not a knowledge model

Portfolio V2 has exactly one purpose:

> Help a visitor independently conclude that three engineering principles
> genuinely describe how this engineer works.

That purpose already exists in the original Design Bible (`references/0.2-draft.md`'s
"Confidence Journey" and "does this increase confidence in me as an
engineer?" test) — this ADR sharpens it rather than replacing it. After
several rounds of compression (personas → six themes → three principles →
knowledge objects), the design arrived back at that same original north
star, just far more precisely operationalized.

Given that purpose, content on this site isn't "knowledge" (information
that merely exists) — it's **evidence** (information that exists to
support one specific conclusion). Every object type in this model must
answer two questions:

1. What engineering evidence does this object provide?
2. Which of the three principles does that evidence reinforce?

If either answer is unclear, the object shouldn't exist.

**The three principles** (established separately, recorded in
`docs/context/07-engineering-principles.md`) are the standard every piece
of evidence is measured against:

- **Understand Reality** — doesn't stop at the first explanation, verifies
  the real one.
- **Engineer for Reality** — designs systems that stay correct even when
  assumptions fail.
- **Own Reality** — documents decisions, represents ownership honestly,
  makes trade-offs explicit.

They are not their own object type — they're a fixed tag applied to
evidence objects (see "Principle" below), same as ADR-0004 already
established that visitors experience three principles, not six
categories.

**One deliberate exception:** not everything on the site has to justify
itself as evidence. Contact links, a resume download, and similar
functional elements exist so a visitor can *act* on confidence already
built, not to build it. Forcing "what evidence does a mailto link
provide" through the two-question test would be artificial. These
utility/action elements are explicitly outside the evidence model's
justification logic.

**Relationships describe meaning, not storage.** "A Case File has many
Investigations" is a cardinality statement. "A Case File is strengthened
by Investigations" is a justification for why the relationship exists.
The ADR describes relationships the second way; the eventual TypeScript
shape (arrays of references, many-to-many) is an implementation detail
that follows from meaning, not the other way around.

**Objects operate on knowledge, not pages.** The homepage introduces
evidence; search searches evidence; Deax reasons over interconnected
evidence objects; navigation changes the lens onto the same evidence
graph rather than switching between unrelated pages. Routes remain
necessary (this is a real Next.js app) but become a thin rendering layer
over this model — "which lens is currently open," not the thing that
defines what evidence exists.

## The objects

Each entry: purpose (why it exists), what a visitor should understand
after engaging with it, then the fields and relationships that follow
from that purpose.

### Profile
**Purpose:** establishes context for interpreting evidence — not itself
evidence, the frame that makes everything else legible.
**Resulting understanding:** "Who is this, and by what standard should I
judge everything that follows?"
**Fields:** `name`, `title`, `principles` (the fixed three, with their
one-line descriptions), `intro`, `contact` (email/LinkedIn/GitHub — the
utility exception, not evidence).
**Relationships:** connects the entire graph. Doesn't strengthen or
verify anything itself.

### Case File
**Purpose:** evidence that engineering happened under real constraints.
**Resulting understanding:** "Did real engineering happen here, and can I
see the line from problem to solution?"
**Fields:** `slug`, `displayName`, `question`, `context`, `ownership`
(`solo` | `core-contributor` | `rescue` | `inherited`), `status`
(`active` | `dormant` | `closed` | `production`), `outcome`, `principles`
(which of the three this reinforces).
**Relationships:** strengthened by Investigations and Decision Records
that occurred within it; generalized by Engineering Notes; verified by
Artifacts; historically contextualized by a Timeline Record.

### Investigation
**Purpose:** evidence of reasoning — how this engineer reasons when
reality contradicts assumptions.
**Resulting understanding:** "How does this person think when the cause
of a problem isn't obvious?"
**Fields:** `title`, `problem`, `symptoms`, `initialAssumptions`,
`investigationTimeline`, `rootCause`, `verification`, `fix`,
`prevention`, `principles`.
**Relationships:** strengthens one or more Case Files (a pattern found
across unrelated projects is one Investigation linked to multiple Case
Files, not duplicated); verified by Artifacts.

### Decision Record
**Purpose:** evidence of judgment — exposes engineering reasoning under
real trade-offs. ADR-backed; can point directly at this repo's own
`docs/adrs/`.
**Resulting understanding:** "Given real alternatives, why this choice,
and what did it cost?"
**Fields:** `title`, `problem`, `alternatives` (rejected options and
why), `decision`, `tradeoffs`, `consequences`, `principles`.
**Relationships:** strengthens one or more Case Files; verified by
Artifacts (frequently the actual ADR file).

### Engineering Note
**Purpose:** evidence of learning — a standalone, generalized insight,
lighter than a full Case File.
**Resulting understanding:** one crisp takeaway the visitor didn't have
before (e.g., "JWT roles must never be read from a client-writable
claim").
**Fields:** `title`, `insight`, `context` (brief, optional), `principles`.
**Relationships:** generalizes a lesson discovered through an
Investigation, Decision Record, or Case File; can stand alone.

### Timeline Record
**Purpose:** evidence of growth — progression of responsibility and
capability over time, not employment history.
**Resulting understanding:** "Has capability actually grown, or is this
just a list of jobs?"
**Fields:** `organization` (`displayName` only), `role`, `period`,
`responsibilities`.
**Relationships:** provides historical context for the Case Files active
during it.

### Artifact
**Purpose:** allows independent verification. Not a story — the thing
that makes every other object falsifiable rather than claimed.
**Resulting understanding:** "I don't have to take this on faith — I can
check it myself."
**Fields:** `type` (`repository` | `demo` | `adr` | `spec` |
`testing-report` | `architecture-diagram`), `url`, `label`.
**Relationships:** verifies Case Files, Investigations, and Decision
Records. Referenced from, never the owner of, other objects.

## Cross-cutting rules

**Confidentiality is a schema constraint, not a discipline.** No object
type in this model may include a field capable of holding an internal
client-account identifier (the `gt-<name>` pattern in
`Master-Resume-Database.md`). The public schema only ever has
`displayName` fields. This makes the mistake structurally impossible
rather than something a writer has to remember not to do — the same
"Engineer for Reality" principle applied to the schema itself.

**Ownership and status are explicit fields, not prose.** Both were
previously going to live as sentences inside free-text context. Making
them structured, required fields on Case File operationalizes the "Own
Reality" editorial rule (`docs/context/07-engineering-principles.md`) as
something the schema enforces, not a reminder that can be silently
skipped in a future edit.

**Principle is a fixed tag, not a rich object.** Three known values
(`understand-reality` | `engineer-for-reality` | `own-reality`), applied
many-to-many to Case Files, Investigations, Decision Records, and
Engineering Notes. It carries no independent fields of its own — it
exists purely so homepage/search/Deax can query "show me evidence for X"
without that logic living only in a human author's head.

## Rejected

- **Database/ERD-first design** — defining fields and relationships
  before purpose would risk a technically correct schema that doesn't
  reinforce the actual experience. Purpose was deliberately settled
  first (see Philosophy).
- **"Knowledge model" as the framing** — rejected in favor of "evidence
  model": knowledge is neutral information; evidence exists to support
  a specific conclusion, which is this portfolio's entire purpose.
- **Personas (Recruiter, Hiring Manager, etc.) as content objects** —
  personas already did their job during evidence *selection*; they are
  a design-process tool, not portfolio data the site needs to query.
- **Routes/pages as the starting abstraction** — explicitly deferred.
  "Case Files" is an experience concept; it does not imply a `/case-files`
  route, the same way GitHub's "Pull Requests" experience doesn't imply
  its internal routing structure. Routes are a later, separate spec.

## Consequences

- `lib/content/` grows from the lean `profile.ts`/`projects.ts` pair
  (ADR-0004) into the seven object types above. Existing `projects.ts`
  data (name, slug, oneLiner, repoUrl, featured) maps onto a subset of
  Case File fields and needs extending, not discarding.
- Any future homepage, search, or Deax design must be evaluated against
  the two-question test (what evidence, which principle) before content
  is added — same governing discipline as every prior milestone's spec,
  applied one layer earlier.
- Homepage layout, navigation labels, and routing are unblocked by this
  ADR but explicitly not decided by it — they're separate specs that
  render views over this model.
