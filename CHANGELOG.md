# Changelog

## Unreleased

### Added

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
