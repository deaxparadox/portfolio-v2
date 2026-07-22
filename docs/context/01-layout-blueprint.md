# Workspace Layout Blueprint

This document is the single source of truth for the application layout.

No implementation should guess the layout.

## Root Layout

The Root Layout is invisible.

It owns positioning only.

It never owns business logic.

It never renders visible borders.


## Behavior

When Deax opens:

- Companion Workspace expands.
- Primary Workspace compresses.
- Navigation compresses together with the Portfolio Workspace.
- Root Layout never changes.

When Deax closes:

- Primary Workspace expands.
- Companion Workspace collapses.

...