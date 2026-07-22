# Design Workshop Notes (Context)

> Purpose
>
> This document captures conclusions reached during collaborative design workshops.
> It is not an ADR or a specification.
> It exists to preserve design intent, reasoning, and mental models that are difficult to infer from implementation documents alone.
>
> When implementation questions arise that are not answered by a spec, consult this document before making assumptions.

---

# 1. Overall Vision

Portfolio V2 is intentionally designed as an application rather than a traditional portfolio website.

The desired impression is:

> "I understand how this engineer thinks."

rather than

> "I saw a list of projects."

The portfolio should communicate engineering maturity through interaction, architecture, and storytelling instead of marketing copy.

---

# 2. Workspace Mental Model

Think of the application as an operating system workspace.

There are two independent sibling workspaces.

- Primary Workspace
- Companion Workspace

The Root Layout is invisible.

The Root Layout exists only to position these two workspaces.

It never owns business logic or visible UI.

The Primary Workspace itself is also an invisible container.

Its responsibility is grouping:

- Floating Navigation
- Portfolio Workspace

When the Companion Workspace opens, the Primary Workspace behaves as one unit.

Both the Navigation and Portfolio Workspace resize together.

The Companion Workspace is never rendered inside the Primary Workspace.

It is always a sibling.

This separation is a deliberate architectural decision.

---

# 3. Visible Containers

The user should perceive only three visible containers.

1. Floating Navigation
2. Portfolio Workspace
3. Companion Workspace

The parent layouts should never appear as bordered containers.

Only functional containers should be visually represented.

---

# 4. Homepage Philosophy

The homepage is not a navigation page.

It is the application's lobby.

Avoid presenting:

- Projects
- Resume
- Contact

as the primary experience.

Instead, guide visitors toward understanding engineering work.

The homepage should encourage exploration rather than navigation.

---

# 5. Modules

Pages do not own UI.

Modules own UI.

Every module should answer a single question.

Examples:

Featured Module

"What should I explore first?"

Engineering Module

"How does this engineer solve problems?"

Experience Module

"Where has this engineer solved problems?"

This principle is more important than the exact visual layout.

---

# 6. Progressive Disclosure

Content should become deeper as visitors continue exploring.

Resume

↓

Overview

↓

Engineering Story

↓

Architecture

↓

Lessons Learned

Avoid overwhelming first-time visitors with implementation details.

---

# 7. Visual Philosophy

The interface should feel:

- calm
- premium
- engineered
- intentional

Avoid decorative UI.

Animation should explain layout changes.

Motion should improve orientation.

Future visual ideas such as block typography, ripple effects, and idle lock screens are intentionally deferred until the application's foundation is stable.

---

# 8. Implementation Philosophy

When implementation decisions are not explicitly covered by an ADR or Spec:

Prefer preserving the mental model described here over introducing conventional portfolio patterns.

If uncertainty remains:

Ask.

Do not assume.

This document records design intent.

ADRs record architectural decisions.

Specs record implementation requirements.

All three should be considered together.