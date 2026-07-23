# Portfolio v2 — Tracking

## In Progress

(none)

## Done

- [x] **Project Browser** — replaced the `/projects` placeholder with a
      real listing of all 12 Case Files, each rendered via a new List
      Row presentation variant (`CaseFileListItem`) — displayName,
      question, and the ownership/status/hasOpenRisk badge row, linking
      to the full Case File page. First real multi-object consumer of
      the unified Knowledge Model after the previous migration, and the
      first use of a presentation variant beyond Small/Focus (List Row —
      anticipated in ADR-0007 but not built until a real consumer needed
      it). Extracted the ownership/status badge row out of
      `CaseFileView` into a shared `CaseFileBadges` component so the new
      List Row variant doesn't duplicate the `OWNERSHIP_LABEL`/
      `STATUS_LABEL` maps — exactly the kind of drift ADR-0007 was
      written to prevent. Order is the array's existing declaration
      order (4 anchors, then the 8 migrated projects) — no invented
      sorting/filtering; that's Search's job later. Per the agreed
      roadmap, pausing here to evaluate before Engineering
      Notebook/Timeline/Resume.
      Spec: [docs/specs/0006-project-browser.md](docs/specs/0006-project-browser.md)
      Branch: `feat/case-files-migration`
      Verified: `pnpm build`/`pnpm lint` clean; dev server check confirmed
      all 12 Case Files render as list rows with correct, unique links
      in the expected order, and `/projects/hireiq` renders identically
      to before the badge extraction (no visual regression).

## Done

- [x] **Migrate remaining 8 projects to base Case File shape** — Staffmind,
      StructureIQ, Founder's Lab, CourseForge, LexCall, InterviewPrep,
      Deskmind, EcosystemAI migrated from the legacy `Project` shape in
      `lib/content/projects.ts` (now deleted) into the same `CaseFile`
      type the 4 anchors use — structural fields only
      (question/context/ownership/status/hasOpenRisk/outcome/principles/
      artifacts), no invented Investigations/Decision Records/Notes, per
      ADR-0007's "depth is a property of the object, not a different
      schema." All facts re-verified directly against
      `Master-Resume-Database.md` this session rather than recalled,
      including two projects flagged as uncertain going in (Founder's
      Lab's ownership scope, CourseForge's current status). First real
      uses of `ownership: "inherited"` (CourseForge), `status:
      "production"` (LexCall), and `status: "dormant"` (StructureIQ,
      Deskmind) — enum values that existed in the type but were unused
      until now. All 12 project slugs now resolve to real Case File
      content via the existing `getCaseFile()` lookup; no routing changes
      needed.
      Spec: [docs/specs/0005-remaining-case-files-migration.md](docs/specs/0005-remaining-case-files-migration.md)
      ADR: [0007-presentation-system](docs/adrs/0007-presentation-system.md)
      Branch: `feat/case-files-migration`
      Verified: `pnpm build`/`pnpm lint` clean; dev server check confirmed
      all 8 newly-migrated `/projects/<slug>` routes return 200 with
      correct content, including InterviewPrep's empty `artifacts: []`
      rendering with no broken UI. `grep` confirmed no remaining import
      of `lib/content/projects.ts` before deletion.

## Done

- [x] **Focus Stage Interaction** — replaced accordion-style expand/collapse
      with fixed-slot promotion: five slot positions (Focus, 2 Medium, 2
      Small) never move or resize; clicking a non-Focus module swaps its
      content with the Focus slot's, animated with a real FLIP position
      transition (measure-before → re-render → measure-after → animate the
      delta) so it reads as "changing focus," not "a card got taller."
      Fixes the two real bugs diagnosed from the previous milestone's
      screenshots: the page no longer grows/scrolls as modules are
      engaged (slots are fixed; only occupancy changes), and the
      collapsed-at-rest state no longer overflows the viewport (identity
      header compacted to two tight lines, workspace begins immediately).
      Every module now has two genuinely different presentation forms —
      Small and Focus — not one stretched into the other; Timeline's
      Focus form uses its real, previously-unused responsibility bullets
      rather than padding out empty space.
      Removed `WorkbenchModule` and `TimelineStrip`, both fully superseded.
      Prototyped first as a working interactive artifact before writing
      any real code, per the project's established pattern for
      interaction-model questions.
      Branch: `feat/evidence-prototype`
      Verified: `pnpm build`/`pnpm lint` clean; Playwright confirmed no
      overflow at rest, correct content swap on promotion (both click and
      keyboard Enter), clicking the current Focus module is a no-op, and
      `prefers-reduced-motion` produces an instant swap with correct
      content instead of an animated one. No console errors.

