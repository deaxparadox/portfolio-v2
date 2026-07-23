# Spec 0005: Remaining Case Files Migration

Status: Proposed
Branch: `feat/case-files-migration` off `main`
Depends on: [ADR-0006](../adrs/0006-portfolio-evidence-model.md), [ADR-0007](../adrs/0007-presentation-system.md)

## What's being built

Migrates the 8 projects still living only as lean `Project` entries in
`lib/content/projects.ts` (Staffmind, StructureIQ, Founder's Lab,
CourseForge, LexCall, InterviewPrep, Deskmind, EcosystemAI) into the
same `CaseFile` type the 4 anchors already use. Per ADR-0007, depth is
a property of the object, not a different schema — these 8 get
**base shape only**: `question`/`context`/`ownership`/`status`/
`hasOpenRisk`/`outcome`/`principles`/`artifacts`. No Investigations,
Decision Records, or Engineering Notes are invented for them.

This is a mechanical, non-exploratory step: every fact below was
re-verified directly against `Master-Resume-Database.md` this session
(sections 373–2649), not recalled from earlier in the conversation.
Nothing here is invented — where the source material states something
honestly (a missed deadline, a stub feature, an unconfirmed
deployment), that's carried over as-is, matching the "Own Reality"
discipline already applied to the 4 anchors.

## Why now

Project Browser (the next consumer, not part of this spec) needs a
single knowledge-object type to iterate over. Building it against a
mix of `Project` and `CaseFile` would mean branching on two shapes —
exactly the inconsistency ADR-0007 exists to prevent. This migration
removes that branch before Project Browser is written, rather than
working around it inside the consumer.

## Proposed content

All 8 get `ownership`/`status` drawn directly from source material —
several use values not yet exercised by the 4 anchors (`inherited` for
CourseForge, `production` for LexCall, `dormant` for StructureIQ/
Deskmind), which is why those enum values exist in `types.ts` already.

### Staffmind
- **question**: Can a multi-tenant voice AI system stay safely isolated
  per business when the database's own row-level security is
  deliberately bypassed for call-time latency?
- **context**: Multi-tenant AI voice agent SaaS — a PSTN customer-service
  receptionist plus a browser-based, avatar-fronted executive assistant
  ("Remi"), sharing one backend. 100% of the backend solo (all routers,
  both LiveKit agent workers, 50+ migrations); two named businesses live.
- **ownership**: solo · **status**: active · **hasOpenRisk**: true
  (Google OAuth verification, A2P 10DLC SMS approval, and VPS SSL/DNS
  setup are still pending despite two businesses already live; the
  project's own docs are internally inconsistent on router count and
  billing metric)
- **outcome**: Backend and both agent workers fully built and running
  for two live businesses — honestly, not yet fully launched.
- **principles**: engineer-for-reality, own-reality
- **artifacts**: repository → `deaxparadox/staffmind-backend`

### StructureIQ
- **question**: Can an AI pipeline reading structural engineering
  drawings be trusted not to invent a hardware spec it isn't sure about?
- **context**: Solo-built AI construction-document analyzer — uploads a
  structural PDF, extracts hardware/lumber/concrete specs via a hybrid
  text/vision pipeline. Self-hosted via Docker Compose; no cloud hosting.
- **ownership**: solo · **status**: dormant · **hasOpenRisk**: true (a
  multi-modal callout-extraction engine exists in the current codebase
  but isn't described in the project's own docs — an acknowledged gap;
  a preliminary V2 quantity-estimation module is explicitly flagged as
  an estimate, not a verified feature)
- **outcome**: V1 (spec/hardware extraction) shipped and functional for
  one client. A hallucination defect the client caught during a live
  walkthrough directly hardened the "return empty over guessed" rule.
- **principles**: understand-reality, engineer-for-reality
- **artifacts**: repository → `deaxparadox/structureiq`

### Founder's Lab
- **question**: When a client's funding disappears mid-build, what does
  an honest account of "done" actually look like?
