# FlowBoard architecture

Last reviewed: 2026-10-17

## 1. Application shape

FlowBoard is a Vite + React + TypeScript single-page application. The current app is a shell for a kanban product: a header, a directory-style sidebar, and a dashboard content area.

```text
src/main.tsx
└── ThemeProvider
    └── App
        └── ErrorBoundary
            └── Suspense / PageLoader
                └── pages/layout.tsx
                    ├── AppHeader
                    ├── Sidebar
                    └── Dashboard
```

`src/main.tsx` imports the global stylesheet, creates the React root, and supplies `ThemeProvider`. `src/App.tsx` supplies the error and loading boundaries. `src/pages/layout.tsx` composes the main screen.

## 2. Source layout

| Area | Location | Responsibility |
| --- | --- | --- |
| App bootstrap | `src/main.tsx`, `src/App.tsx` | Root creation, global CSS import, providers, error/loading boundaries. |
| Page composition | `src/pages/layout.tsx` | Full-screen application layout. |
| Header | `src/components/AppHeader/AppHeader.tsx` | Product name and avatar-triggered account menu containing user switching and theme settings. |
| Sidebar | `src/components/Sidebar/SideBar.tsx`, `src/components/Sidebar/FolderTree.tsx`, `src/components/Sidebar/Boards.tsx`, `src/components/Sidebar/ContainerDetailsModal.tsx` | Renders navigation and the workspace → space → folder → board tree. Every create/edit action opens the shared dialog flow; permission-bearing container dialogs expose visibility plus allowed and denied users while the sidebar only owns navigation and action triggers. Dialog triggers use a synchronous `AddForm` boundary to avoid first-open lazy-load latency, and accordion items keep dialogs in an always-mounted overlay slot so collapsed nodes still support actions. |
| Sidebar state | `src/hooks/useSideBar.ts`, `src/hooks/useAccessControl.ts`, `src/store/selectors/accessSelectors.ts`, `src/store/reducer/boardReducer.ts`, `src/store/reducer/sessionReducer.ts`, `src/store/access.ts` | Reads the selector-filtered Redux container tree through the shared access hook, applies role/grant visibility, allows all signed-in users to create spaces, allows space members to create folders/boards, dispatches validated container CRUD and selected-board changes, reports blocked stale actions as forbidden feedback, and clears selection when a board subtree is deleted. Add/edit-form visibility remains local UI state. |
| Dashboard | `src/components/DashBoard/DashBoard.tsx`, `src/hooks/useDashboard.ts` | The component composes board/list/archived presentation and Suspense boundaries; `useDashboard` owns view/modal state, selected-board access resolution, derived task/status data, and archive actions. |
| Board | `src/components/Board/Board.tsx`, `src/components/Board/BoardColumn.tsx`, `src/components/Board/TaskCard.tsx`, `src/components/Board/BoardList.tsx`, `src/components/Board/BoardArchivedList.tsx`, `src/components/Board/BoardViewTabs.tsx`, `src/hooks/useBoardList.ts` | Renders active top-level tasks as kanban/list cards, shows subtask counts, provides a board-scoped archive view, and preserves indexed drag/drop rules. `useBoardList` owns list sorting, drag state, status grouping, and same-status reorder dispatch; `BoardList` composes its presentation. Related board items are bundled with their selected view to avoid serial micro-chunk loads. |
| Task detail | `src/components/TaskDetail/` and `src/types/taskDetail.types.ts` | Owns the task detail modal, assignee display, editable title/description/metadata, subtask section, and archive actions. The modal lazy-loads the content bundle on first open; detail sections are grouped within that chunk and derive edit access locally through `useAccessControl`. Dialog boundaries remain synchronous where first-click responsiveness is required. |
| Design components | `src/components/DesignComponents/` | Reusable `Paper`, `Input`, `MultiInput`, `Toggle`, `Select`, `DatePicker`, `Button`, `Modal`, `Accordion`, `AccordionItem`, and `Toast` primitives; feature code reuses these primitives instead of creating one-off wrappers. `Modal` owns dialog presentation while feature forms own their fields. `ToastProvider` owns the app-wide notification queue and `useToast` exposes the reusable imperative API. |
| Constants and formatting | `src/constants/`, `src/utils/taskFormatting.ts` | Feature-scoped static values live in focused constants modules; shared task date/initials formatting lives in a utility module. Lazy component bindings stay beside their owning UI component. Keep component state and render-derived values local to their owning component or hook. |
| Notifications | `src/components/Notifications/BoardFeedbackToaster.tsx` | Bridges Redux board mutation feedback to the shared toast provider so success and error notifications are rendered once at the application boundary. |
| Theme | `src/context/ThemeContext.ts`, `src/context/ThemeProvider.tsx`, `src/hooks/useTheme.ts` | Theme state, DOM dark-class synchronization, localStorage persistence, and consuming hook. |
| Error/loading UI | `src/components/ErrorBoundry/`, `src/components/PageLoader/` | Runtime error fallback and suspense fallback. |
| Styling | `src/styles/index.css` | Tailwind import, dark variant, theme color tokens, and global transition/color-scheme rules. |
| Utilities | `src/utils/withSuspense.tsx` | Shared typed helper that combines a dynamic import, `React.lazy`, and a local Suspense fallback. |
| Agent tooling | `Agents/`, `.claude/skills/flowboard/SKILL.md`, user-level Codex skill | Shared repository context and cross-tool FlowBoard workflow. |

