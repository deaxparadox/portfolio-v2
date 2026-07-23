import type { Investigation } from "@/lib/content/types";

export const investigations: Investigation[] = [
  {
    slug: "vocalyst-echo-loop",
    title: "Nine symptoms, one root cause — diagnosed with no call audio",
    problem:
      "A production voice AI was hallucinating mid-call, self-interrupting, and failing bookings — reported as separate issues, days before a client demo.",
    symptoms:
      "Hallucinated responses, the agent talking over itself, and bookings silently failing — three categories of symptom that looked unrelated.",
    initialAssumptions:
      "The client's own theory was \"duplicate audio\" for the self-interruption symptom; the hallucination looked, on the surface, like a model or prompt problem.",
    investigationTimeline:
      "With no live-call access, the control flow was reconstructed turn-by-turn from raw JSON transcripts alone, using a latency_ms/tokens signature to tell whether the deterministic handler or GPT had spoken a given turn. The client's \"duplicate audio\" theory was checked directly against the transcript and found wrong. A git regression was also traced: a barge-in safety flag had been silently flipped back on after a prior fix had disabled it.",
    rootCause:
      "A single shared cause explained all three symptom categories: a PSTN echo feedback loop — the agent's own text-to-speech being picked up by speech-to-text and fed back to GPT-4o as if it were the user talking.",
    verification:
      "Built a 3-signal echo detector (fragment containment, sequence-similarity via difflib, token-overlap scoring) and validated it against the real diagnosed transcripts.",
    fix: "Shipped a pilot fix on the existing production path — 9 distinct audio/booking-layer bugs fixed in total, including the echo loop, an overly aggressive barge-in threshold, and a booking-flow deadlock.",
    prevention:
      "Proposed, in a written ADR, a longer-term migration to the official LiveKit Agents framework (native VAD, model-based turn detection, acoustic echo cancellation) plus LLM function-calling for booking — validated via an automated replay-test harness re-running the real diagnosed transcripts, honestly not yet verified on a live call.",
    principles: ["understand-reality", "own-reality"],
    strengthens: ["vocalyst"],
    artifacts: [
      { type: "repository", url: "https://github.com/deaxparadox/vocalyst", label: "vocalyst" },
    ],
  },
  {
    slug: "sellerpulse-unit-scale-bug",
    title: "The account that looked 100x healthier than it actually was",
    problem:
      "An at-risk seller account's health metric appeared to have improved dramatically overnight — with no crash, no error, nothing to alert anyone.",
    symptoms:
      "A plausible-looking number. Nothing broke. The account simply read as far healthier than reality.",
    initialAssumptions:
      "A normal data update, or a genuine account-health improvement — there was no error to contradict that reading.",
    investigationTimeline:
      "Traced through two SP-API sync generations that had stored the same account-health metric in different numeric scales — one as a fraction (0–1), the other as a percentage (0–100).",
    rootCause:
      "The scale mismatch made a genuinely at-risk account read as up to 100x healthier than it actually was, entirely silently.",
    verification:
      "Confirmed against the raw synced values from both generations directly, not just the displayed metric.",
    fix: "Normalized the scale handling across the sync path (bug chain 74/76).",
    prevention:
      "Reinforced the case for the shared/ single-source-of-truth module already in place — the concrete mechanism, not just a stated principle, for guaranteeing the dashboard and chatbot paths can never diverge on the same underlying number again.",
    principles: ["understand-reality", "engineer-for-reality"],
    strengthens: ["sellerpulse"],
    artifacts: [
      {
        type: "repository",
        url: "https://github.com/deaxparadox/sellerpulse",
        label: "sellerpulse",
      },
    ],
  },
];

export function getInvestigation(slug: string): Investigation | undefined {
  return investigations.find((investigation) => investigation.slug === slug);
}

export function getInvestigationsForCaseFile(caseFileSlug: string): Investigation[] {
  return investigations.filter((investigation) =>
    investigation.strengthens.includes(caseFileSlug),
  );
}
