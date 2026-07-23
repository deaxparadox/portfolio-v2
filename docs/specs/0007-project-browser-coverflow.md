# Spec 0007: Project Browser Coverflow

Status: Proposed
Branch: `feat/project-browser-coverflow` off `main`
Depends on: [ADR-0007](../adrs/0007-presentation-system.md) (amended — adds the "Browse" motion meaning), [Spec 0006](0006-project-browser.md)

## What's being built

Replaces the List Row `/projects` view (shipped in Spec 0006) with a
3D "drum" of Case Files that a visitor browses one-at-a-time — cards
sit on a shared circle and curve outward (convex, like the outside of
a barrel), advancing via scroll, a left numbered rail, arrow keys, or
explicit prev/next controls. This is a full replacement, on every
device — no List Row fallback, no toggle. `CaseFileListItem` is
deleted.

This was validated as a real interactive artifact first, through
several corrected iterations, before any of this spec was written:

1. First pass used a flat coverflow (straight row, each card
   individually tilted) — rejected: not genuinely circular.
2. Switched to true circular placement (`x = R·sin(θ)`,
   `z = R·(cos θ − 1)`) — closer, but the rotation angle exceeded 90°
   for outer cards, so they flipped past edge-on and started showing
   their back face.
3. Narrowed the visible range so no card exceeds ~90° — fixed the
   flip, but a separate rotation-sign error made side cards curve
   *inward* toward the focus card (concave) instead of *outward* and
   away (convex, like a barrel viewed from outside). Fixed by flipping
   `rotateY(-θ)` to `rotateY(θ)`.
4. A bird's-eye compass diagram (no 3D perspective, so no projection
   ambiguity) confirmed the corrected orientation: every card faces
   its own compass direction, not a shared one.
5. Final tuning: radius and angle-per-card were too small for the card
   width, causing the front card and its immediate neighbor to overlap
   — fixed by widening both (radius 430→780, angle-per-card 18°→26°,
   visible range ±4→±3 to keep the outermost card under 90°).

The validated artifact (constants below) is the reference
implementation — this spec carries its exact geometry into React
rather than re-deriving it.

## Validated geometry (from the artifact)

- `RADIUS = 780px`, `ANGLE_PER_CARD = 26deg`, `MAX_VISIBLE = 3` (cards
  beyond ±3 positions fade out and stop receiving pointer events).
- Per visible card at offset `d = index − activeIndex`:
  `theta = d * ANGLE_PER_CARD`; `x = RADIUS * sin(theta)`;
  `z = RADIUS * (cos(theta) - 1)`; `rotateY(theta)` (positive, not
  negated — this is what produces the correct convex/outward curve);
  `scale = max(0.62, 1 - |d| * 0.09)`; opacity falls off with `|d|`.
- `perspective: 1900px` on the stage container.
- Card width 260px / height 340px (carried from the artifact; may need
  a pass once real Case File content — longer questions for some
  projects — is laid out for real).

## Component plan

- **`components/modules/case-file-drum.tsx`** (new, Client Component):
  owns `activeIndex` state, renders the rail + stage + controls.
  Computes each card's transform directly in JSX from `activeIndex`
  (declarative, not the artifact's imperative DOM manipulation) so the
  initial server-rendered HTML already has correct positioning for
  `activeIndex = 0` — no flash of unstyled/unpositioned content, and
  all 12 Case Files exist in the initial HTML regardless of JS.
  Each card reuses `CaseFileBadges` for its ownership/status/risk row.
- **`app/projects/page.tsx`**: renders `<CaseFileDrum caseFiles={caseFiles} />`
  instead of mapping `CaseFileListItem`.
- **Delete** `components/modules/case-file-list-item.tsx` — fully
  superseded, no remaining references once this lands.

## Interaction (real implementation, beyond what the artifact tested)

- **Wheel** (desktop): accumulates `deltaY`, advances one card per
  threshold crossing, matching the artifact.
- **Rail click**: jumps directly to that index (artifact-validated).
- **Arrow keys / prev-next buttons**: click/tap-and-keyboard fallback,
  satisfying ADR-0007's "reachable by click or tap" rule (artifact-validated).
- **Touch/swipe** (new — the artifact only tested desktop): a
  horizontal drag/swipe on the stage advances or retreats one card per
  swipe past a distance threshold, mirroring the wheel's
  accumulate-then-fire pattern. This did not exist in the prototype and
  needs to be built and tested for real, since this app has genuine,
  deliberate mobile support (ADR-0002) — a coverflow that only works
  with a mouse wheel isn't acceptable here.
- **Card click behavior**: clicking a non-focus card brings it to
  focus (same as a rail click on that index) rather than navigating
  immediately — clicking the *focus* card's own "View full Case File →"
  link is what navigates to `/projects/{slug}`. This mirrors the
  existing pattern in `home-workspace.tsx` (promotion vs. navigation
  are distinct actions) rather than inventing a new click convention.
- **Reduced motion**: transform changes apply instantly, no transition
  (artifact-validated pattern, matching Focus Stage's existing
  `prefers-reduced-motion` handling).

## Rail on small viewports

The rail is a slim 56px vertical strip — narrow enough that it likely
doesn't need a different mobile treatment, but this hasn't been tested
against a real narrow viewport with the wider 780px-radius drum. Will
verify during implementation and adjust (e.g., a smaller radius below
a breakpoint) if the drum itself doesn't fit in a phone-width stage.

## Explicitly out of scope

- Any other consumer adopting the Browse motion or a drum-style layout
  — this is Project Browser only, for now.
- Search/filter UI — unchanged from Spec 0006, still deferred to the
  Search consumer.

## Verification plan

- `pnpm build`/`pnpm lint` clean.
- Visit `/projects`: confirm convex (outward-curving) drum renders
  with no card overlap, matching the validated artifact.
- Wheel, rail-click, arrow keys, and prev/next buttons all move the
  drum correctly; clicking the current focus card's link navigates to
  its real Case File page.
- Touch/swipe test (via browser device emulation and, if possible, a
  real device) confirms mobile works without a wheel.
- Keyboard-only pass: tab to the stage, use arrow keys, tab to the
  rail and to prev/next — confirm every position is reachable without
  a pointing device.
- `prefers-reduced-motion` produces instant position changes.
- Confirm all 12 Case Files' content (including longer questions) fit
  the card without overflow or clipping.
- No console errors.

## Open items requiring your approval before implementation

1. The click-to-focus / focus-card-link-to-navigate split described
   above — flag if you'd rather a card navigate directly on first
   click instead.
2. Rail behavior on narrow/mobile viewports — proposing to keep it as
   a slim vertical strip and only revisit if it doesn't actually fit
   during implementation, rather than redesigning it up front.
3. Once confirmed, implementation proceeds on
   `feat/project-browser-coverflow`, verified per plan, then
   `todo.md`/`CHANGELOG.md` updated in the closing commit.
