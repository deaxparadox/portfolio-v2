# Spec 0009: Project Drum — Infinite Rotation

Status: Proposed
Branch: `feat/project-drum-infinite-rotation` off `main`
Depends on: [ADR-0007](../adrs/0007-presentation-system.md) (amended), [Spec 0008](0008-project-browser-workspace-frame.md)

## What's being built

Replaces the coverflow's windowed-arc geometry with a genuine
infinite-rotation drum, per an extended design conversation converging
on a "rotating engineering instrument" mental model: there's a fixed
Focus position on screen, and the drum rotates underneath it — nothing
"changes cards," everything rotates the same physical object.
Validated as a real interactive artifact first (radius/spacing tuning,
front/near/side/back simplification, infinite wraparound, and the
wrap-boundary animation risk) before any of this was written.

## What's changing, concretely

- **Every Case File always exists on the circle.** The current
  `MAX_VISIBLE` cutoff (anything beyond ±3 positions renders as an
  invisible placeholder) is removed. All `N` cards are always
  positioned and rendered; visibility (scale/opacity/brightness)
  falls off continuously by angular distance from Focus instead of
  being clipped at a hard boundary.
- **Index is modulo `N`, not clamped.** `activeIndex` wraps in both
  directions — advancing past the last item continues to the first,
  and vice versa. There is no "end" to reverse at. The rail's
  prev/next chevrons and the bottom prev/next buttons are never
  disabled — that concept doesn't apply anymore.
- **The angle between adjacent items is `360° / N`, derived from the
  dataset's actual length**, not a fixed constant. The drum doesn't
  know it's showing 12 things — it evenly divides the circle by
  whatever length the array it's given has.
- **Radius is derived to keep spacing near-tangent regardless of `N`**,
  using the actual chord-length formula rather than an empirically
  tuned constant: `radius = cardWidth / (2 × sin(π / N))` — this is
  what the validated artifact's radius/card-width ratio (~1.9× at
  `N=12`) approximates by eye; the formula makes it correct at any
  count, not just today's 12.
- **Progressive content simplification by distance from Focus**
  (matching the validated artifact exactly):
  - Distance 0 (Focus): full card — index, `displayName`, `question`,
    `CaseFileBadges`, "View full Case File →" link.
  - Distance 1 (Near): index + `displayName` only.
  - Distance 2 (Side): `displayName` only, smaller/dimmer via the
    existing continuous scale/opacity falloff.
  - Distance ≥ 3 (Back): a plain, textless, non-interactive silhouette
    — dim, small, present only so the eye completes the circle. Not
    clickable (`pointer-events: none`), since it's not meant to be read
    or acted on, only to exist.
- **The wrap-boundary rotation fix.** A naive implementation
  recomputing each card's angle fresh every render (wrapped to the
  shortest `-180°..180°` range) is guaranteed to glitch: whichever card
  sits exactly opposite Focus will, once per full rotation, flip sign
  between renders (e.g. `+180°` → `-150°`), and a CSS transition
  animating that raw number sweeps the long way around instead of the
  short way. Fixed with the standard technique for this class of
  problem: each card gets its own **continuously-accumulating rotation
  value** (React state, one number per card), which only ever changes
  by exactly one step's worth (`± 360°/N`) per rotation — never
  wrapped, never reset. The CSS `rotateY()` transform uses this raw,
  ever-growing/shrinking value directly (so the transition is always a
  small, smooth, correctly-directioned change), while the *visual
  position* (`x`/`z`/scale/opacity — everything that needs to place
  the card correctly on screen right now) is computed from that same
  value normalized into `-180°..180°` first. Two derived values from
  one source of truth, not two separate mechanisms.
- **All interactions call the same `rotateBy(delta)` function** — wheel,
  keyboard, touch swipe, rail-number clicks (computing the shortest
  signed delta to the target), rail chevrons, and the bottom prev/next
  buttons. Nothing has its own independent motion logic; every input is
  "rotate the drum by this many steps."

## Explicitly not being built

- **A generic, reusable `Drum` component.** The user named an ambition
  for other knowledge collections to eventually use this same rotating
  instrument. Per the "smallest convincing set" discipline already
  applied throughout this project (ADR-0007's presentation variants,
  the base-shape Case File migration), that extraction happens when a
  second real consumer actually needs it — not speculatively now, while
  there's only one. The implementation should be written cleanly
  enough that extracting it later isn't painful, but the public API
  surface (a generic `<Drum items={...} render={...}>`) isn't being
  designed today.
- Any further visual polish (opacity/brightness curve shape, exact
  simplification thresholds) beyond what the validated artifact
  already tuned by eye — flagged as fine-tunable after this lands, not
  blocking it.

## Verification plan

- `pnpm build`/`pnpm lint` clean.
- Confirm infinite rotation: advance past the last Case File and
  confirm it continues to the first without reversing, in both
  directions, via wheel, keyboard, and rail chevrons.
- Confirm the wrap-boundary fix specifically: jump via rail click
  across large index distances (e.g., item 1 to item 7, roughly
  opposite the circle) multiple times in both directions, watching
  every visible card — especially whichever one sits near the back —
  for any long-way-around spin. This is the one thing validated by
  derivation rather than by trial in the artifact; it needs to hold in
  the real, responsive-sized implementation too.
- Confirm progressive simplification renders correctly at each
  distance tier (0/1/2/≥3) and that Back-tier cards are genuinely
  non-interactive (clicking where one visually sits does nothing).
- Confirm radius/spacing still reads as near-tangent at a few different
  viewport widths (the responsive `cardWidth` from Spec 0008 still
  drives everything).
- Reduced motion still produces instant, correct repositioning.
- No console errors.

## Open items requiring your approval before implementation

1. The exact distance thresholds for each tier (0/1/2/≥3) and the
   continuous falloff shape (scale/opacity/brightness formulas) are
   carried directly from the validated artifact — flag if anything
   should differ once it's in front of real Case File content instead
   of placeholder taglines.
2. Once confirmed, implementation proceeds on
   `feat/project-drum-infinite-rotation`, verified per plan, then
   `todo.md`/`CHANGELOG.md` updated in the closing commit.
