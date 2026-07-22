export type Project = {
  slug: string;
  name: string;
  oneLiner: string;
  repoUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "staffmind",
    name: "Staffmind",
    oneLiner:
      "Multi-tenant AI voice agent SaaS — PSTN receptionist plus an avatar-fronted executive assistant. Solo backend build, live with 2 tenants.",
    repoUrl: "https://github.com/deaxparadox/staffmind-backend",
  },
  {
    slug: "hireiq",
    name: "HireIQ",
    oneLiner:
      "AI career-discovery platform matching candidates to companies via a voice-driven onboarding agent, with personalized outreach and pipeline tracking. Solo full-stack build, ~10.5 months: backend services, a deterministic ontology/knowledge-graph matching engine, two independently-tuned voice agents, and the full LangGraph workflow design.",
    repoUrl: "https://github.com/deaxparadox/hireiq",
    featured: true,
  },
  {
    slug: "sellerpulse",
    name: "SellerPulse",
    oneLiner:
      "12-agent AI intelligence platform for Amazon FBA sellers. Core platform contributor on an active, multi-contributor codebase.",
    repoUrl: "https://github.com/deaxparadox/sellerpulse",
  },
  {
    slug: "vocalyst",
    name: "Vocalyst",
    oneLiner:
      "Outbound AI sales-calling SaaS. 3-day rescue engagement — diagnosed 9 production audio issues before a client demo.",
    repoUrl: "https://github.com/deaxparadox/vocalyst",
  },
  {
    slug: "structureiq",
    name: "StructureIQ",
    oneLiner:
      "AI construction-document analyzer extracting structural specs from engineering PDFs. Solo build.",
    repoUrl: "https://github.com/deaxparadox/structureiq",
  },
  {
    slug: "buildconnect-usa",
    name: "BuildConnect USA",
    oneLiner:
      "Verified professional network for the U.S. construction trades. Solo build; Row-Level Security as the entire authorization model.",
    repoUrl: "https://github.com/deaxparadox/buildconnect-usa",
  },
  {
    slug: "founders-lab",
    name: "Founder's Lab",
    oneLiner:
      "Multi-agent \"AI Co-Founder\" assistant embedded in a no-code startup platform. Solo backend build; paused when client funding paused.",
    repoUrl: "https://github.com/deaxparadox/founders-lab",
  },
  {
    slug: "courseforge",
    name: "CourseForge",
    oneLiner:
      "AI course-creation coaching assistant with RAG-grounded responses. Inherited and extended an existing backend mid-project.",
    repoUrl: "https://github.com/deaxparadox/courseforge",
  },
  {
    slug: "lexcall",
    name: "LexCall",
    oneLiner:
      "AI-powered inbound call intake system for a law firm. Solo build, live in production.",
    repoUrl: "https://github.com/deaxparadox/lexcall",
  },
  {
    slug: "interviewprep",
    name: "InterviewPrep",
    oneLiner:
      "Personal flagship project — interview-prep platform with AI-generated questions and a live voice-guided product tour. Fully async Django, hexagonal architecture.",
  },
  {
    slug: "deskmind",
    name: "Deskmind",
    oneLiner:
      "Microsoft 365 operations-automation assistant — email triage, calendar capture, document chat. Solo full-stack build.",
    repoUrl: "https://github.com/deaxparadox/deskmind-backend",
  },
  {
    slug: "ecosystemai",
    name: "EcosystemAI",
    oneLiner:
      "Multi-agent AI SaaS for small businesses. Core backend developer; engagement closed with about half the planned agents functional.",
    repoUrl: "https://github.com/deaxparadox/ecosystemai",
  },
];

export const featuredProject = projects.find((project) => project.featured);
