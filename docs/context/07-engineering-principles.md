# Engineering Principles (Context)

> Purpose
>
> This document captures the three engineering principles Portfolio V2's
> content strategy is built around, and the reasoning behind them. It is
> not an ADR or a spec — those record architecture and implementation
> decisions. This records *why* the content is shaped the way it is, so
> future work doesn't drift back toward generic portfolio patterns.
>
> When a content or design decision isn't settled by a spec, evaluate it
> against the test in Section 3 before deciding.

---

# 1. How we got here

Working from `Master-Resume-Database.md` (the permanent source of truth for
this engineer's real project history — 12 documented engagements, honestly
scoped as solo builds, partial contributions, or bounded rescue work), we
mapped the visitor journey for four personas (Recruiter, Hiring Manager,
Senior Engineer, Curious Developer), then identified six recurring
engineering *behaviors* across all 12 projects — deliberately ignoring
technologies, frameworks, and company names:

1. Root-cause debugging under real production pressure
2. Deterministic-vs-AI separation of concerns
3. Architecture discipline / structural rigor
4. Honest ownership under real deadlines
5. Adversarial security reasoning
6. Self-directed process discipline

These six are real and evidence-backed, but six categories is too many for
a visitor to leave remembering. They compress into three principles that
describe the same underlying engineering lifecycle in plain language.

---

# 2. The three principles

## Understand Reality
*"I don't stop at the first explanation. I verify the real one."*

Root-cause debugging rigor — tracing a problem to its actual cause even
when the evidence is indirect, rather than accepting the first plausible
explanation.

## Engineer for Reality
*"I design systems that remain understandable and correct even when
assumptions fail."*

Deterministic-vs-AI separation of concerns, architecture discipline, and
adversarial security reasoning are the same underlying stance applied to
different domains: treat correctness as something to prove, not assume,
and design for the failure mode, not just the happy path.

## Own Reality
*"I document decisions, represent ownership honestly, and make trade-offs
explicit."*

Honest ownership scoping and self-directed process discipline — holding
the work to a standard nobody is enforcing.

---

# 3. The governing test

Every homepage module, project write-up, and content decision on this
project should be evaluated against one question:

> Does this help a visitor conclude that these three principles genuinely
> describe how I work?

If a piece of content doesn't clearly serve at least one of the three
principles, it probably doesn't belong — regardless of how interesting or
technically impressive it is in isolation.

---

# 4. Two standing editorial rules

**Ownership honesty is a portfolio-wide rule, not a story.** "Own Reality"
is not represented by one anecdote — every project write-up on this site
must state ownership, responsibilities, trade-offs, and limitations
honestly, matching the resume database's own discipline ("never flatten
partial ownership into 'built X'"). Apply this to every future
project/case-study page, not just a featured one.

**The portfolio's own engineering discipline is discovered, not
advertised.** This project's own ADRs, specs, and documentation trail are
themselves strong evidence for "Own Reality" and "Engineer for Reality" —
but the homepage must never explicitly point at them ("look at my ADRs!").
A visitor who goes looking (via the GitHub repo, or exploring deeper pages)
should find this discipline for themselves. Discovered evidence is more
convincing than claimed evidence.

---

# 5. What this supersedes

The six themes in Section 1 still exist as the internal analytical layer —
they're useful when deciding what evidence to use where — but they are not
visitor-facing content. Visitors experience three principles, not six
categories. Don't reintroduce the six as homepage sections or navigation
categories.

This document sits alongside `design-workshop-notes.md` in this same
directory: that one records earlier shell-level design intent (workspace
architecture, floating containers), this one records content-level intent
(what the site says and why). Both should be read before a spec is written
for anything neither fully covers.
