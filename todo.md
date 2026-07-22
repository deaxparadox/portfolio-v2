# Portfolio v2 — Tracking

## In Progress

(none)

## Done

- [x] **Design Language (Milestone 2)** — codified the visual vocabulary
      that emerged from Milestone 1 (two color tokens derived via
      `color-mix()`, a shared `RouteContainer`, a shared `PillButton`,
      Companion Workspace's first motion, content-shaped skeleton
      primitives). No general-purpose UI kit; no new content.
      Spec: [docs/specs/0002-design-language.md](docs/specs/0002-design-language.md)
      ADR: [0003-design-token-vocabulary](docs/adrs/0003-design-token-vocabulary.md)
      Branch: `feat/design-language`
      Verified: `pnpm build`/`pnpm lint` clean; Playwright check confirmed
      visual parity with Milestone 1, smooth open/close transition at all
      three breakpoints, and that `inert` correctly keeps the closed
      Companion panel out of the desktop tab order. No console errors.

- [x] **Application Shell (Milestone 1)** — project init, folder architecture,
      root layout, Primary/Companion workspace shells, navigation, routing
      foundation, theme foundation, basic responsive layout.
      Spec: [docs/specs/0001-application-shell.md](docs/specs/0001-application-shell.md)
      ADRs: [0001-technology-stack](docs/adrs/0001-technology-stack.md),
      [0002-workspace-architecture-and-scroll-strategy](docs/adrs/0002-workspace-architecture-and-scroll-strategy.md)
      Branch: `feat/application-shell`
      Verified: `pnpm build`/`pnpm lint` clean; manual Playwright check across
      desktop (1440px)/tablet (820px)/mobile (390px) confirmed scroll-lock,
      pane/drawer/sheet presentation, and companion state persistence across
      route navigation. No console errors.
