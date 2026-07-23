/**
 * The evidence model — see docs/adrs/0006-portfolio-evidence-model.md.
 * Every object here exists to answer two questions: what engineering
 * evidence does it provide, and which principle does that evidence
 * reinforce. Fields follow from those two questions, not storage
 * convenience.
 */

export type Principle = "understand-reality" | "engineer-for-reality" | "own-reality";

export type Ownership = "solo" | "core-contributor" | "rescue" | "inherited";

export type CaseFileStatus = "active" | "dormant" | "closed" | "production";

export type ArtifactType =
  | "repository"
  | "demo"
  | "adr"
  | "spec"
  | "testing-report"
  | "architecture-diagram";

export type Artifact = {
  type: ArtifactType;
  url: string;
  label: string;
};

export type CaseFile = {
  slug: string;
  displayName: string;
  question: string;
  context: string;
  ownership: Ownership;
  status: CaseFileStatus;
  outcome: string;
  principles: Principle[];
  artifacts: Artifact[];
};

export type Investigation = {
  slug: string;
  title: string;
  problem: string;
  symptoms: string;
  initialAssumptions: string;
  investigationTimeline: string;
  rootCause: string;
  verification: string;
  fix: string;
  prevention: string;
  principles: Principle[];
  strengthens: string[]; // Case File slugs
  artifacts: Artifact[];
};

export type DecisionRecord = {
  slug: string;
  title: string;
  problem: string;
  alternatives: string;
  decision: string;
  tradeoffs: string;
  consequences: string;
  principles: Principle[];
  strengthens: string[]; // Case File slugs
  artifacts: Artifact[];
};

export type EngineeringNote = {
  slug: string;
  title: string;
  insight: string;
  context?: string;
  principles: Principle[];
  generalizesFrom?: {
    type: "investigation" | "decision-record" | "case-file";
    slug: string;
  };
};

export type TimelineRecord = {
  organization: string;
  role: string;
  period: string;
  responsibilities: string[];
  relatedCaseFiles: string[]; // Case File slugs
};
