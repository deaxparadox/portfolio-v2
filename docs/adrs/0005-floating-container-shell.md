# ADR-0005: Floating Container Shell

Status: Accepted
Date: 2026-07-23

## Context

Reviewing the shell built in Milestones 1–2 against actual intent
surfaced a real discomfort: the "OS-window-manager" framing — flush,
bordered, edge-to-edge panels — wasn't what was wanted, even though the
underlying structural idea (Primary Workspace + on-demand Companion
Workspace, desktop-only scroll lock, event-driven decoupling) still is.

This was worth separating carefully, because the two are different
questions: *is the container concept right* vs. *is the chrome right*.
Direct discussion (not the earlier `docs/context/` notes, which
undersold this) resolved it: the concept stays, the chrome changes.

## Decision

**Visual language:** every top-level container renders as a separate
floating widget — rounded corners, a visible gap from the viewport edge
and from sibling containers, a subtle shadow — instead of flush/bordered
panels. Reference points: Spotify's desktop app panel styling, LinkedIn's
card-based layout. Root Layout stays invisible; it positions floating
containers, it never renders visible chrome itself.

**Navbar becomes its own floating container**, not nested inside the
Workspace's scroll column as it is today. This is a structural change,
not just a style change — closes the gap `docs/context/01-layout-blueprint.md`
and `design-workshop-notes.md` §2-3 already flagged (a "Floating
Navigation" distinct from Portfolio Workspace).

**Assistant (Deax) stays on-demand only** — not permanently docked.
Confirmed directly: the Assistant container doesn't exist in layout
until triggered by a dedicated floating action button (bottom-right,
separate from Navbar, present from first paint). When triggered, it
docks beside the Workspace and resizes it to share space (Spotify-style,
not a LinkedIn-style overlay) — the Workspace container never gets
covered, only resized. The Assistant fills the full available height of
its parent container.

**Idle behavior:** after 5 minutes without visitor interaction (mouse,
keyboard, or scroll all reset the timer), the floating trigger button
gets a subtle animation (pulse/glow or a small hint bubble) — inviting
interaction without taking over the screen. This nudge stops recurring
once the visitor has opened the Assistant at least once in the session.

**Scroll strategy is unchanged from ADR-0002**: desktop/tablet lock
browser scroll, each floating container scrolls its own content
internally; mobile falls back to native document scroll, with Navbar
and Assistant collapsing to standard mobile patterns (top bar, bottom
sheet). The floating-widget visual language doesn't change this
reasoning — it was never about the chrome.

**One trigger, every breakpoint**: the floating action button is the
sole way to open the Assistant, at every breakpoint — Navigation's
existing "Ask Deax" toggle is removed rather than kept as a second entry
point. One trigger is simpler than two doing the same job.

## Rejected

- **LinkedIn-style overlay** (Assistant floats on top of Workspace,
  Workspace never resizes) — rejected in favor of Spotify-style
  docking, confirmed directly rather than assumed from the reference
  names alone (the two references actually imply different behaviors;
  this was checked rather than guessed).
- **Permanently-docked Assistant with floating-widget restyling only**
  — considered, rejected: keeps the exact thing that prompted this
  ADR (a persistent structural pane), just re-skinned. Doesn't resolve
  the actual discomfort.
- **Universal scroll-lock (including mobile)** — rejected for the same
  reasons as ADR-0002: no structural need exists on mobile, where the
  floating multi-container arrangement doesn't apply anyway.

## Consequences

- `Navigation` is extracted from `PrimaryWorkspace`'s render tree into
  its own sibling floating container.
- `PrimaryWorkspace` and `CompanionWorkspace` get restyled (rounded
  corners, shadow, margin) rather than flush/bordered chrome — behavior
  (scroll containment, breakpoint logic) is preserved from ADR-0002.
- A new floating trigger button (FAB) is introduced, separate from
  Navbar, as the sole way to open the Assistant at every breakpoint —
  Navigation's toggle button is removed, not duplicated alongside it.
- New: idle-detection logic (a hook tracking time-since-last-interaction,
  resetting on mouse/keyboard/scroll, exposing an "idle" boolean the FAB
  reacts to).
- Content built in Milestone 3 (`lib/content/`, homepage copy) is
  unaffected — this ADR is scoped entirely to shell chrome and the
  Assistant's presentation, not to any content or data model.