## 3. Sidebar directory model

The sidebar models the hierarchy below:

```text
Workspace
└── Space[]
    └── Folder[]
        └── Board[]
```

The domain types are in `src/store/types/common.types.ts`, while initial sample data is maintained in `src/data/seedData.json` and loaded/cloned by `src/store/seedState.ts`. A list container represents a board. Statuses and tasks are stored alongside containers and are filtered by the selected list ID for the dashboard.

`Accordion.tsx` and `AccordionItem.tsx` are presentation-only. Each `AccordionItem` owns its local open/closed state and accepts a title, optional icon, optional actions, nesting level, and children. The sidebar composes nested items and supplies the add controls.

Creation is currently in-memory and session-local:

- `startAdding` selects `space`, `folder`, or `board` and an optional parent ID.
- `create` dispatches to the matching creation operation.
- `cancelAdding` clears the active creation form.
- `selectBoard` stores the selected board for the sidebar footer.

The hook is the intended seam for a future Redux slice or API-backed repository. Move persistence and normalized entities there first; keep `SideBar.tsx` focused on rendering.

## 4. State and data flow

### Local React state

- `useSideBar`: active add target, permission-filtered selectors from `useAccessControl`, and dispatchers around Redux container and session state.
- `useAccessControl`: shared current-user, role, grant, container access, task edit-access, container-management, and grant-resolution boundary used by navigation, dashboard, task detail, and account UI. Components derive permission decisions locally rather than receiving drilled permission booleans.
- `useDashboard`: selected board context, board/list/archived view state, task modal state, task/status filtering, subtask counts, and archive/unarchive dispatchers for the dashboard.
- `useBoardList`: list sort key/direction, sorted and status-grouped tasks, active drag identity, drag/drop handling, and permission-checked reorder dispatch for the list view.
- `AccordionItem`: expanded/collapsed state for each accordion node; its overlay slot keeps action dialogs mounted outside the collapsible content.
- `ContainerDetailsModal`: transient name and, for admin users, visibility plus allowed/denied access-user selection for every create/edit dialog. The allowed-user input is shown only for private containers; denied users can be specified for public or private containers.
- `ThemeProvider`: current light/dark theme.
- `AppHeader`: avatar menu open/closed state, account-menu dismissal behavior, and first-accessible-board selection when switching users.

### Context

`ThemeProvider` wraps the app and exposes `{ theme, toggleTheme }` through `ThemeContext`. `useTheme` throws when used outside the provider.

### Redux status

Redux Toolkit and React Redux are active. `src/main.tsx` wraps the application in the Redux `Provider`; `src/store/store.ts` owns the store factory and `src/store/reducer/` owns board/session slices. `board` owns containers, statuses, tasks, users, space grants, and mutation errors. `session` owns the current user and selected list ID. `src/store/access.ts` contains the pure access predicate, `src/store/selectors/accessSelectors.ts` owns visible-container selectors, and `src/hooks/useAccessControl.ts` is the shared React hook used wherever access is checked. Admins bypass access checks. Non-admin access evaluates the workspace-to-resource chain: public nodes are visible to workspace members unless explicitly denied, while private nodes require an allow grant. Typed hooks in `src/store/hooks.ts` are the component boundary.

## 5. Styling and theme

- Tailwind CSS v4 is loaded through `src/styles/index.css` and the Vite Tailwind plugin.
- Custom theme tokens are defined with `@theme`: brand colors, surface/border/muted/danger colors, sidebar spacing, control/panel radii, panel shadow, and caption typography.
- Dark mode uses the custom `@variant dark` selector and the `dark` class on `document.documentElement`.
- Components use Tailwind utility classes and shared tokens such as `w-sidebar`, `rounded-control`, `rounded-panel`, `border-border`, `text-muted`, `text-caption`, and `shadow-panel`. Do not introduce component-specific CSS unless the repository guidelines are updated to permit it.
- The sidebar icons are text glyphs styled with Tailwind; there are no inline SVG icons in the sidebar or accordion.

## 6. Verification

Primary checks:

```text
npm run build
npm run lint
```

The ESLint configuration scopes type-aware rules to TypeScript source files, while JavaScript configuration files use the base ESLint rules.

