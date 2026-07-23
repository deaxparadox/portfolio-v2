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
Preview, List Row, Search Result) will be added as consumers that
actually need them are built — not authored speculatively ahead of a
real requirement, per the same "smallest convincing set" discipline
used throughout.

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

### Motion has exactly two meanings

**Depth** — revealing more of the same object (a Small form becoming a
Focus form). **Navigation** — moving to a different view (a Case File
link). Six type-specific motion metaphors (Investigation expands
vertically because it "feels like digging deeper," Decision Record
slides sideways because it "feels like comparing alternatives") were
proposed and explicitly rejected: motion can legibly communicate state
change and navigation direction, but nuanced directional metaphors
don't reliably transmit to a visitor watching a panel move once,
cold — that distinction is real, not something to relitigate per
consumer.

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
  meanings after checking whether directional metaphor actually
  transmits to a cold viewer (it doesn't, reliably).

## Consequences

- Any new presentation variant (Medium, List Row, Search Result, etc.)
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
