# Portfolio v2 — Tracking

## In Progress

(none)

## Done

- [x] **Project Browser: workspace frame & responsive composition** —
      reframed the coverflow from "a carousel component" into a
      dedicated navigation workspace, per an extended design-critique
      conversation (composition, not carousel size, was the real
      problem). `CaseFileDrum` renamed `CaseFileBrowser`. Removed the
      four disconnected zones (title row, rail, stage, floating
      controls) in favor of: a full-width title+counter header capping
      the layout, a rail that absorbs step navigation (chevrons above/
      below the numbered column) as the single navigation instrument,
      and a stage that stays purely visual (cards only). Per an
      explicit design decision mid-conversation, this reuses
      `PrimaryWorkspace`'s existing floating-container frame rather than
      adding a second nested border/rounded/shadow box — confirmed via
      a direct before-implementation question rather than assumed.
      Card size, radius, and perspective are now derived from the
      stage's real measured width (`ResizeObserver`) via one set of
      fixed ratios, instead of independent fixed-pixel constants tuned
      against a single viewport.
      Reversed from the previous round: no evidence preview inside
      carousel cards — the browser's job is choosing, not showcasing,
      and only 4 of 12 Case Files have deeper evidence, so previewing it
      would expose implementation progress as editorial significance.
      Explicitly deferred to a later pass (structure before polish): the
      opacity-vs-brightness motion refinement, stronger shadow/weight
      differentiation between focus and neighbor cards, and the rail's
      active-entry-shows-name idea.
      Spec: [docs/specs/0008-project-browser-workspace-frame.md](docs/specs/0008-project-browser-workspace-frame.md)
      Branch: `feat/case-files-migration`
      Verified: `pnpm build`/`pnpm lint` clean; Playwright confirmed the
      rail's chevrons and numbered jump-to both work, all 12 Case Files
      present in the DOM, wheel/keyboard/touch-swipe/reduced-motion/
      focus-card-link-navigation all still correct after the
      restructure, card width measurably scales down between a 1440px
      and 900px stage (420px → 287px), and no horizontal page overflow.
      One dev-mode-only false alarm during verification: a forced
      Playwright click on the rail's "next" chevron appeared not to
      register in `pnpm dev` — root-caused to Next.js's dev toolbar
      (`<nextjs-portal>`) physically overlapping that corner in dev
      builds only; a real (unforced) click against a production build
      (`next build && next start`) confirmed the button works correctly
      with no console errors — not an app bug.

## Done

- [x] **Project Browser: Coverflow redesign** — replaced the List Row
      `/projects` view with a 3D circular "drum" of Case Files
      (`CaseFileDrum`), plus a left numbered rail for direct jump-to
      navigation. User-driven redesign request; validated as a real
      interactive artifact first (four published iterations correcting:
      flat coverflow → true circular placement → correct convex-outward
      card facing (a rotation-sign bug) → correct radius/spacing to
      eliminate card overlap) before any real code, per the project's
      established pattern for interaction-model questions. Amended
      ADR-0007 to add a third motion meaning ("Browse") alongside
      Depth/Navigation, since this motion doesn't fit either existing
      meaning. `CaseFileListItem` (List Row) fully removed — no
      fallback, no toggle, replaced on every device.
      Real bug found and fixed during implementation (not present in
      the artifact, which never tested this): React attaches
      `onWheel`/`onTouchMove` as passive listeners by default, so
      `e.preventDefault()` inside the synthetic handler silently failed
      instead of stopping the page/shell from scrolling underneath the
      drum. Fixed by attaching native, explicitly non-passive
      `wheel`/`touchmove` listeners via a ref + `useEffect` instead of
      React's synthetic `onWheel`/`onTouch*` props.
      Touch/swipe support (flagged as a known gap before implementation
      started, since the artifact only validated desktop wheel/keyboard/
      click) was built and verified via simulated touch events.
      Spec: [docs/specs/0007-project-browser-coverflow.md](docs/specs/0007-project-browser-coverflow.md)
      ADR: [0007-presentation-system](docs/adrs/0007-presentation-system.md) (amended)
      Branch: `feat/case-files-migration`
      Verified: `pnpm build`/`pnpm lint` clean; Playwright confirmed no
      horizontal page overflow from the wide drum geometry, all 12 Case
      Files present in the initial SSR HTML, rail-click/arrow-key/wheel/
      touch-swipe all correctly advance the active card, the focus
      card's link navigates to its real Case File page, reduced-motion
      produces a near-instant focus change, and no console
      errors/warnings (confirming the passive-listener fix actually
      worked, not just silenced the symptom).

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
