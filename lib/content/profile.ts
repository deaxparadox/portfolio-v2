import type { Principle } from "@/lib/content/types";

export const profile = {
  name: "Nitish Kushwaha",
  title: "Software Engineer · Backend & AI",
  intro:
    "I build production backend systems — schema design, service architecture, background workers — and the applied AI layered on top of them: multi-agent orchestration, real-time voice agents, retrieval-augmented generation. Since January 2025 I've shipped production systems across 12 documented projects, backend and AI as one continuous engineering problem, not two separate specialties.",
  // The standard every piece of evidence on this site is measured against.
  // See docs/context/07-engineering-principles.md — these stay invisible
  // as homepage sections; visitors should discover them through evidence,
  // not read them as a list.
  principles: [
    {
      id: "understand-reality" satisfies Principle,
      label: "Understand Reality",
      description: "I don't stop at the first explanation. I verify the real one.",
    },
    {
      id: "engineer-for-reality" satisfies Principle,
      label: "Engineer for Reality",
      description:
        "I design systems that remain understandable and correct even when assumptions fail.",
    },
    {
      id: "own-reality" satisfies Principle,
      label: "Own Reality",
      description: "I document decisions, represent ownership honestly, and make trade-offs explicit.",
    },
  ],
  contact: {
    email: "nitish000000kushwaha@gmail.com",
    linkedin: "https://www.linkedin.com/in/deaxparadox/",
    github: "https://github.com/deaxparadox",
  },
} as const;
