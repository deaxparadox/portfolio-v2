import type { CaseFile } from "@/lib/content/types";

/**
 * Twelve Case Files at varying depth — depth is a property of the object,
 * not a different schema (ADR-0007). The first four (HireIQ, BuildConnect
 * USA, SellerPulse, Vocalyst) were chosen per the "smallest convincing set"
 * principle and carry linked Investigations/Decision Records/Notes; the
 * remaining eight carry base structural fields only, migrated from the
 * former lib/content/projects.ts (now removed).
 */
export const caseFiles: CaseFile[] = [
  {
    slug: "hireiq",
    displayName: "HireIQ",
    question:
      "Can candidates get real, structured matches to companies and jobs — plus a way to reach actual hiring contacts — without collapsing into generic job-board noise?",
    context:
      "A full-stack, solo-built AI career-discovery platform: ~36,000 lines of service-layer code, 13 service domains, two independently-tuned voice agents (Akira for candidates, Arika for employers), a deterministic ontology/knowledge-graph matching engine, and a LangGraph conversational workflow — hexagonal architecture enforced throughout, ~10.5 months, 1,834 commits.",
    ownership: "solo",
    status: "active",
    hasOpenRisk: true,
    outcome:
      "Entire backend, both voice agents, and the matching engine shipped and running. The employer module is honestly still mid-development, and a Gemini 3.x migration deadline was missed and remains an open, unresolved item.",
    principles: ["engineer-for-reality", "own-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/hireiq", label: "hireiq" },
    ],
  },
  {
    slug: "buildconnect-usa",
    displayName: "BuildConnect USA",
    question:
      "Can a professional network for the construction trades be secure when there's no backend API at all — when the browser talks straight to the database?",
    context:
      "A verified professional network for U.S. construction trades, built solo end to end: frontend, the entire Supabase schema/RLS/migration set, Stripe billing, and an AI verification Edge Function. Every table, RPC, and policy was evaluated under one adversarial question — what can a hostile client do calling the database directly, bypassing the UI — verified with direct hostile-client API scripts, not just UI testing.",
    ownership: "solo",
    status: "active",
    hasOpenRisk: false,
    outcome:
      "A 2-week V1 (security fixes, directory, AI + admin verification, realtime messaging, Stripe memberships) shipped and merged to main. Honestly, it is not yet deployed to production — a dev-mode instance is live at a bare IP:port, and the production Docker cutover hasn't happened yet.",
    principles: ["engineer-for-reality", "own-reality"],
    artifacts: [
      {
        type: "repository",
        url: "https://github.com/deaxparadox/buildconnect-usa",
        label: "buildconnect-usa",
      },
    ],
  },
  {
    slug: "sellerpulse",
    displayName: "SellerPulse",
    question:
      "Can an AI dashboard and an AI chatbot ever show a different number for the same metric — and how do you make that structurally impossible instead of hoping it doesn't happen?",
    context:
      "A 12-agent AI intelligence platform for Amazon FBA sellers — an active, pre-existing multi-contributor codebase (582+ commits) joined as a core platform developer, not the original author. Specifically built from scratch: the Profit Leak Detective v2 pipeline, the Celery/Redis background-worker architecture, the Decision Agent (deterministic-first) pattern, a new Compliance Manager agent, and the shared/ single-source-of-truth module.",
    ownership: "core-contributor",
    status: "active",
    hasOpenRisk: true,
    outcome:
      "The Decision Agent architecture and shared/ module are adopted platform-wide, preventing the dashboard and chatbot from ever computing the same metric two different ways. One issue is still honestly open: a missing React hook (AccountGuardian.tsx) remains a workaround, not a fix, as of the latest snapshot.",
    principles: ["understand-reality", "engineer-for-reality", "own-reality"],
    artifacts: [
      {
        type: "repository",
        url: "https://github.com/deaxparadox/sellerpulse",
        label: "sellerpulse",
      },
    ],
  },
  {
    slug: "vocalyst",
    displayName: "Vocalyst",
    question:
      "Nine seemingly separate bugs were being reported in a live voice AI system, days before a client demo — were they nine problems, or one?",
    context:
      "A bounded, 3-day invited rescue/diagnostic engagement on an outbound voice-AI sales platform this engineer didn't design or build, with no live-call access — diagnosis had to happen entirely from call transcripts and git history.",
    ownership: "rescue",
    status: "closed",
    hasOpenRisk: false,
    outcome:
      "9 distinct audio/booking-layer bugs diagnosed and fixed on a pilot branch. A longer-term architectural fix (LLM function-calling + migration to the official LiveKit Agents framework) was designed, ADR-documented, and validated via an automated replay-test harness against the real diagnosed transcripts — honestly, not yet shipped to production or verified on a live call with LLM booking-tools enabled.",
    principles: ["understand-reality", "own-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/vocalyst", label: "vocalyst" },
    ],
  },
  {
    slug: "staffmind",
    displayName: "Staffmind",
    question:
      "Can a multi-tenant voice AI system stay safely isolated per business when the database's own row-level security is deliberately bypassed for call-time latency?",
    context:
      "A multi-tenant AI voice agent SaaS: a PSTN customer-service receptionist plus a browser-based, avatar-fronted executive assistant ('Remi'), sharing one backend. 100% of the backend built solo (all routers, both LiveKit agent workers, 50+ migrations); two named businesses are live.",
    ownership: "solo",
    status: "active",
    hasOpenRisk: true,
    outcome:
      "Backend and both agent workers fully built and running for two live businesses — honestly, not yet fully launched: Google OAuth verification, A2P 10DLC SMS approval, and VPS SSL/DNS setup are still pending, and the project's own docs are internally inconsistent on router count and billing metric.",
    principles: ["engineer-for-reality", "own-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/staffmind-backend", label: "staffmind-backend" },
    ],
  },
  {
    slug: "structureiq",
    displayName: "StructureIQ",
    question:
      "Can an AI pipeline reading structural engineering drawings be trusted not to invent a hardware spec it isn't sure about?",
    context:
      "A solo-built AI construction-document analyzer: a contractor uploads a structural PDF and gets back extracted hardware, lumber, and concrete specs via a hybrid text/vision pipeline. Self-hosted via Docker Compose; no cloud hosting.",
    ownership: "solo",
    status: "dormant",
    hasOpenRisk: true,
    outcome:
      "V1 (spec/hardware extraction) shipped and functional for one client. A hallucination defect the client caught during a live walkthrough directly hardened the project's 'return empty over guessed' rule. A multi-modal callout-extraction engine exists in the current codebase but isn't described in the project's own docs — an acknowledged gap — and a preliminary V2 quantity-estimation module is explicitly flagged as an estimate, not a verified feature.",
    principles: ["understand-reality", "engineer-for-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/structureiq", label: "structureiq" },
    ],
  },
  {
    slug: "founders-lab",
    displayName: "Founder's Lab",
    question:
      "When a client's funding disappears mid-build, what does an honest account of \"done\" actually look like?",
    context:
      "A multi-agent 'AI Co-Founder' chat assistant embedded in a Bubble.io no-code platform — two independent LangGraph state machines, a custom LLM wrapper for token metering, a no-password SSO bridge. Backend built solo, by hand, no prior codebase.",
    ownership: "solo",
    status: "closed",
    hasOpenRisk: true,
    outcome:
      "Backend substantially complete when the client's own funding was paused — not a delivery or quality failure. No commits since 2026-04-01. Several documented, unremediated hardening gaps remain open: a hardcoded SECRET_KEY, DEBUG=True, wildcard ALLOWED_HOSTS, open CORS, and a thread-unsafe token counter.",
    principles: ["engineer-for-reality", "own-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/founders-lab", label: "founders-lab" },
    ],
  },
  {
    slug: "courseforge",
    displayName: "CourseForge",
    question:
      "What's the first real deliverable when you inherit someone else's backend mid-project — a feature, or a diagnosis?",
    context:
      "An AI course-creation coaching assistant embedded via iframe in WordPress, RAG-grounded over a 14-document Polish-language knowledge base. Inherited an existing Modules 1–4 FastAPI scaffold mid-project and extended it.",
    ownership: "inherited",
    status: "active",
    hasOpenRisk: true,
    outcome:
      "Built out session management and the Module 5 endpoint; diagnosed several pre-existing silent defects in code written before this engagement, including a truthy-.exists() bug and dead validation code. Synchronous I/O inside async request handlers still silently serializes requests under load, and Module 6 has a frontend but no backend endpoints at all.",
    principles: ["understand-reality", "own-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/courseforge", label: "courseforge" },
    ],
  },
  {
    slug: "lexcall",
    displayName: "LexCall",
    question:
      "Can a purely third-party-hosted conversational AI be integrated as just a webhook consumer — zero in-repo LLM calls — and still demand serious engineering?",
    context:
      "An AI-powered inbound call intake system for a law firm, built solo and by hand around ElevenLabs Conversational AI — HMAC webhook verification, an authenticated audio-streaming proxy, Azure AD SSO for the staff dashboard.",
    ownership: "solo",
    status: "production",
    hasOpenRisk: true,
    outcome:
      "Live in production as an MVP/demo. A self-documented JWKS signature-verification fallback gap and two secondary webhook endpoints that accept unauthenticated POST requests are both real, still-open gaps — self-flagged in the project's own decision log rather than discovered externally.",
    principles: ["engineer-for-reality", "own-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/lexcall", label: "lexcall" },
    ],
  },
  {
    slug: "interviewprep",
    displayName: "InterviewPrep",
    question:
      "Is the engineering discipline behind a project — specs, decision logs, root-cause-before-fix — itself worth building and documenting, not just the product?",
    context:
      "A personal flagship project — a fully async Django/Next.js interview-prep platform with a LiveKit/OpenAI Realtime voice product tour. 100% solo; no client, employer, or co-founder.",
    ownership: "solo",
    status: "active",
    hasOpenRisk: true,
    outcome:
      "Phase 2 (core practice flows) complete and passing; Phase 3 (voice tour, further domain expansion) in progress. No cloud deployment exists — local-only via Docker Compose. AI-generation tests mock the provider layer rather than evaluating real output quality — a gap the engineer himself audited and documented, with no golden-dataset evals or LLM-as-judge yet.",
    principles: ["understand-reality", "own-reality"],
    artifacts: [],
  },
  {
    slug: "deskmind",
    displayName: "Deskmind",
    question: "Does a working CI/CD pipeline mean a product actually shipped?",
    context:
      "A Microsoft 365 operations-automation assistant (mail triage, calendar capture, document chat) for a client — an OAuth-account-as-identity design collapsing 'sign up' and 'connect Microsoft 365' into one action. Built solo, both sides, over roughly 4 weeks.",
    ownership: "solo",
    status: "dormant",
    hasOpenRisk: true,
    outcome:
      "Fully built — backend rewritten from an abandoned scaffold, full React frontend — but dormant since 2025-09-12. A CI/CD pipeline exists but whether it ever produced a successful live deployment was never confirmed; no rate-limiting or test coverage exists, and at least one feature was left incomplete. The project's real state lives on `feature/async`; the default `main` branch is an abandoned, unrelated scaffold.",
    principles: ["engineer-for-reality", "own-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/deskmind-backend", label: "deskmind-backend" },
    ],
  },
  {
    slug: "ecosystemai",
    displayName: "EcosystemAI",
    question:
      "When a client insists on shipping every feature at once against your advice, how do you honestly represent what's actually yours and actually works?",
    context:
      "A multi-agent AI SaaS for small businesses — 9 planned agents (support, scheduling, phone, content, HR, COO, SEO, accounting) from one dashboard. Sole backend developer, no pre-existing codebase.",
    ownership: "solo",
    status: "closed",
    hasOpenRisk: true,
    outcome:
      "4 of 9 agents (customer support, appointment setting, phone, and the retrieval half of content/email) reached a functional state; the other 5 remained stubs after the client shipped all 9 simultaneously against this engineer's advice. Confirmed via direct spot-check: credit/billing enforcement was never functional and the email-sending task was a complete no-op. Never reached production; the project closed before completion.",
    principles: ["own-reality", "engineer-for-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/ecosystemai", label: "ecosystemai" },
    ],
  },
];

export function getCaseFile(slug: string): CaseFile | undefined {
  return caseFiles.find((caseFile) => caseFile.slug === slug);
}
