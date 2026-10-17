---
name: flowboard
description: Use for development, debugging, review, or documentation work in the FlowBoard repository. Read the repository agent context first and keep the current architecture reference accurate after changes.
---

# FlowBoard repository skill

This skill is scoped only to this repository. Do not apply its conventions or modify another project.

## Required context

At the beginning of every FlowBoard task, read:

1. `Agents/Agent.md` — context index and session workflow.
2. `Agents/guidelines.md` — project rules; completed rules are non-negotiable.
3. `Agents/Harness.md` — historical failure patterns; it may be empty.
4. `Agents/Architecture/Architecture.md` — relevant architecture sections.

## Working rules

- Preserve unrelated working-tree changes.
- Keep presentation, state, and integration boundaries clear. Reusable visual primitives belong in `src/components/DesignComponents/`; reusable behavior belongs in hooks or context.
- Update `Agents/Architecture/Architecture.md` when component layout, state ownership, Redux/store integration, styling, theme, or data flow changes.
- Do not claim Redux is active until a store and provider are wired into the application.
- Follow the repository’s Tailwind/theme conventions and completed guidelines.
- Verify changes in proportion to their risk. Prefer `npm run build`; run focused lint on changed TypeScript files when repository-wide lint is blocked by unrelated configuration.

## Current architecture anchors

- Entry flow: `src/main.tsx` → `ThemeProvider` → `App` → `src/pages/layout.tsx`.
- Main layout: `AppHeader`, `Sidebar`, and `Dashboard`.
- Sidebar hierarchy: workspace → spaces → folders → boards, with behavior in `src/hooks/useSideBar.ts`.
- Theme state: `ThemeProvider`, `ThemeContext`, and `useTheme`.
- Styling: Tailwind CSS v4 and tokens in `src/styles/index.css`.

At task completion, report changed files and verification results.
