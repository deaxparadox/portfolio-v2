import type { EngineeringNote } from "@/lib/content/types";
import { getInvestigationsForCaseFile } from "@/lib/content/investigations";
import { getDecisionRecordsForCaseFile } from "@/lib/content/decision-records";

export const engineeringNotes: EngineeringNote[] = [
  {
    slug: "assert-on-data-shape",
    title: "Assert on data shape, not just HTTP success",
    insight:
      "A third-party client library's default-minimal-response behavior can silently produce a false failure. Don't trust result.data truthiness alone — assert on the actual shape of what came back.",
    context:
      "Traced from a silent production bug where every profile save for an existing user returned HTTP 500, root-caused to a Supabase client method's default response behavior on an edge case.",
    principles: ["understand-reality"],
    generalizesFrom: { type: "case-file", slug: "hireiq" },
  },
  {
    slug: "verify-platform-defaults-live",
    title: "Platform assumptions need live verification, not documentation trust",
    insight:
      "A platform's documented default behavior and its actual behavior can quietly diverge. Confirm defaults (like auto-grants on new database tables) against a live system directly, rather than assuming the docs or your mental model still hold.",
    context:
      "Surfaced while closing a bulk-PII-scraping vulnerability — Supabase auto-grants new public-schema tables to anon/authenticated roles by default unless explicitly revoked, confirmed only through direct hostile-client testing.",
    principles: ["understand-reality", "own-reality"],
    generalizesFrom: { type: "case-file", slug: "buildconnect-usa" },
  },
  {
    slug: "silent-failure-more-dangerous",
    title: "A metric that silently looks fine is more dangerous than one that crashes",
    insight:
      "A wrong number that produces no error and no crash can drive a real decision before anyone notices something's off. Treat plausible-looking output with the same suspicion as a visible failure.",
    context: "Generalized directly from the unit-scale account-health bug.",
    principles: ["understand-reality"],
    generalizesFrom: { type: "investigation", slug: "sellerpulse-unit-scale-bug" },
  },
  {
    slug: "shared-root-cause-before-separate-bugs",
    title: "Check for one shared cause before treating symptoms as separate bugs",
    insight:
      "Three reported symptoms that look unrelated on the surface can share a single root cause one layer down. Look for the shared layer before spending effort diagnosing each symptom independently.",
    context:
      "Hallucination, self-interruption, and failed bookings all traced back to one PSTN echo feedback loop.",
    principles: ["understand-reality"],
    generalizesFrom: { type: "investigation", slug: "vocalyst-echo-loop" },
  },
];

export function getEngineeringNote(slug: string): EngineeringNote | undefined {
  return engineeringNotes.find((note) => note.slug === slug);
}

/**
 * Notes that generalize either directly from this Case File, or from an
 * Investigation/Decision Record that strengthens it. Kept as its own
 * lookup rather than a field on Case File, so an Engineering Note stays
 * an independent object that can be discovered through any of the paths
 * that lead to it — not owned by whichever page happens to render it.
 */
export function getEngineeringNotesForCaseFile(caseFileSlug: string): EngineeringNote[] {
  const investigationSlugs = new Set(
    getInvestigationsForCaseFile(caseFileSlug).map((investigation) => investigation.slug),
  );
  const decisionRecordSlugs = new Set(
    getDecisionRecordsForCaseFile(caseFileSlug).map((record) => record.slug),
  );

  return engineeringNotes.filter((note) => {
    const source = note.generalizesFrom;
    if (!source) return false;
    if (source.type === "case-file") return source.slug === caseFileSlug;
    if (source.type === "investigation") return investigationSlugs.has(source.slug);
    if (source.type === "decision-record") return decisionRecordSlugs.has(source.slug);
    return false;
  });
}
