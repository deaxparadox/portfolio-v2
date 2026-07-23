import Link from "next/link";
import { WorkbenchModule } from "@/components/modules/workbench-module";
import { TimelineStrip } from "@/components/modules/timeline-strip";
import { timeline } from "@/lib/content/timeline";

export function HomeWorkspace() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <WorkbenchModule
        size="hero"
        kind="Investigation"
        badge={{ label: "Closed" }}
        title="Nine symptoms, one root cause — diagnosed with no call audio"
        summary="A production voice AI was hallucinating mid-call, self-interrupting, and failing bookings — reported as separate issues, days before a client demo."
        detail="A single shared cause explained all three symptom categories: a PSTN echo feedback loop — the agent's own text-to-speech being picked up by speech-to-text and fed back to GPT-4o as if it were the user talking."
        href="/projects/vocalyst"
      />

      <WorkbenchModule
        size="medium"
        kind="Decision Record"
        badge={{ label: "Active" }}
        title="Removing the API layer instead of hardening it"
        summary="A traditional backend API server is itself an attack surface — every route is one more place authorization logic can be gotten wrong."
        detail="The browser talks directly to Postgres via the Supabase client SDK; Row-Level Security, column-scoped grants, and database triggers become the entire authorization layer — an entire vulnerability class removed by removing the layer itself, not hardening it."
        href="/projects/buildconnect-usa"
      />

      <WorkbenchModule
        size="medium"
        kind="Case File"
        badge={{ label: "Needs attention", attention: true }}
        title="HireIQ"
        summary="A solo-built AI career platform — ~36,000 lines, two independently-tuned voice agents."
        detail="The employer module is still mid-development, and a Gemini 3.x migration deadline was missed — both stated plainly, not hidden."
        href="/projects/hireiq"
      />

      <div className="rounded-lg border border-border bg-foreground/5 p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Engineering Note
        </span>
        <p className="mt-2 text-sm font-semibold">
          A metric that silently looks fine is more dangerous than one that crashes
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          A wrong number that produces no error and no crash can drive a real decision
          before anyone notices something&apos;s off.
        </p>
        <Link
          href="/projects/sellerpulse"
          className="mt-3 inline-block text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
        >
          From SellerPulse →
        </Link>
      </div>

      {timeline[0] && <TimelineStrip record={timeline[0]} />}
    </div>
  );
}