- **context**: Multi-agent "AI Co-Founder" chat assistant embedded in a
  Bubble.io no-code platform — two independent LangGraph state machines,
  a custom LLM wrapper for token metering, a no-password SSO bridge.
  Backend built solo, by hand, no prior codebase.
- **ownership**: solo · **status**: closed · **hasOpenRisk**: true
  (documented, unremediated hardening gaps — hardcoded `SECRET_KEY`,
  `DEBUG=True`, wildcard `ALLOWED_HOSTS`, open CORS, a thread-unsafe
  token counter — all still open since work stopped)
- **outcome**: Backend substantially complete when the client's own
  funding was paused — not a delivery or quality failure. No commits
  since 2026-04-01.
- **principles**: engineer-for-reality, own-reality
- **artifacts**: repository → `deaxparadox/founders-lab`

### CourseForge
- **question**: What's the first real deliverable when you inherit
  someone else's backend mid-project — a feature, or a diagnosis?
- **context**: AI course-creation coaching assistant embedded via
  iframe in WordPress, RAG-grounded over a 14-document Polish-language
  knowledge base. Inherited an existing Modules 1–4 FastAPI scaffold
  mid-project and extended it.
- **ownership**: inherited · **status**: active · **hasOpenRisk**: true
  (synchronous I/O inside async request handlers silently serializes
  requests under load — no error, just degraded throughput; Module 6
  has a frontend but no backend endpoints at all)
- **outcome**: Built out session management and the Module 5 endpoint;
  diagnosed several pre-existing silent defects (a truthy-`.exists()`
  bug, dead validation code, a disabled history-injection line) in code
  written before this engagement.
- **principles**: understand-reality, own-reality
- **artifacts**: repository → `deaxparadox/courseforge`

### LexCall
- **question**: Can a purely third-party-hosted conversational AI be
  integrated as just a webhook consumer — zero in-repo LLM calls — and
  still demand serious engineering?
- **context**: AI-powered inbound call intake system for a law firm,
  built solo and by hand around ElevenLabs Conversational AI — HMAC
  webhook verification, an authenticated audio-streaming proxy, Azure AD
  SSO for the staff dashboard.
- **ownership**: solo · **status**: production · **hasOpenRisk**: true
  (a self-documented JWKS signature-verification fallback gap, plus two
  secondary webhook endpoints that accept unauthenticated POST requests)
- **outcome**: Live in production as an MVP/demo. Both open security
  gaps are self-flagged in the project's own decision log rather than
  discovered externally.
- **principles**: engineer-for-reality, own-reality
- **artifacts**: repository → `deaxparadox/lexcall`

### InterviewPrep
- **question**: Is the engineering discipline behind a project — specs,
  decision logs, root-cause-before-fix — itself worth building and
  documenting, not just the product?
- **context**: Personal flagship project — a fully async Django/Next.js
  interview-prep platform with a LiveKit/OpenAI Realtime voice product
  tour. 100% solo; no client, employer, or co-founder.
- **ownership**: solo · **status**: active · **hasOpenRisk**: true
  (AI-generation tests mock the provider layer rather than evaluating
  real output quality — a gap the engineer himself audited and
  documented, no golden-dataset evals or LLM-as-judge exist yet)
- **outcome**: Phase 2 (core practice flows) complete and passing;
  Phase 3 (voice tour, further domain expansion) in progress. No cloud
  deployment exists — local-only via Docker Compose.
- **principles**: understand-reality, own-reality
- **artifacts**: (none — no public repository is listed for this project)

### Deskmind
- **question**: Does a working CI/CD pipeline mean a product actually
  shipped?
- **context**: Microsoft 365 operations-automation assistant (mail
  triage, calendar capture, document chat) for a client — an
  OAuth-account-as-identity design collapsing "sign up" and "connect
  Microsoft 365" into one action. Built solo, both sides, over roughly
  4 weeks.
