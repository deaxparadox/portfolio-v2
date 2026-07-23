# Changelog

## Unreleased

### Added

- Focus Stage interaction: replaced accordion expand/collapse with
  fixed-slot promotion — five slots never move or resize, clicking a
  module swaps its content with the Focus slot's via a real FLIP
  position animation, reading as "changing focus" rather than "a card
  got bigger." Fixes the page growing/scrolling as modules were
  engaged and the collapsed state overflowing the viewport at rest
  (identity header compacted to two lines). Every module now has
  distinct Small and Focus presentation forms rather than one
  stretched into the other. Removed `WorkbenchModule` and
  `TimelineStrip`, superseded.

- Workspace homepage: replaced the equal-weight card grid with an
  asymmetric, composition-first bento (`WorkbenchModule`) — a Hero
  Investigation, medium Decision Record and Case File preview, and quiet
  small Engineering Note and Timeline modules. Visual weight is a
  hand-picked editorial choice independent of object type; interaction is
  click/tap-only (hover never gates information); state comes from the
  existing `status` field plus a new `hasOpenRisk` field on Case File,
  communicated via weight and a small indicator rather than a new accent
  color per object type.

- Evidence model prototype: `/projects/[slug]` renders a real Case File —
  question, ownership/status badge, related Investigations and Decision
  Records, outcome, generalized Engineering Notes, and verify links — for
  the four anchor projects (HireIQ, BuildConnect USA, SellerPulse,
  Vocalyst). Every other project slug still shows the honest placeholder;
  migrating the rest was deliberately deferred until the model is proven.
  Homepage rewritten around four visitor questions instead of a
  site-navigation card grid, each linking straight to real evidence.
  Removed `FeaturedWorkCard`/`AssistantCard`, now dead code since the
  Assistant is reachable from anywhere via the floating trigger.

- Portfolio evidence model: the foundational content model underneath all
  future homepage, search, and Deax work. Seven object types — Profile,
  Case File, Investigation, Decision Record, Engineering Note, Timeline
  Record, Artifact — each defined by what engineering evidence it
  provides and which of three principles (Understand/Engineer/Own
  Reality) it reinforces, rather than by storage shape. Ownership,
  status, and confidentiality (`displayName` only, never an internal
  client identifier) are schema-enforced fields. Implemented with real
  content for four anchor projects (HireIQ, BuildConnect USA,
  SellerPulse, Vocalyst) sourced directly from the resume database:
  4 Case Files, 2 Investigations, 4 Decision Records, 4 Engineering
  Notes, 1 Timeline Record, all cross-referenced and validated for
  referential integrity. Deliberately scoped to content only —
  `lib/content/projects.ts` and the homepage are untouched; homepage
  layout, navigation, and routing remain separate, later specs.
  See [docs/adrs/0006-portfolio-evidence-model.md](docs/adrs/0006-portfolio-evidence-model.md).

- Floating shell redesign (Milestone 4): restyled the shell from
  flush/bordered "OS-window-manager" chrome to a floating-widget visual
  language — Navigation, Workspace, and Companion Workspace each render
  as separate rounded, shadowed, gapped containers instead of edge-to-edge
  panels. Navbar is now its own floating container, extracted out of
  Workspace's render tree. Companion Workspace stays on-demand only,
  opened via a new universal floating trigger button (present at every
  breakpoint, replacing the old navbar-embedded toggle), and docks
  beside Workspace Spotify-style (resizing it) rather than overlaying
  it. The trigger gets a subtle idle-nudge after 5 minutes of inactivity,
  which stops recurring once the visitor has opened it once. Fixed two
  focus-management gaps found during verification: opening/closing the
  Companion now moves focus deliberately (into the panel, then back to
  the trigger) instead of losing it to `<body>`.
  See [docs/specs/0004-floating-shell-redesign.md](docs/specs/0004-floating-shell-redesign.md).

- Homepage module (Milestone 3): first real content on the site.
  `lib/content/` (`profile.ts`, `projects.ts`) sources identity and all
  12 documented projects from the resume database. Homepage renders a
  real intro, a Featured Work callout (HireIQ, linking to its live
  GitHub repo), and a dashboard card grid (Experience, Resume,
  Engineering, Projects, Contact, Assistant — the last opening the
  Companion Workspace directly via workspace state, no routing).
  `/contact` gets real email/LinkedIn/GitHub links; other routes stay
  placeholders pending their own module milestones. Widened the shared
  `RouteContainer` from `max-w-2xl` to `max-w-4xl` now that a real
  2-column grid exists to size it against. New components live under
  `components/modules/`, not `components/home/`, so they don't assume
  where they're rendered.
  See [docs/specs/0003-homepage-module.md](docs/specs/0003-homepage-module.md).

- Design language (Milestone 2): `--color-border` and
  `--color-muted-foreground` tokens (derived from `--foreground` via
  `color-mix()`, so they stay correct in both themes automatically),
  replacing hand-repeated `black/10`/`white/10`/`foreground/60` values
  across the shell. Shared `RouteContainer` and `PillButton` primitives
  replace three and two byte-identical copies respectively. Companion
  Workspace gains its first motion — an open/close transition using
  Tailwind's built-in duration/easing scale, with `inert` correctly
  removing the closed panel from the tab order. Skeleton loading states
  now compose from `SkeletonHeading`/`SkeletonLine` shape primitives
  matching the actual placeholder content shape, instead of generic
  pulsing blocks.
  See [docs/specs/0002-design-language.md](docs/specs/0002-design-language.md).

- Application shell (Milestone 1): Next.js 16.2.x App Router project on
  TypeScript + Tailwind CSS 4.3.x + pnpm. Root layout, Primary Workspace
  (persistent navigation + routed content) and Companion Workspace
  (Deax placeholder shell) as sibling component trees sharing state via
  React Context. Desktop renders both as a fixed-viewport split pane;
  tablet/mobile use native document scroll with Companion as a
  drawer/bottom-sheet overlay. Light/dark theming via `next-themes`.
  Placeholder routes for `/`, `/projects`, `/projects/:slug`,
  `/experience`, `/resume`, `/engineering`, `/contact`, `/search`, each
  with loading/error states.
  See [docs/specs/0001-application-shell.md](docs/specs/0001-application-shell.md).
