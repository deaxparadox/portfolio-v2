# Portfolio v2 — Tracking

## In Progress

- [ ] **Design Language (Milestone 2)** — codify the visual vocabulary
      that already emerged from Milestone 1 (color tokens, container
      primitive, shared pill control, motion, content-shaped skeletons).
      No general-purpose UI kit; no new content.
      Spec: [docs/specs/0002-design-language.md](docs/specs/0002-design-language.md)
      ADR: [0003-design-token-vocabulary](docs/adrs/0003-design-token-vocabulary.md)
      Branch: `feat/design-language`
      Status: spec written, awaiting approval to implement.

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
