import type { TimelineRecord } from "@/lib/content/types";

/**
 * Only the four anchor Case Files are linked here so far. Excellence
 * Technologies spans all 12 engagements (see case-files.ts), but linking
 * the remaining 8 is deferred until Timeline is built as a real consumer.
 */
export const timeline: TimelineRecord[] = [
  {
    organization: "Excellence Technologies",
    role: "Backend / AI Engineer",
    period: "Jan 2025 – Present",
    responsibilities: [
      "Owns backend architecture and implementation for assigned client SaaS products end to end: schema design, API design, authentication/authorization, background job processing, and third-party integrations.",
      "Builds and integrates real-time AI systems — multi-agent orchestration, voice agents, RAG pipelines — as a core, recurring part of client backend work, not a separate specialization.",
      "Diagnoses and resolves production issues independently, including under externally-imposed deadline pressure.",
      "Works across ownership models depending on the engagement: full-stack solo builds, backend-only ownership, partial contributions to a pre-existing multi-contributor codebase, and bounded rescue/diagnostic engagements.",
    ],
    relatedCaseFiles: ["hireiq", "buildconnect-usa", "sellerpulse", "vocalyst"],
  },
];
