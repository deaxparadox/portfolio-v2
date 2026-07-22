# Spec 0003: Homepage Module (Milestone 3)

Status: Awaiting approval
Branch: `feat/homepage-module` off `main`
Depends on: [ADR-0004](../adrs/0004-content-data-modules.md)

## What's being built

The first real content module: the homepage dashboard (Bible 0.4 §3-4),
replacing `app/page.tsx`'s Milestone-1 placeholder with real cards drawn
from `Master-Resume-Database.md`. Per the Bible's card philosophy (0.4
§3, §11): each card answers exactly one question, cards are navigation
not decoration.

Source facts used below are quoted/paraphrased directly from the resume
database — nothing is invented. Ownership scoping (solo vs. partial
contributor vs. rescue engagement) is preserved exactly as that document
states it, per its own "never flatten" rule.

## Content

### Identity (`lib/content/profile.ts`)

- Name: **Nitish Kushwaha**
- Title: **Software Engineer · Backend & AI**
- Intro: "I build production backend systems — schema design, service
  architecture, background workers — and the applied AI layered on top
  of them: multi-agent orchestration, real-time voice agents,
  retrieval-augmented generation. Since January 2025 I've shipped
  production systems across 12 documented projects, backend and AI as
  one continuous engineering problem, not two separate specialties."
- Contact: email `nitish000000kushwaha@gmail.com`, LinkedIn
  `https://www.linkedin.com/in/deaxparadox/`, GitHub
  `https://github.com/deaxparadox`.

### Cards

| Card | Copy | Destination |
|---|---|---|
| **Featured Work** | HireIQ — "AI career-discovery platform matching candidates to companies via a voice-driven onboarding agent, with personalized outreach and pipeline tracking. Solo full-stack build, ~10.5 months: backend services, a deterministic ontology/knowledge-graph matching engine, two independently-tuned voice agents, and the full LangGraph workflow design." | External: `https://github.com/deaxparadox/hireiq` — see note below on why external, not internal, for now. |
| **Experience** | "Excellence Technologies — Jan 2025–Present. Own production SaaS backends end to end: schema design, auth, background jobs, and the real-time AI systems layered on top." | `/experience` (stays placeholder — its own module) |
| **Projects** | "12 documented projects — voice AI, multi-agent systems, and full-stack SaaS." | `/projects` (stays placeholder — its own module) |
| **Engineering** | "How I think about hard problems: architecture decisions, production debugging, and the trade-offs behind both." | `/engineering` (stays placeholder — its own module) |
| **Resume** | "ATS and human-friendly versions, kept current." | `/resume` (stays placeholder — its own module) |
| **Contact** | "Let's talk about what you're building." | `/contact` — **gets real content now** (see below), since the info is trivial and already sourced |
| **Assistant** | "Want a guided tour instead? Ask Deax." | No route — dispatches `TOGGLE_COMPANION` on the existing workspace context, per CLAUDE.md ("Assistant visibility does NOT belong to routing") |

### Why Featured Work links externally, not to `/projects/hireiq`

`/projects/:slug` still renders Milestone 1's generic "Project: {slug}"
placeholder. Sending a visitor from a real, specific callout straight
into a page that says "Placeholder" would read as broken. Linking to
the live GitHub repo instead is honest and useful today; the internal
link becomes primary once the Projects module (a later milestone)
actually builds that page out. `/projects` itself stays an acceptable
placeholder destination for the **Projects** card, since a generic "more
coming soon" listing page reads as in-progress rather than broken.

### `/contact` gets real content

Small enough to include now without pulling in the rest of that
module's scope: email, LinkedIn, GitHub as plain links, replacing the
`RoutePlaceholder` on that one route only. `/experience`, `/resume`,
`/projects`, `/engineering` are unchanged — their real content is
deeper, dedicated module work.

## Data layer

- `lib/content/profile.ts` — the identity/contact object above.
- `lib/content/projects.ts` — all 12 projects (name, slug, one-liner,
  repo URL where documented, `featured` flag), per ADR-0004. Full list:
  Staffmind, HireIQ *(featured)*, SellerPulse, Vocalyst, StructureIQ,
  BuildConnect USA, Founder's Lab, CourseForge, LexCall, InterviewPrep
  *(no public repo URL documented — omitted rather than guessed)*,
  Deskmind, EcosystemAI. Only `projects.length` and the featured entry
  are read anywhere in this milestone; the rest exist now because the
  extraction work is already done and the Bible wants one shared
  source, not because anything renders them yet.

## Components

- `components/home/dashboard-card.tsx` — the shared card shell (title,
  description, `href` or `onClick`). Seven real call sites in this one
  module justify it now, unlike the shell-only components in Milestone
  2 — this is exactly the point at which a primitive stops being
  speculative.
- `components/home/featured-work-card.tsx` — visually distinct
  (full-width, larger heading per the Bible's wireframe), built on top
  of the same underlying styles as `DashboardCard`.
- `app/page.tsx` — composes profile intro + `FeaturedWorkCard` +
  `DashboardCard` grid, replacing `RoutePlaceholder` entirely.
- `app/loading.tsx` — updated to a cards-shaped skeleton (reusing
  `SkeletonHeading`/`SkeletonLine` from Milestone 2) instead of the
  generic two-line shape, since the real homepage no longer looks like
  a generic placeholder page.
- `app/contact/page.tsx` — real content per above; its `loading.tsx`/
  `error.tsx` are unchanged (still accurate for a simple static page).

## Explicitly out of scope

- `/projects`, `/experience`, `/resume`, `/engineering` real content —
  each is its own future module milestone.
- Per-project deep pages (architecture, challenges, decisions, lessons
  learned) — the source document has all of this; it's not transcribed
  until the Projects module actually renders it (ADR-0004).
- Resume PDF generation/download — `/resume` stays a placeholder link
  target.

## Verification plan

- `pnpm build` / `pnpm lint` clean.
- Visual check at desktop/tablet/mobile: homepage cards lay out
  sensibly at all three breakpoints (grid reflows, Featured Work stays
  full-width).
- Click through every card: Featured Work opens the GitHub repo in a
  new tab; Experience/Projects/Engineering/Resume navigate to their
  (still-placeholder) routes; Contact shows real links; Assistant opens
  the Companion Workspace without navigating.
- Confirm Companion state and Navigation persist when triggered from
  the homepage's Assistant card, same as the existing nav toggle.
- No console errors.

## Open items requiring your approval before implementation

1. All content copy above — this is the actual public-facing text, so
   flag anything you want changed before it's written into code.
2. The Featured-Work-links-externally / Contact-gets-real-content
   scope calls (see rationale above) — flag if you'd rather hold
   Contact's real content for its own later milestone, or handle the
   Featured Work link differently.
3. Once confirmed, implementation proceeds on `feat/homepage-module`,
   verified per plan, then `todo.md`/`CHANGELOG.md` updated in the
   closing commit.
