import type { CaseFile } from "@/lib/content/types";

/**
 * The four anchor Case Files chosen per the "smallest convincing set"
 * principle — each was picked because it's the strongest evidence for at
 * least one engineering principle, not because every project needed equal
 * representation. The remaining projects in lib/content/projects.ts stay
 * lean until a real feature (a Projects listing) needs them at this depth.
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
    outcome:
      "9 distinct audio/booking-layer bugs diagnosed and fixed on a pilot branch. A longer-term architectural fix (LLM function-calling + migration to the official LiveKit Agents framework) was designed, ADR-documented, and validated via an automated replay-test harness against the real diagnosed transcripts — honestly, not yet shipped to production or verified on a live call with LLM booking-tools enabled.",
    principles: ["understand-reality", "own-reality"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/vocalyst", label: "vocalyst" },
    ],
  },
];

export function getCaseFile(slug: string): CaseFile | undefined {
  return caseFiles.find((caseFile) => caseFile.slug === slug);
}
