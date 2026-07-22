# Portfolio v2 — Tracking

## In Progress

- [ ] **Floating Shell Redesign (Milestone 4)** — restyles the shell from
      flush/bordered "OS-window-manager" chrome to a floating-widget
      visual language (Spotify/LinkedIn-referenced); extracts Navbar
      into its own floating container; replaces the navbar-embedded
      assistant toggle with a universal floating trigger button (FAB)
      plus 5-minute idle-nudge behavior. Reorders the roadmap — this is
      now Milestone 4, pushing "Featured Module" to Milestone 5.
      Spec: [docs/specs/0004-floating-shell-redesign.md](docs/specs/0004-floating-shell-redesign.md)
      ADR: [0005-floating-container-shell](docs/adrs/0005-floating-container-shell.md)
      Branch: `feat/floating-shell`
      Status: spec written, awaiting approval to implement.

## Done

- [x] **Homepage Module (Milestone 3)** — first real content module:
      identity + contact from Master-Resume-Database.md, Featured Work
      card (HireIQ), and the dashboard card grid (Experience, Projects,
      Engineering, Resume, Contact, Assistant). Contact page has real
      content; other route pages stay placeholders pending their own
      module milestones. Widened `RouteContainer` to `max-w-4xl` once
      the 2-column card grid showed `max-w-2xl` was too narrow —
      exactly the revisit Milestone 2 flagged as pending real content.
      Components live under `components/modules/`, not `components/home/`,
      per "modules never assume where they're rendered."
      Spec: [docs/specs/0003-homepage-module.md](docs/specs/0003-homepage-module.md)
      ADR: [0004-content-data-modules](docs/adrs/0004-content-data-modules.md)
      Branch: `feat/homepage-module`
      Verified: `pnpm build`/`pnpm lint` clean; Playwright check confirmed
      card layout at all three breakpoints, Assistant card opens the
      Companion without navigating, Experience card navigates correctly,
      and /contact renders the real email/LinkedIn/GitHub links. No
      console errors.

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
