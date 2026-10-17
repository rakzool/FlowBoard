# FlowBoard repository guidelines

> Project owner: add the non-negotiable repository rules below. Agents must read this file before making changes and must follow every completed rule.

## Non-negotiable rules

<!-- Add rules as numbered items. Keep each rule concrete and testable. -->

1. no custome CSS , either inline or in seprate file, only use tailwind utilities for all styling
2. no Hardcoded SVG in tsx components , if is must that keep in constant files only and reuse 
3. all components must be max 200 lines , and must not exceed this , find a way to refactore if exceeded.
4. only one component per tsx file.
5. do not use deprecated types, APIs, or imports; replace them with the current supported equivalent before merging.

## Architecture and state rules

<!-- Record ownership boundaries, Redux conventions, API/data rules, and persistence expectations here. -->

## UI and accessibility rules
1. Re-use Design coponents for TSX elements (example use paper with additional classes), keep bare HTML to minimum.
2. if incountered a case for which a design element is not avaliable then , create one unless it is a very special usecase that is relevant only to current scenario.
3. always add keyboard accesibility while designing design components.
4. any and all Design componets are to be created under the src/DesignComponent directory with their custome hooks if any under the hooks folder in the same directory.
5. keep the design Components as generic as possible so that it can serve a wide varity of use case.

<!-- Record component, responsive, keyboard, semantic HTML, and accessibility requirements here. -->

## Verification requirements

<!-- Record required build, lint, test, and visual verification commands here. -->

## Prohibited patterns

<!-- Record known anti-patterns here. Historical patterns belong in Agents/Harness.md. -->
