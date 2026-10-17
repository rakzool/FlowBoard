# FlowBoard agent context index

Read this file first at the start of every repository session. Then read the files relevant to the requested change.

## Context files

| File | Purpose | When to read |
| --- | --- | --- |
| `Agents/Agent.md` | Index of the agent context files and their responsibilities. | Always; this is the entry point. |
| `Agents/guidelines.md` | Repository rules and constraints that must not be violated. | Always before editing or creating files. |
| `Agents/Harness.md` | Historical failure patterns and anti-patterns from previous agent work. | Always before executing a task; currently empty. |
| `Agents/Architecture/Architecture.md` | Current architecture, source layout, state ownership, styling, and integration boundaries. | Before changes that affect components, hooks, context, state, routes, or styling. |

## Session workflow

1. Read `Agent.md`, `guidelines.md`, and `Harness.md`.
2. Read the relevant sections of `Architecture.md` before changing code.
3. Inspect the affected source files and preserve unrelated working-tree changes.
4. Implement and verify the requested change.
5. Update `Architecture.md` whenever the component layout, state management, Redux integration, styling, theme, or data flow changes.

## Repository conventions

- Source code is under `src/`; reusable visual primitives belong under `src/components/DesignComponents/`.
- React behavior that may later move to Redux belongs in hooks or context rather than being embedded in presentational markup.
- Tailwind utility classes and the tokens in `src/styles/index.css` are the styling system.
- Do not claim Redux is active until a store and provider are actually wired into the app.