- **ownership**: solo · **status**: dormant · **hasOpenRisk**: true (a
  CI/CD pipeline exists but whether it ever produced a successful live
  deployment was never confirmed; no rate-limiting; no test coverage;
  at least one feature left incomplete/commented out)
- **outcome**: Fully built — backend rewritten from an abandoned
  scaffold, full React frontend — but dormant since 2025-09-12. The
  project's real state lives on `feature/async`; the default `main`
  branch is an abandoned, unrelated scaffold.
- **principles**: engineer-for-reality, own-reality
- **artifacts**: repository → `deaxparadox/deskmind-backend`

### EcosystemAI
- **question**: When a client insists on shipping every feature at
  once against your advice, how do you honestly represent what's
  actually yours and actually works?
- **context**: Multi-agent AI SaaS for small businesses — 9 planned
  agents (support, scheduling, phone, content, HR, COO, SEO,
  accounting) from one dashboard. Sole backend developer, no
  pre-existing codebase.
- **ownership**: solo · **status**: closed · **hasOpenRisk**: true
  (confirmed via direct spot-check: credit/billing enforcement was
  never functional and the email-sending task was a complete no-op;
  wide-open CORS; 4 of 9 shipped "agents" were complete stubs)
- **outcome**: 4 of 9 agents (customer support, appointment setting,
  phone, and the retrieval half of content/email) reached a functional
  state; the other 5 remained stubs after the client shipped all 9
  simultaneously against this engineer's advice. Never reached
  production; the project closed before completion.
- **principles**: own-reality, engineer-for-reality
- **artifacts**: repository → `deaxparadox/ecosystemai`

## Implementation

- Append all 8 `CaseFile` objects to `lib/content/case-files.ts`,
  matching the existing style of the 4 anchors exactly (same field
  order, same tone).
- Update the file's top doc-comment: it currently describes itself as
  holding only "the four anchor Case Files" — that framing is now
  wrong once all 12 exist here at varying depth.
- Delete `lib/content/projects.ts` once all 12 slugs exist as Case
  Files — the `Project` type and its lean shape becomes fully
  redundant, not just duplicated. Confirm nothing outside this file
  still imports from `projects.ts` before deleting (`grep` first).
- `app/projects/[slug]/page.tsx` already renders any found `CaseFile`
  via `getCaseFile(slug)` and only falls back to the placeholder when
  a slug isn't found — no changes needed there; all 12 slugs now
  resolve to real content automatically.
- No changes to Investigation/Decision Record/Engineering Note data —
  none are added for these 8, per ADR-0007.

## Explicitly out of scope

- Project Browser itself (`/projects` listing) — next step after this
  lands, not part of this spec.
- Any Investigation/Decision Record/Engineering Note content for these
  8 projects — would require the same "smallest convincing set"
  evidence-selection process the 4 anchors went through, not a
  mechanical transcription.

## Verification plan

- `pnpm build`/`pnpm lint` clean (typecheck passes on all 12 objects
  against the shared `CaseFile` type).
- Visit `/projects/<slug>` for all 8 newly-migrated slugs directly;
  confirm each renders a complete Case File (question, ownership/status
  badge, context, outcome) with no Investigations/Decision
  Records/Notes sections shown (since none exist for these) and no
  broken layout from an empty related-objects state.
- Confirm the 4 existing anchors are visually unaffected.
- `grep` confirms no remaining import of `lib/content/projects.ts`
  before it's deleted.

## Open items requiring your approval before implementation

1. The specific `ownership`/`status`/`hasOpenRisk` values and
   `question`/`outcome` wording above — flag anything that reads wrong
   before it's committed to code.
2. Deleting `lib/content/projects.ts` entirely once migrated, rather
   than leaving it as unused dead code — flag if you'd rather keep it
   around for now.
3. Once confirmed, implementation proceeds on
   `feat/case-files-migration`, verified per plan, then `todo.md`/
   `CHANGELOG.md` updated in the closing commit.
