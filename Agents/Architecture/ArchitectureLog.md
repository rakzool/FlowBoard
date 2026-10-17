# Architecture log

## 2026-10-17 — Split board reducer by domain responsibility

- Scope: Refactor the monolithic board reducer without changing the Redux state shape, action names, permission behavior, archive behavior, or component dispatch imports.
- Changed files: `src/store/reducer/boardReducer.ts`, `src/store/reducer/board/boardTypes.ts`, `src/store/reducer/board/boardUtils.ts`, `src/store/reducer/board/containerReducers.ts`, `src/store/reducer/board/taskReducers.ts`, `src/store/reducer/board/feedbackReducers.ts`, `README.md`, `Agents/Architecture/Architecture.md`.
- Architecture impact: `boardReducer.ts` is now a small slice assembler. Container, task, feedback, and shared helper responsibilities are isolated in focused modules while remaining under one `board` slice for cross-entity operations.
- Verification: `npm run build`; `npm run test` (5 tests passed).
