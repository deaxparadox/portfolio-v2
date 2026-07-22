# Changelog

## Unreleased

### Added

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
