# Changelog

## Unreleased

### Added

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
