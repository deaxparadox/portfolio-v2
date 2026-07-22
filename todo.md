# Portfolio v2 — Tracking

## In Progress

(none)

## Done

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