## 7. Known gaps

- Sidebar state is not persisted or backed by an API.
- Task detail inspection and inline editing are available from kanban cards, list rows, and archived-ticket rows through the dashboard-owned detail modal. The task model supports one-level subtasks through `parentTaskId`; subtasks are excluded from board/list top-level cards, counted on their parent card, and managed from the parent detail inspector. Tasks use `archivedAt` for soft archival; active views filter it out and the dashboard's archived mode filters it in per board.
- Every board is initialized with ToDo, In-progress, and Done statuses. Newly created boards receive those statuses in the board reducer.
- Conditional board, archived, and sidebar-tree branches use `React.lazy` with local Suspense boundaries so inactive views and collapsed navigation trees are loaded on demand. Small components needed together are bundled at the parent boundary to avoid waterfall requests; first-click creation dialogs remain synchronous.
- Task creation is handled by a shared modal flow; `boardReducer` owns task creation and status movement while dashboard/board components own transient modal and drag/drop UI state.
- Kanban drag state is owned by `Board`; the active source card fades in place during native drag and restores or moves on drag end/drop.
- `moveTask` normalizes positions in both source and destination statuses. Board columns accept cross-status indexed drops; the dense list view uses the same indexed action but only accepts drops within the task's current status.
- `TaskCard` and the collapsible `BoardList` expose assignee initials, priority badges, due dates, and a conditional subtask-count badge. The whole card is keyboard/click actionable in both views. The list view supports ascending/descending due-date and priority sorting, while `TaskDetailModal` is owned by `Dashboard`, receives the selected task/status plus board tasks and user data, and dispatches access-checked inline edits through `updateTask`. Detail header, description, subtasks, and metadata sections are separate lazy-loaded components under `src/components/TaskDetail/`.
- Container creation validates the workspace → space → folder → list hierarchy; updates rename/position, and folder/board deletes cascade through descendants, statuses, and tasks. Space deletion is intentionally not exposed in the sidebar; the workspace root is editable but not exposed as deletable UI.
- Seeded users are Alice (admin), Bob (Engineering member), and Carol (Product member). Admins can create/edit spaces and assign users through the reusable `MultiInput`; member navigation and dashboard content are filtered to their granted spaces. The header user selector is a local role-switching fixture for phase-one validation.
- Permission-container edits replace the resource's grant set and visibility through `updateContainerAccess`; only admins can control those fields. The modal preserves the allow/deny distinction and deny takes precedence. Ticket creation stores at most one assignee ID and presents users through the shared `Select` primitive.
- `useAccessControl.getFirstAccessibleBoard` resolves the first board under the first accessible space for user switching. A newly created space automatically grants access to its creator; members can create descendants under spaces they can access.
- `board.lastError` stores clear mutation errors for denied or invalid container/task operations, while `board.lastFeedback` emits a sequenced success/error event for the shared toast provider. The dashboard still presents a 403 message when a stale selection points at a denied resource.
- The current model can extend to team grants by adding a subject type/key to `TGrant` (for example `subjectType: 'user' | 'team'`, `subjectId`) and resolving team membership in the same selector predicate; no team inheritance is implemented in phase 3.
- Task insertion validates title length, primary list ownership, list status membership, priority, assignee array, ISO timestamps, and non-negative position; task movement cannot cross primary lists.
- Task insertion validates one-level parentage: a subtask must reference a top-level task in the same board, and a subtask cannot itself receive children.
- Archive/unarchive mutations are permission checked against the task's primary board. Archiving a task archives its one-level subtask tree; unarchiving restores the tree to the board's ToDo status and normal active views.
- The layout currently renders the sidebar without controlled `currentView` props; the sidebar remains backward-compatible with the earlier controlled navigation API.

## 8. Agent/tooling integration

The canonical repository context is stored under `Agents/`. Claude Code loads the project skill from `.claude/skills/flowboard/SKILL.md` and invokes it as `/flowboard`. Codex uses the matching user-level skill at `~/.codex/skills/flowboard/SKILL.md` and invokes it as `$flowboard` or through automatic skill selection. Both entry points direct agents to the same `Agents` files; update those files when the workflow or architecture changes.

## 9. Testing

- Store and selector tests live under `tests/store/` and use Vitest against isolated Redux stores created by `makeStore`. They cover permission-filtered container trees and forbidden task mutations.
- Browser integration tests live under `tests/e2e/` and use Playwright. `playwright.config.ts` starts the Vite dev server and runs the user-visible sidebar permission flow in Playwright-managed Chromium.
- `npm run test` runs the unit/store suite, `npm run test:e2e:install` installs the managed Chromium browser, and `npm run test:e2e` automatically runs that install hook before the Playwright suite. `npm run build` includes the test/config TypeScript project through `tsconfig.test.json`.
