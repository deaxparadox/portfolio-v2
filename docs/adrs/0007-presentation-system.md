# ADR-0007: Presentation System

Status: Accepted
Date: 2026-07-23

## Context

ADR-0006 defined the knowledge model — what exists. This ADR defines the
presentation system built on top of it — how knowledge is rendered — and
exists because implementation decisions had started outrunning
documented principles. Focus Stage, presentation variants, state-based
color, and the two-motion vocabulary were all real decisions made and
shipped (the workspace homepage, `components/modules/home-workspace.tsx`)
but existed only in conversation and commit messages. A concrete
drift had already started: the hover border color on non-Focus modules
(`hover:border-foreground/30`) was picked in the moment, not derived
from any written rule — exactly the kind of small inconsistency that
compounds once a second consumer (Project Browser, Engineering
Notebook) needs the same affordance and re-derives it slightly
differently from memory.

## Decision

### Knowledge, Presentation, and Consumers are three separate layers

- **Knowledge** (ADR-0006): Case File, Investigation, Decision Record,
  Engineering Note, Timeline Record, Artifact. Nothing visual exists
  here.
- **Presentation**: components that render a knowledge object. A
  knowledge object can have multiple presentation variants depending on
  context (see below). Presentation components take the object directly
  as a prop and carry no assumption about which consumer renders them —
  established as a hard constraint back when `InvestigationView`/
  `DecisionRecordView` were first built, and reconfirmed here as a
  standing rule, not a one-off.
- **Consumers**: Workspace (homepage), Project Browser, Engineering
  Notebook, Timeline, Resume, Search, Deax. Each composes existing
  knowledge through presentation components. Consumers never own
  knowledge and never need to ask "is this a Project or a Case File" —
  every knowledge object is the same type regardless of how much is
  linked to it (see "Depth is a property," below).

### Depth is a property of the object, not a different schema

A Case File with zero linked Investigations/Decision Records/Notes is
still a complete, valid Case File — depth varies naturally per object,
the same way a real knowledge system has some records with dozens of
links and some with none. There is no separate "lean project" type.
This directly motivated migrating all twelve projects to base Case File
shape rather than maintaining two parallel schemas differentiated by
completeness.

### Presentation variants: same object, deliberately different renderings per size

Established while prototyping Focus Stage: a module's Small form is not
its Focus form scaled down, and its Focus form is not its Small form
with more padding. Each is authored for the space it fills — a Small
Investigation shows only its root cause, not eight truncated fields; a
Focus Timeline uses its real responsibility bullets, not its 3-line
Small form stretched into empty space. Additional variants (Medium,
Preview, Search Result) will be added as consumers that actually need
them are built — not authored speculatively ahead of a real
requirement, per the same "smallest convincing set" discipline used
throughout. A List Row variant was briefly built for Project Browser's
first version and then fully superseded by the coverflow (see below)
before any other consumer adopted it — recorded here rather than
silently dropped, per this project's own "Own Reality" discipline.

### Coverflow is a consumer-level Browse layout, not a new object variant

Project Browser's Case File drum reuses the same compact content a
List Row would have shown (`displayName`, `question`,
`CaseFileBadges`) — it does not introduce a new Case File presentation
variant. What's new is the *consumer's* layout: many instances of the
same compact rendering placed on a shared circular path and moved
through via the Browse motion (above), rather than stacked in a list.
This distinction matters going forward — a future consumer wanting
"Browse" motion should reuse an existing compact variant inside a new
layout, not invent a new per-object variant every time a consumer
wants to move through peers physically.

The drum's mental model is a fixed Focus position with the object
rotating underneath it, not "the selected card changes" — every
interaction (wheel, keyboard, swipe, rail) rotates the same physical
object; nothing pages or rebuilds. Rotation is infinite (index wraps
modulo the dataset's length, not clamped at either end) and the angle
between items is always `360° / count`, derived from however many
objects the consumer is given — the drum has no built-in assumption
about how many Case Files exist. To read as one continuous object
rather than a front-facing arc, every item exists somewhere on the
circle at all times; items progressively simplify by *distance from
Focus* (full → title-only → a non-interactive, textless silhouette)
rather than disappearing past a visibility cutoff — the simplification
levels are this consumer's own internal chrome, not new Case File
presentation variants themselves.

### Focus Stage: fixed slots, promotion, not expansion

Slots (Focus, Medium, Medium, Small, Small) never move or resize.
Clicking a non-Focus module swaps its content with the Focus slot's;
the Focus slot belongs to the workspace, not to whichever object
currently occupies it — clicking the current Focus module is a no-op.
This replaced an earlier accordion (expand-in-place) implementation
after real screenshots showed it had no fixed height budget: expanding
a module could only add height to the page, never reallocate it,
confirmed by the composition already overflowing the viewport even at
rest. Promotion is implemented as a FLIP animation (measure both slots'
positions before the state change, let the framework re-render, measure
again, animate the transform delta) so the interaction reads as "the
workspace changed focus," not "a card got bigger."

### Visual weight is independent of type; reading rhythm is not

A knowledge object's type determines its reading rhythm (an
Investigation reads as a forensic timeline; a Decision Record reads
like a memo; both stay true regardless of size). Which slot an object
occupies — its visual weight — is a separate, editorial axis, chosen
per consumer/context, not fixed per type. This is why Timeline (small
by default) can be promoted to Focus without needing invented content:
size is about space allocated, not content volume implied by type.

