import type { DecisionRecord } from "@/lib/content/types";

export const decisionRecords: DecisionRecord[] = [
  {
    slug: "hireiq-jwt-role-source",
    title: "Reading roles from a claim the client can't rewrite",
    problem:
      "Role-based access control needs to read a user's role from somewhere in their JWT — but not every claim in a JWT is trustworthy.",
    alternatives:
      "Read the role from user_metadata, the more commonly reached-for field — convenient, but client-writable, meaning a user could rewrite their own role and grant themselves elevated access.",
    decision:
      "Read RBAC roles exclusively from app_metadata, the server-controlled claim a client cannot modify.",
    tradeoffs:
      "Slightly more setup than the convenient default, in exchange for closing a real privilege-escalation path rather than assuming client input can be trusted.",
    consequences:
      "This pattern is now the portfolio-wide reference for this exact bug class — the same client-writable-claim mistake it prevents shows up as a common, real vulnerability across unrelated codebases.",
    principles: ["engineer-for-reality"],
    strengthens: ["hireiq"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/hireiq", label: "hireiq" },
    ],
  },
  {
    slug: "buildconnect-no-api-server",
    title: "Removing the API layer instead of hardening it",
    problem:
      "A traditional backend API server is itself an attack surface — every route is one more place authorization logic can be gotten wrong.",
    alternatives:
      "Build a conventional API server layer with authorization checks in application code, the default approach for most backends.",
    decision:
      "Remove the API server entirely. The browser talks directly to Postgres via the Supabase client SDK; Row-Level Security, column-scoped grants, and database triggers become the entire authorization layer, with all business logic written as SECURITY DEFINER database functions.",
    tradeoffs:
      "This shifts the entire security burden onto the database schema and policies — it demands adversarial verification of every table, RPC, and policy against a hostile client calling the database directly, bypassing the UI entirely, rather than trusting that an API layer would have caught it.",
    consequences:
      "An entire class of API-layer vulnerabilities is eliminated by removing the layer itself, not by hardening it — verified in practice via direct hostile-client API scripting before every merge, plus an external security review required before implementation, not just before merge.",
    principles: ["engineer-for-reality"],
    strengthens: ["buildconnect-usa"],
    artifacts: [
      {
        type: "repository",
        url: "https://github.com/deaxparadox/buildconnect-usa",
        label: "buildconnect-usa",
      },
    ],
  },
  {
    slug: "sellerpulse-deterministic-first",
    title: "The model never touches the numbers",
    problem:
      "A dashboard and a chatbot need to show the same account-health numbers — and letting an LLM reformat or recompute those numbers on either path risks the two surfaces silently disagreeing.",
    alternatives:
      "Let the LLM read and reformat raw metric data itself for narrative flexibility — this was, in effect, already tried: a missing frontend hook meant page context was sometimes null, forcing a slower path where the LLM reformatted raw floats itself, which is exactly what produced the dashboard/chatbot value mismatch this decision exists to prevent.",
    decision:
      "A deterministic-first architecture: every numeric output is always code-computed through a typed, phased pipeline (DB fetch → metrics analysis → violations analysis → risk calculation); the LLM is invoked only in a final judgment phase, layered on top of numbers it never touches.",
    tradeoffs:
      "Requires more upfront structure (typed DSPy signature modules per phase) than letting the LLM handle formatting directly — the discipline pays for itself the moment two independent surfaces must never disagree on the same fact.",
    consequences:
      "Backed by a shared/ single-source-of-truth module as the concrete enforcement mechanism, not just a stated principle — the dashboard and chatbot pipelines structurally cannot diverge on the same metric.",
    principles: ["engineer-for-reality", "understand-reality"],
    strengthens: ["sellerpulse"],
    artifacts: [
      {
        type: "repository",
        url: "https://github.com/deaxparadox/sellerpulse",
        label: "sellerpulse",
      },
    ],
  },
  {
    slug: "vocalyst-where-determinism-matters",
    title: "Determinism where the cost of being wrong differs",
    problem:
      "A brittle regex/keyword intent matcher was failing on real conversational variance — the obvious fixes were either more regex patterns, or handing everything to the LLM.",
    alternatives:
      "Keep expanding the regex/keyword matcher (doesn't scale to real conversational variance); or let the LLM handle every kind of intent, including compliance-critical moments like an opt-out request.",
    decision:
      "Let LLM function-calling own ordinary conversational intent, but keep deterministic code exclusively for tool-side validation and compliance/safety tripwires — opt-out, abuse, prompt injection.",
    tradeoffs:
      "Reasoned explicitly about asymmetric failure cost: a missed ordinary intent match is just a worse conversational turn, while a missed compliance tripwire carries real legal risk — so determinism goes where the stakes are highest, not applied uniformly everywhere.",
    consequences:
      "Written up as a formal ADR before implementation. The compliance guard was later validated live: a caller saying \"take me off your list\" produced a fixed do-not-call response and immediate hangup with no LLM involvement at all — confirming the safety-critical path bypasses the model entirely.",
    principles: ["engineer-for-reality", "understand-reality"],
    strengthens: ["vocalyst"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/vocalyst", label: "vocalyst" },
    ],
  },
];

export function getDecisionRecord(slug: string): DecisionRecord | undefined {
  return decisionRecords.find((record) => record.slug === slug);
}

export function getDecisionRecordsForCaseFile(caseFileSlug: string): DecisionRecord[] {
  return decisionRecords.filter((record) => record.strengthens.includes(caseFileSlug));
}
