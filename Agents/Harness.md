## Reuse design components before creating new components

- Before creating a component for a local use case, inspect `src/components/DesignComponents/` for an existing reusable primitive.
- Use shared design primitives directly when they cover the interaction, such as `Button` for buttons and `Input` for text inputs.
- If no primitive exists, create a generic, extensible design component under `src/components/DesignComponents/` before adding a feature-specific wrapper.
- Do not create one-off components that only rename or lightly wrap a design primitive.

## Centralized transition policy

- Do not add component-level `transition-*` utilities when the element already participates in the global transition policy in `src/styles/index.css`.
- If a new state property, such as drag opacity, needs the shared transition timing, extend the centralized `transition-property` declaration instead of overriding it locally.

## React form reset and conditional UI state

- Avoid synchronously calling `setState` inside an effect just to reset a form when a modal opens; React’s typed lint rules flag this as a cascading render risk.
- Prefer mounting the conditional form only while it is open and use a stable key when the target entity changes so its initial state resets naturally.

## Shared lazy-loading boundary

- Use `src/utils/withSuspense.tsx` for lazy-loaded components instead of repeating `lazy` and `Suspense` wrappers at feature boundaries.
- Keep the fallback with the lazy component definition so every conditional branch has a deliberate loading state.

## Domain-safe drag and drop

- Drag/drop handlers should pass an explicit insertion index to Redux; reducers must normalize positions for both the source and destination status after every move.
- Keep cross-column movement rules in the owning view: Kanban may change status, while list-view reordering must reject drops into a different status section.

## Preserve established list presentation

- When extending list-view parity, retain the existing collapsible accordion/grouped-card presentation unless the user explicitly requests a different layout.
- Add missing task metadata and interactions to the existing `Accordion`, `AccordionItem`, and `TaskCard` composition instead of replacing it with a table or unrelated structure.
- Preserve current view-specific behavior while adding parity: list reordering stays within its status group, and sorting should reorder tasks inside the established groups rather than flattening the view.

## Native date and select controls

- Do not force native date controls through a floating-label text-input pattern; use the shared `DatePicker` primitive to avoid browser UI and label overlap.
- Use shared `Select` and `DatePicker` design components instead of adding one-off native controls inside feature forms.

## Collapsible navigation and action dialogs

- Do not render create/edit dialogs only inside the conditional children of a collapsible navigation item. The action trigger can remain visible while the accordion is closed, but the dialog will be unmounted and cannot open.
- Keep action dialogs in an always-mounted overlay/portal path separate from the collapsed navigation content. Accordion state should control tree visibility only, not whether an already-triggered dialog can render.

## User-triggered dialog loading

- Do not lazy-load a dialog that must open on the first click. A lazy `AddForm` or modal boundary can defer the first render and make repeated clicks appear necessary or race the target state.
- Import first-click dialogs synchronously; reserve `withSuspense` boundaries for inactive navigation or content branches where loading latency is expected and visible.