- [x] **Workspace Homepage** — replaced the equal-weight card grid with a
      composition-first, asymmetric bento: a Hero Investigation (Vocalyst),
      medium Decision Record (BuildConnect's no-API-server architecture) and
      Case File preview (HireIQ), and quiet small Engineering Note
      (SellerPulse) and Timeline (Excellence Technologies) modules. Visual
      weight is hand-picked per module, independent of object type (a
      `WorkbenchModule` size prop, not a type-to-size mapping) — type still
      governs which rhythm renders, size is an editorial choice layered on
      top. Interaction is click/tap-only collapsed↔expanded disclosure
      (hover never gates information); state is communicated via existing
      `status` plus a new `hasOpenRisk` field on Case File (weight + a
      small dot indicator, not a new accent color) rather than one color
      per object type. Timeline gets no expand affordance at all — not
      every object needs the same interaction. Removed `DashboardCard` as
      dead code once the homepage stopped using it.
      This followed an extended design-exploration arc (persona journeys →
      six themes → three principles → evidence model → several rounds of
      reading-rhythm and composition prototyping, including two published
      artifacts) — see `docs/adrs/0006-portfolio-evidence-model.md` and
      `docs/context/07-engineering-principles.md` for the settled
      philosophy this implements.
      Branch: `feat/evidence-prototype`
      Verified: `pnpm build`/`pnpm lint` clean; Playwright confirmed the
      composition renders correctly at all three breakpoints, keyboard
      (Enter) and click both expand a module, the Hero module's link
      navigates to the real Case File, and reduced-motion is respected. No
      console errors.

- [x] **Evidence Model Prototype** — validates the evidence model as a real
      user-facing experience rather than just data. `/projects/[slug]` now
      renders a real Case File (question, ownership/status badge, context,
      related Investigations/Decision Records, outcome, Engineering Notes,
      verify links) for the four anchors; falls back to the existing
      placeholder for the other 8, which are deliberately not migrated yet
      ("smallest convincing set" applied to implementation, not just
      content). Homepage rewritten around four visitor questions (Can he
      solve difficult problems? / Can I trust his technical decisions? /
      What has he actually built? / How does he think?), each linking
      directly to real evidence instead of a site-navigation card grid.
      Removed `FeaturedWorkCard`/`AssistantCard` as dead code once the
      homepage no longer needed them — the Assistant is already reachable
      via the global floating trigger from Milestone 4.
      Investigation/DecisionRecord/EngineeringNote view components take
      the object directly as a prop with no assumption about which page
      renders them, preserving object independence per the evidence
      model's own philosophy.
      ADR: [0006-portfolio-evidence-model](docs/adrs/0006-portfolio-evidence-model.md)
      Branch: `feat/evidence-prototype`
      Verified: `pnpm build`/`pnpm lint` clean; Playwright confirmed all
      four entry points link to real, fully-rendered Case Files, a
      non-migrated project still shows the honest placeholder, and
      Vocalyst's page (both an Investigation and a Decision Record) renders
      every section correctly. No console errors.

- [x] **Portfolio Evidence Model** — foundational data model underneath all
      future content: Profile, Case File, Investigation, Decision Record,
      Engineering Note, Timeline Record, Artifact — each defined by the
      engineering evidence it provides and which of the three principles
      (Understand/Engineer/Own Reality) it reinforces, not by storage
      shape. Confidentiality (displayName-only), ownership, and status
      are schema-enforced fields, not editorial reminders.
      Implemented `lib/content/types.ts` plus real content for the four
      "smallest convincing set" anchors (HireIQ, BuildConnect USA,
      SellerPulse, Vocalyst): 4 Case Files, 2 Investigations, 4 Decision
      Records, 4 Engineering Notes, 1 Timeline Record — every fact
      sourced from Master-Resume-Database.md, nothing invented. Deliberately

- [x] **Portfolio Evidence Model** — foundational data model underneath all
      future content: Profile, Case File, Investigation, Decision Record,
      Engineering Note, Timeline Record, Artifact — each defined by the
      engineering evidence it provides and which of the three principles
      (Understand/Engineer/Own Reality) it reinforces, not by storage
      shape. Confidentiality (displayName-only), ownership, and status
      are schema-enforced fields, not editorial reminders.
      Implemented `lib/content/types.ts` plus real content for the four
      "smallest convincing set" anchors (HireIQ, BuildConnect USA,
      SellerPulse, Vocalyst): 4 Case Files, 2 Investigations, 4 Decision
      Records, 4 Engineering Notes, 1 Timeline Record — every fact
      sourced from Master-Resume-Database.md, nothing invented. Deliberately
      scoped to the content layer only: `lib/content/projects.ts` and the
      Milestone 3 homepage are untouched, so there's intentional, temporary
      duplication (e.g. HireIQ exists as both a lean project entry and a
      rich Case File) until a later homepage/routes spec decides how to
      consume this model.
      ADR: [0006-portfolio-evidence-model](docs/adrs/0006-portfolio-evidence-model.md)
      Branch: `feat/evidence-model`
      Verified: `pnpm build`/`pnpm lint` clean (typecheck passes on all
      new types); a referential-integrity script confirmed every
      `strengthens`/`generalizesFrom` reference points to a real object,
      since nothing enforces that at the TypeScript level.

- [x] **Floating Shell Redesign (Milestone 4)** — restyled the shell from
      flush/bordered "OS-window-manager" chrome to a floating-widget
      visual language (Spotify/LinkedIn-referenced); extracted Navbar
      into its own floating container; replaced the navbar-embedded
      assistant toggle with a universal floating trigger button (FAB)
      plus 5-minute idle-nudge behavior (stops recurring after first
      real open). Reorders the roadmap — this is now Milestone 4,
      pushing "Featured Module" to Milestone 5.
      Found and fixed a real focus-management gap during verification:
      opening Deax moved focus nowhere (fell to `<body>`) because the
      trigger unmounts on click; closing it did the same. Both now move
      focus deliberately (into the panel on open, back to the trigger
      on close, but never stealing focus on initial page load).
      Spec: [docs/specs/0004-floating-shell-redesign.md](docs/specs/0004-floating-shell-redesign.md)
      ADR: [0005-floating-container-shell](docs/adrs/0005-floating-container-shell.md)
      Branch: `feat/floating-shell`
      Verified: `pnpm build`/`pnpm lint` clean; Playwright check confirmed
      floating chrome at all three breakpoints, Spotify-style docking
      (Workspace resizes, never overlapped), idle-nudge firing after a
      simulated 6 minutes and not recurring after first open, and both
      focus-management fixes. No console errors.

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