### Color communicates state, not type

One state signal exists today: `status` (`active`/`dormant`/`closed`/
`production`) plus `hasOpenRisk`, communicated via type weight and a
small dot indicator — not a distinct hue per object type. Matches how
GitHub, Linear, and VS Code actually use color (state of a thing,
never what kind of thing it is), corrected from an earlier draft
proposal that assigned one color per object type before this
distinction was made explicit.

### Motion has exactly three meanings

**Depth** — revealing more of the same object (a Small form becoming a
Focus form). **Navigation** — moving to a different view (a Case File
link). **Browse** (added when Project Browser's coverflow was
designed) — moving one-at-a-time through a set of peer objects along a
shared path, without revealing more of any single one or leaving the
current view. Browse applies specifically to a consumer presenting
many same-type objects where a visitor traverses them sequentially
(Project Browser's Case File drum is the first use); it is not a
license to reach for physical/spatial motion generally — Depth and
Navigation remain the defaults for anything that isn't genuinely
one-at-a-time traversal through peers.

Six type-specific motion metaphors (Investigation expands vertically
because it "feels like digging deeper," Decision Record slides
sideways because it "feels like comparing alternatives") were proposed
and explicitly rejected: motion can legibly communicate state change,
navigation direction, and peer-to-peer traversal, but nuanced
directional metaphors tied to *object type* don't reliably transmit to
a visitor watching a panel move once, cold — that distinction is real,
not something to relitigate per consumer.

### Every interaction is reachable by click or tap; hover is feedback only

Collapsed → Focus (or, on a Case File page, Collapsed → full
narrative) is the complete interaction ladder, always reachable without
a pointing device. Hover may add a subtle affordance signal (a border
darkening) but must never gate information behind it — mobile has no
hover equivalent, and this app has real, deliberate mobile support.

## Rejected

- **A distinct hover-triggered density tier** — no touch equivalent
  exists; demoted to a micro-interaction affordance only.
- **Dynamic/automatic layout** (a constraint solver choosing module
  sizes or reflowing siblings to fit a fixed viewport) — rejected as
  premature engineering relative to what a hand-curated, small set of
  consumers actually needs. Fixed slots with manual size assignment
  achieve the same visual goal without it.
- **One accent color per knowledge object type** — superseded by
  state-based color once the GitHub/Linear/VS Code precedent was
  checked against literally, rather than assumed.
- **Six type-specific motion metaphors** — reduced to two legible
  meanings (later three, with Browse) after checking whether
  directional metaphor tied to object *type* actually transmits to a
  cold viewer (it doesn't, reliably) — Browse is tied to a consumer
  layout (peer traversal), not to any object type, so it doesn't
  reopen this rejection.

## Consequences

- Browse-motion consumers must provide a non-gesture path through the
  full set (click/tap on an index control, and a keyboard equivalent),
  per the click-or-tap-reachable rule above — scroll/swipe alone is
  never sufficient, since not every visitor has a wheel or trackpad.
- Any new presentation variant (Medium, Search Result, etc.)
  must be authored for its own space, never derived by scaling an
  existing variant.
- Any new consumer (Project Browser, Engineering Notebook, Timeline,
  Resume, Search, Deax) composes existing presentation components and
  must not introduce a parallel rendering path for "shallow" vs. "deep"
  objects — depth differences are handled by presentation components
  checking what's actually linked (already true of
  `getInvestigationsForCaseFile` and siblings), not by consumer-level
  branching on object completeness.
- Future ad-hoc styling choices (a new hover state, a new spacing value)
  should be checked against this document before being invented locally
  in a component, the same discipline that motivated writing it.
